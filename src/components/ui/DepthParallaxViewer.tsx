"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface DepthParallaxViewerProps {
  imageSrc: string;
  depthSrc: string;
  alt?: string;
  className?: string;
  thresholdX?: number;
  thresholdY?: number;
  maxTiltAngle?: number;
  interactive?: boolean;
}

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform sampler2D u_depth;
  uniform vec2 u_offset;
  uniform vec2 u_threshold;
  varying vec2 v_texCoord;

  void main() {
    // Read depth value (0.0 = background, 1.0 = closest foreground)
    float depth = texture2D(u_depth, v_texCoord).r;

    // Displace UV coordinates based on depth and mouse position
    vec2 displacement = u_offset * (depth - 0.5) * u_threshold;
    vec2 displacedUV = clamp(v_texCoord - displacement, 0.001, 0.999);

    gl_FragColor = texture2D(u_image, displacedUV);
  }
`;

export default function DepthParallaxViewer({
  imageSrc,
  depthSrc,
  alt = "3D Depth Parallax Furniture",
  className = "",
  thresholdX = 0.035,
  thresholdY = 0.035,
  maxTiltAngle = 6,
  interactive = true,
}: DepthParallaxViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });

    if (!gl) return;

    // Create Shaders
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Geometry Quad
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    const uImageLoc = gl.getUniformLocation(program, "u_image");
    const uDepthLoc = gl.getUniformLocation(program, "u_depth");
    const uOffsetLoc = gl.getUniformLocation(program, "u_offset");
    const uThresholdLoc = gl.getUniformLocation(program, "u_threshold");

    gl.uniform1i(uImageLoc, 0);
    gl.uniform1i(uDepthLoc, 1);
    gl.uniform2f(uThresholdLoc, thresholdX, thresholdY);

    const imgTex = gl.createTexture();
    const depthTex = gl.createTexture();

    const loadTexture = (tex: WebGLTexture | null, image: HTMLImageElement, unit: number) => {
      gl.activeTexture(unit === 0 ? gl.TEXTURE0 : gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    };

    let count = 0;
    const onBothLoaded = () => {
      count++;
      if (count === 2) {
        setIsReady(true);
      }
    };

    const mainImg = new Image();
    mainImg.src = imageSrc;
    const onMainLoad = () => {
      if (canvas) {
        canvas.width = mainImg.naturalWidth || 699;
        canvas.height = mainImg.naturalHeight || 626;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      loadTexture(imgTex, mainImg, 0);
      onBothLoaded();
    };
    if (mainImg.complete) onMainLoad();
    else mainImg.onload = onMainLoad;

    const depthImg = new Image();
    depthImg.src = depthSrc;
    const onDepthLoad = () => {
      loadTexture(depthTex, depthImg, 1);
      onBothLoaded();
    };
    if (depthImg.complete) onDepthLoad();
    else depthImg.onload = onDepthLoad;

    let active = true;
    const render = () => {
      if (!active) return;
      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.08;
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.08;

      gl.uniform2f(uOffsetLoc, mouseCurrent.current.x, mouseCurrent.current.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animFrameRef.current = requestAnimationFrame(render);
    };
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [imageSrc, depthSrc, thresholdX, thresholdY]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
      if (!interactive) return;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const nx = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 0.7)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 0.7)));

      mouseTarget.current = { x: nx, y: -ny };
      setTiltStyle({ x: nx, y: ny });
    },
    [interactive]
  );

  const handleMouseLeave = useCallback(() => {
    mouseTarget.current = { x: 0, y: 0 };
    setTiltStyle({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const onWindowMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      if (
        e.clientY >= rect.top - 250 &&
        e.clientY <= rect.bottom + 250 &&
        e.clientX >= rect.left - 350 &&
        e.clientX <= rect.right + 350
      ) {
        handleMouseMove(e);
      } else {
        mouseTarget.current = { x: 0, y: 0 };
        setTiltStyle({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", onWindowMove, { passive: true });
    return () => window.removeEventListener("mousemove", onWindowMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none flex items-center justify-center transition-transform duration-300 ease-out ${className}`}
      style={{
        perspective: 1200,
      }}
    >
      {/* 3D WebGL Depth Parallax Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-auto h-auto max-w-full max-h-[66vh] object-contain drop-shadow-2xl transition-transform duration-200 ease-out ${
          isReady ? "block" : "hidden"
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${tiltStyle.x * maxTiltAngle}deg) rotateX(${
            -tiltStyle.y * maxTiltAngle
          }deg)`,
        }}
      />

      {/* Immediate 2D Fallback during load or if WebGL not ready */}
      {!isReady && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt}
          className="w-auto h-auto max-w-full max-h-[66vh] object-contain drop-shadow-2xl"
        />
      )}
    </div>
  );
}
