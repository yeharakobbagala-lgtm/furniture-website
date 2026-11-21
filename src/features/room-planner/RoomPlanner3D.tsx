"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomItem, RoomDoor, RoomWindow } from "@/types";
import { FloorFinishType, WallFinishType } from "@/stores/roomDesignerStore";
import { Camera, Eye, Layers, Maximize2, RotateCw } from "lucide-react";

interface RoomPlanner3DProps {
  items: RoomItem[];
  doors: RoomDoor[];
  windows: RoomWindow[];
  roomWidth: number; // meters
  roomLength: number; // meters
  wallHeight: number; // meters
  wallThickness: number; // meters
  wallColor: string;
  floorType: FloorFinishType;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
}

export default function RoomPlanner3D({
  items,
  doors,
  windows,
  roomWidth,
  roomLength,
  wallHeight = 2.8,
  wallThickness = 0.15,
  wallColor = "#F4F7F2",
  floorType = "herringbone",
  selectedItemId,
  onSelectItem,
}: RoomPlanner3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [cameraView, setCameraView] = useState<"orbit" | "eye-level" | "top">("orbit");

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 560;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#E5EDE1");
    scene.fog = new THREE.FogExp2("#E5EDE1", 0.025);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(roomWidth * 1.2, wallHeight * 2.2, roomLength * 1.5);
    cameraRef.current = camera;

    // 3. Renderer with Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    mountRef.current.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below floor
    controls.minDistance = 2;
    controls.maxDistance = 30;
    controls.target.set(roomWidth / 2, wallHeight / 3, roomLength / 2);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0xd2dbd0, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ea, 1.2);
    sunLight.position.set(roomWidth * 1.5, wallHeight * 3.5, roomLength * 1.8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 40;
    const d = Math.max(roomWidth, roomLength) * 1.5;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Warm ceiling spot light
    const interiorSpot = new THREE.PointLight(0xffeedd, 0.8, 12, 1.5);
    interiorSpot.position.set(roomWidth / 2, wallHeight - 0.2, roomLength / 2);
    scene.add(interiorSpot);

    // 6. Floor Geometry & Procedural Material
    const floorColors: Record<FloorFinishType, string> = {
      "light-oak": "#E8D8C3",
      "dark-walnut": "#3D2F24",
      "concrete": "#C4C8C5",
      "herringbone": "#D8C5A8",
      "marble": "#EDE8DF",
      "terrazzo": "#DFDDD7",
    };

    const floorColorHex = floorColors[floorType] || "#D8C5A8";

    // Generate procedural parquet pattern texture on canvas
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = floorColorHex;
      ctx.fillRect(0, 0, 512, 512);

      // Draw subtle wood plank joints or herringbone lines
      ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 2;
      const step = 64;
      for (let x = 0; x <= 512; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y <= 512; y += step * 2) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }
    }
    const floorTex = new THREE.CanvasTexture(canvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(roomWidth, roomLength);

    const floorGeo = new THREE.PlaneGeometry(roomWidth, roomLength);
    const floorMat = new THREE.MeshStandardMaterial({
      color: floorColorHex,
      map: floorTex,
      roughness: floorType === "marble" ? 0.2 : 0.6,
      metalness: floorType === "marble" ? 0.1 : 0.0,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(roomWidth / 2, 0, roomLength / 2);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 7. Baseplate border outside room
    const baseplateGeo = new THREE.PlaneGeometry(roomWidth + 4, roomLength + 4);
    const baseplateMat = new THREE.MeshStandardMaterial({ color: "#D2DBD0", roughness: 0.9 });
    const baseplateMesh = new THREE.Mesh(baseplateGeo, baseplateMat);
    baseplateMesh.rotation.x = -Math.PI / 2;
    baseplateMesh.position.set(roomWidth / 2, -0.01, roomLength / 2);
    baseplateMesh.receiveShadow = true;
    scene.add(baseplateMesh);

    // 8. 3D Architectural Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: wallColor || "#F4F7F2",
      roughness: 0.85,
    });

    const createWallSegment = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, wallMaterial);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    };

    // North Wall (Z = 0)
    createWallSegment(
      roomWidth + wallThickness * 2,
      wallHeight,
      wallThickness,
      roomWidth / 2,
      wallHeight / 2,
      -wallThickness / 2
    );

    // South Wall (Z = roomLength)
    createWallSegment(
      roomWidth + wallThickness * 2,
      wallHeight,
      wallThickness,
      roomWidth / 2,
      wallHeight / 2,
      roomLength + wallThickness / 2
    );

    // West Wall (X = 0)
    createWallSegment(
      wallThickness,
      wallHeight,
      roomLength,
      -wallThickness / 2,
      wallHeight / 2,
      roomLength / 2
    );

    // East Wall (X = roomWidth)
    createWallSegment(
      wallThickness,
      wallHeight,
      roomLength,
      roomWidth + wallThickness / 2,
      wallHeight / 2,
      roomLength / 2
    );

    // Baseboard moldings
    const baseboardMat = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.5 });
    const baseboardH = 0.12;
    const baseboardT = 0.02;

    const createBaseboard = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, baseboardMat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
    };
    createBaseboard(roomWidth, baseboardH, baseboardT, roomWidth / 2, baseboardH / 2, baseboardT / 2);
    createBaseboard(roomWidth, baseboardH, baseboardT, roomWidth / 2, baseboardH / 2, roomLength - baseboardT / 2);
    createBaseboard(baseboardT, baseboardH, roomLength, baseboardT / 2, baseboardH / 2, roomLength / 2);
    createBaseboard(baseboardT, baseboardH, roomLength, roomWidth - baseboardT / 2, baseboardH / 2, roomLength / 2);

    // 9. Doors & Windows in 3D
    doors.forEach((door) => {
      let dx = door.offset + door.width / 2;
      let dz = 0;
      let rotY = 0;

      if (door.wall === "top") {
        dx = door.offset + door.width / 2;
        dz = 0.05;
      } else if (door.wall === "bottom") {
        dx = door.offset + door.width / 2;
        dz = roomLength - 0.05;
      } else if (door.wall === "left") {
        dx = 0.05;
        dz = door.offset + door.width / 2;
        rotY = Math.PI / 2;
      } else if (door.wall === "right") {
        dx = roomWidth - 0.05;
        dz = door.offset + door.width / 2;
        rotY = Math.PI / 2;
      }

      // Door Frame
      const frameGeo = new THREE.BoxGeometry(door.width, 2.1, 0.08);
      const frameMat = new THREE.MeshStandardMaterial({ color: "#2C3531", roughness: 0.5 });
      const doorMesh = new THREE.Mesh(frameGeo, frameMat);
      doorMesh.position.set(dx, 1.05, dz);
      doorMesh.rotation.y = rotY;
      doorMesh.castShadow = true;
      scene.add(doorMesh);

      // Brass door handle
      const handleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12);
      const handleMat = new THREE.MeshStandardMaterial({ color: "#D4AF37", metalness: 0.8, roughness: 0.2 });
      const handleMesh = new THREE.Mesh(handleGeo, handleMat);
      handleMesh.rotation.z = Math.PI / 2;
      handleMesh.position.set(dx + (rotY === 0 ? 0.35 : 0), 1.0, dz + (rotY !== 0 ? 0.35 : 0.05));
      scene.add(handleMesh);
    });

    windows.forEach((win) => {
      let wx = win.offset + win.width / 2;
      let wz = 0;
      let rotY = 0;

      if (win.wall === "top") {
        wx = win.offset + win.width / 2;
        wz = 0.05;
      } else if (win.wall === "bottom") {
        wx = win.offset + win.width / 2;
        wz = roomLength - 0.05;
      } else if (win.wall === "left") {
        wx = 0.05;
        wz = win.offset + win.width / 2;
        rotY = Math.PI / 2;
      } else if (win.wall === "right") {
        wx = roomWidth - 0.05;
        wz = win.offset + win.width / 2;
        rotY = Math.PI / 2;
      }

      // Window Glass & Frame
      const winGeo = new THREE.BoxGeometry(win.width, 1.4, 0.06);
      const winMat = new THREE.MeshPhysicalMaterial({
        color: 0x88bbdd,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5,
      });
      const winMesh = new THREE.Mesh(winGeo, winMat);
      winMesh.position.set(wx, 1.6, wz);
      winMesh.rotation.y = rotY;
      scene.add(winMesh);
    });

    // 10. Parametric 3D Furniture Objects
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);

    items.forEach((item) => {
      const isSelected = selectedItemId === item.id;
      const itemMeshGroup = new THREE.Group();

      // Convert from 2D canvas pixel coordinates (100px = 1m) to 3D meter space
      const posX = item.x / 100 + item.width / 200;
      const posZ = item.y / 100 + item.height / 200;
      const widthM = item.width / 100;
      const depthM = item.height / 100;
      const heightM = item.realHeightCm ? item.realHeightCm / 100 : 0.75;
      const rotY = -((item.rotation || 0) * Math.PI) / 180;

      const mainColor = item.colorHex || "#465D45";
      const fabricMat = new THREE.MeshStandardMaterial({
        color: mainColor,
        roughness: 0.8,
        metalness: 0.05,
      });

      const woodMat = new THREE.MeshStandardMaterial({
        color: item.category === "dining-tables" ? "#EADDC7" : "#5C4A3A",
        roughness: 0.4,
        metalness: 0.1,
      });

      // Construct category-tailored 3D geometric shapes
      if (item.category === "sofas") {
        // Base / Cushion
        const seatH = heightM * 0.5;
        const seatGeo = new THREE.BoxGeometry(widthM, seatH, depthM);
        const seatMesh = new THREE.Mesh(seatGeo, fabricMat);
        seatMesh.position.y = seatH / 2;
        seatMesh.castShadow = true;
        seatMesh.receiveShadow = true;
        itemMeshGroup.add(seatMesh);

        // Backrest
        const backH = heightM * 0.5;
        const backD = depthM * 0.28;
        const backGeo = new THREE.BoxGeometry(widthM, backH, backD);
        const backMesh = new THREE.Mesh(backGeo, fabricMat);
        backMesh.position.set(0, seatH + backH / 2, -depthM / 2 + backD / 2);
        backMesh.castShadow = true;
        itemMeshGroup.add(backMesh);

        // Armrests
        const armW = widthM * 0.12;
        const armH = heightM * 0.35;
        const armGeo = new THREE.BoxGeometry(armW, armH, depthM);
        const armLeft = new THREE.Mesh(armGeo, fabricMat);
        armLeft.position.set(-widthM / 2 + armW / 2, seatH + armH / 2, 0);
        armLeft.castShadow = true;
        itemMeshGroup.add(armLeft);

        const armRight = new THREE.Mesh(armGeo, fabricMat);
        armRight.position.set(widthM / 2 - armW / 2, seatH + armH / 2, 0);
        armRight.castShadow = true;
        itemMeshGroup.add(armRight);
      } else if (item.category === "beds") {
        // Platform Frame
        const frameH = 0.25;
        const frameGeo = new THREE.BoxGeometry(widthM, frameH, depthM);
        const frameMesh = new THREE.Mesh(frameGeo, woodMat);
        frameMesh.position.y = frameH / 2;
        frameMesh.castShadow = true;
        itemMeshGroup.add(frameMesh);

        // Mattress
        const matH = 0.3;
        const matGeo = new THREE.BoxGeometry(widthM * 0.92, matH, depthM * 0.92);
        const matMaterial = new THREE.MeshStandardMaterial({ color: "#FAF9F5", roughness: 0.9 });
        const matMesh = new THREE.Mesh(matGeo, matMaterial);
        matMesh.position.set(0, frameH + matH / 2, 0);
        matMesh.castShadow = true;
        itemMeshGroup.add(matMesh);

        // Headboard
        const headH = heightM;
        const headD = 0.15;
        const headGeo = new THREE.BoxGeometry(widthM, headH, headD);
        const headMesh = new THREE.Mesh(headGeo, fabricMat);
        headMesh.position.set(0, headH / 2, -depthM / 2 + headD / 2);
        headMesh.castShadow = true;
        itemMeshGroup.add(headMesh);

        // Pillows
        const pillowGeo = new THREE.BoxGeometry(widthM * 0.35, 0.12, depthM * 0.2);
        const pillowMat = new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.9 });
        const p1 = new THREE.Mesh(pillowGeo, pillowMat);
        p1.position.set(-widthM * 0.22, frameH + matH + 0.06, -depthM * 0.25);
        const p2 = new THREE.Mesh(pillowGeo, pillowMat);
        p2.position.set(widthM * 0.22, frameH + matH + 0.06, -depthM * 0.25);
        itemMeshGroup.add(p1);
        itemMeshGroup.add(p2);
      } else if (item.category === "dining-tables" || item.category === "coffee-tables") {
        // Table Top Slab
        const topH = item.category === "dining-tables" ? 0.06 : 0.04;
        const topGeo = new THREE.BoxGeometry(widthM, topH, depthM);
        const topMesh = new THREE.Mesh(topGeo, woodMat);
        topMesh.position.y = heightM - topH / 2;
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        itemMeshGroup.add(topMesh);

        // Fluted Pillar Pedestals or 4 Legs
        if (widthM > 1.8) {
          // Dual Pedestals for large dining tables
          const pedGeo = new THREE.CylinderGeometry(depthM * 0.25, depthM * 0.25, heightM - topH, 24);
          const ped1 = new THREE.Mesh(pedGeo, woodMat);
          ped1.position.set(-widthM * 0.28, (heightM - topH) / 2, 0);
          ped1.castShadow = true;
          const ped2 = new THREE.Mesh(pedGeo, woodMat);
          ped2.position.set(widthM * 0.28, (heightM - topH) / 2, 0);
          ped2.castShadow = true;
          itemMeshGroup.add(ped1);
          itemMeshGroup.add(ped2);
        } else {
          // 4 Corner Legs
          const legW = 0.05;
          const legGeo = new THREE.BoxGeometry(legW, heightM - topH, legW);
          const xOff = widthM / 2 - legW;
          const zOff = depthM / 2 - legW;
          const legPositions = [
            [-xOff, zOff],
            [xOff, zOff],
            [-xOff, -zOff],
            [xOff, -zOff],
          ];
          legPositions.forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(legGeo, woodMat);
            leg.position.set(lx, (heightM - topH) / 2, lz);
            leg.castShadow = true;
            itemMeshGroup.add(leg);
          });
        }
      } else if (item.category === "lounge-chairs" || item.category === "dining-chairs") {
        // Accent Armchair Seat
        const seatH = 0.42;
        const seatGeo = new THREE.BoxGeometry(widthM * 0.85, 0.12, depthM * 0.85);
        const seatMesh = new THREE.Mesh(seatGeo, fabricMat);
        seatMesh.position.y = seatH;
        seatMesh.castShadow = true;
        itemMeshGroup.add(seatMesh);

        // Curved or angled back
        const backH = heightM - seatH;
        const backGeo = new THREE.BoxGeometry(widthM * 0.85, backH, 0.1);
        const backMesh = new THREE.Mesh(backGeo, fabricMat);
        backMesh.position.set(0, seatH + backH / 2, -depthM * 0.35);
        backMesh.rotation.x = -0.15;
        backMesh.castShadow = true;
        itemMeshGroup.add(backMesh);

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.02, 0.015, seatH);
        const xOff = widthM * 0.35;
        const zOff = depthM * 0.35;
        [[-xOff, zOff], [xOff, zOff], [-xOff, -zOff], [xOff, -zOff]].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(legGeo, woodMat);
          leg.position.set(lx, seatH / 2, lz);
          leg.castShadow = true;
          itemMeshGroup.add(leg);
        });
      } else {
        // Storage / Credenzas / Desks
        const bodyGeo = new THREE.BoxGeometry(widthM, heightM * 0.9, depthM);
        const bodyMesh = new THREE.Mesh(bodyGeo, woodMat);
        bodyMesh.position.y = (heightM * 0.9) / 2 + heightM * 0.1;
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        itemMeshGroup.add(bodyMesh);

        // Legs / Plinth
        const plinthGeo = new THREE.BoxGeometry(widthM * 0.95, heightM * 0.1, depthM * 0.9);
        const plinthMesh = new THREE.Mesh(plinthGeo, new THREE.MeshStandardMaterial({ color: "#1E2322" }));
        plinthMesh.position.y = (heightM * 0.1) / 2;
        itemMeshGroup.add(plinthMesh);
      }

      // Selection Highlight Bounding Box (Terracotta outline)
      if (isSelected) {
        const bboxGeo = new THREE.BoxGeometry(widthM + 0.05, heightM + 0.05, depthM + 0.05);
        const edges = new THREE.EdgesGeometry(bboxGeo);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0xb85232, linewidth: 3 })
        );
        line.position.y = heightM / 2;
        itemMeshGroup.add(line);
      }

      // Position & Rotate Item
      itemMeshGroup.position.set(posX, 0, posZ);
      itemMeshGroup.rotation.y = rotY;
      furnitureGroup.add(itemMeshGroup);
    });

    // 11. Animation Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 12. Handle Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth || 800;
      const h = mountRef.current.clientHeight || 560;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, [
    items,
    doors,
    windows,
    roomWidth,
    roomLength,
    wallHeight,
    wallThickness,
    wallColor,
    floorType,
    selectedItemId,
  ]);

  // Camera presets
  const handleSetCameraView = (view: "orbit" | "eye-level" | "top") => {
    setCameraView(view);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (view === "top") {
      camera.position.set(roomWidth / 2, Math.max(roomWidth, roomLength) * 1.8, roomLength / 2 + 0.01);
      controls.target.set(roomWidth / 2, 0, roomLength / 2);
    } else if (view === "eye-level") {
      camera.position.set(roomWidth * 0.15, 1.6, roomLength * 0.85);
      controls.target.set(roomWidth / 2, 1.2, roomLength / 2);
    } else {
      camera.position.set(roomWidth * 1.2, wallHeight * 2.2, roomLength * 1.5);
      controls.target.set(roomWidth / 2, wallHeight / 3, roomLength / 2);
    }
    controls.update();
  };

  return (
    <div className="relative w-full h-full min-h-[560px] bg-sage-50 overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full min-h-[560px]" />

      {/* Floating 3D Camera Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-ivory-warm/95 backdrop-blur-md border border-borderSage shadow-card text-xs">
        <button
          onClick={() => handleSetCameraView("orbit")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            cameraView === "orbit"
              ? "bg-forest-dark text-white shadow-sm"
              : "text-forest-deep hover:bg-sage-100"
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" /> Orbit View
        </button>
        <button
          onClick={() => handleSetCameraView("eye-level")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            cameraView === "eye-level"
              ? "bg-forest-dark text-white shadow-sm"
              : "text-forest-deep hover:bg-sage-100"
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-terracotta" /> Eye Level (1.6m)
        </button>
        <button
          onClick={() => handleSetCameraView("top")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
            cameraView === "top"
              ? "bg-forest-dark text-white shadow-sm"
              : "text-forest-deep hover:bg-sage-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> 3D Overhead
        </button>
      </div>

      {/* Hint overlay */}
      <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-forest-deep/80 text-white text-[11px] backdrop-blur-sm shadow-soft pointer-events-none">
        Left Click: Rotate • Right Click / Two-finger: Pan • Scroll: Zoom
      </div>
    </div>
  );
}
