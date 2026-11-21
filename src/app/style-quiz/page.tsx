"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Sparkles,
  ShoppingBag,
  Star,
  Layers,
  Layout,
} from "lucide-react";
import { quizQuestions, styleQuizResults } from "@/data/quizQuestions";
import { products } from "@/data/products";
import { FurnitureStyle, StyleQuizResult } from "@/types";
import { useUserStore } from "@/stores/userStore";
import { useCartStore } from "@/stores/cartStore";
import ProductCard from "@/components/products/ProductCard";

export default function StyleQuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState<StyleQuizResult | null>(null);

  const saveQuizResult = useUserStore((s) => s.saveQuizResult);
  const userResult = useUserStore((s) => s.styleQuizResult);

  const currentQ = quizQuestions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100);

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: optionId,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate final style
      calculateAndFinish();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateAndFinish = () => {
    const scores: Record<string, number> = {
      Scandinavian: 0,
      "Modern Luxury": 0,
      Contemporary: 0,
      Minimalist: 0,
      "Mid-Century Modern": 0,
      Industrial: 0,
      Classic: 0,
    };

    // Tally up scores
    quizQuestions.forEach((q) => {
      const chosenOptionId = selectedAnswers[q.id];
      if (chosenOptionId) {
        const option = q.options.find((opt) => opt.id === chosenOptionId);
        if (option && option.styleScores) {
          Object.entries(option.styleScores).forEach(([style, score]) => {
            if (scores[style] !== undefined) {
              scores[style] += score || 0;
            }
          });
        }
      }
    });

    // Find style with highest score
    let bestStyle = "Scandinavian";
    let highestScore = -1;
    Object.entries(scores).forEach(([style, score]) => {
      if (score > highestScore) {
        highestScore = score;
        bestStyle = style;
      }
    });

    const result = styleQuizResults[bestStyle] || styleQuizResults.Scandinavian;
    setCalculatedResult(result);
    saveQuizResult(result);
    setQuizCompleted(true);
  };

  const restartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setCalculatedResult(null);
  };

  // Find products matching the calculated style
  const matchingProducts = useMemo(() => {
    if (!calculatedResult) return [];
    return products.filter((p) => p.style === calculatedResult.style).slice(0, 4);
  }, [calculatedResult]);

  return (
    <div className="w-full bg-sage-light min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {!quizCompleted ? (
          /* QUIZ QUESTIONS STEPPER */
          <div className="bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-12 shadow-floating space-y-8 animate-fadeIn">
            {/* Top Bar with Progress */}
            <div>
              <div className="flex items-center justify-between text-xs text-forest-muted mb-2 font-semibold">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-terracotta">
                  <Compass className="w-4 h-4" /> Question {currentQuestionIndex + 1} of{" "}
                  {quizQuestions.length}
                </span>
                <span>{progressPercent}% completed</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-sage-200 overflow-hidden">
                <div
                  className="h-full bg-terracotta transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Heading */}
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest-deep">
                {currentQ.question}
              </h2>
              <p className="text-sm text-forest-muted">{currentQ.description}</p>
            </div>

            {/* 4 Photo-Based Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 flex flex-col justify-end ${
                      isSelected
                        ? "border-terracotta ring-4 ring-terracotta/20 shadow-card scale-[1.01]"
                        : "border-borderSage bg-white hover:border-forest-dark/40 hover:shadow-soft"
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-sage-50">
                      <Image
                        src={opt.image}
                        alt={opt.label}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/20 to-transparent" />

                      {/* Selected check badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-terracotta text-white flex items-center justify-center shadow-soft">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      {/* Label over image */}
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white space-y-1">
                        <h4 className="font-heading font-bold text-base leading-snug">
                          {opt.label}
                        </h4>
                        {opt.sublabel && (
                          <p className="text-xs text-sage-200 line-clamp-1">{opt.sublabel}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stepper Footer Controls */}
            <div className="pt-6 border-t border-borderSage/70 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-5 py-2.5 rounded-xl border border-borderSage bg-white text-xs font-bold uppercase text-forest-deep disabled:opacity-40 hover:bg-sage-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedAnswers[currentQ.id]}
                className="px-8 py-3 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 transition-colors flex items-center gap-2 shadow-soft"
              >
                {currentQuestionIndex === quizQuestions.length - 1 ? (
                  <>
                    See My Style Match <Sparkles className="w-4 h-4 text-terracotta" />
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* QUIZ RESULT SCREEN */
          calculatedResult && (
            <div className="space-y-10 animate-fadeIn">
              {/* Main Result Card */}
              <div className="bg-ivory-warm rounded-3xl border border-borderSage p-8 sm:p-14 shadow-floating space-y-8">
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-bold uppercase tracking-widest shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta" /> YOUR MATCHED STYLE
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-forest-deep tracking-tight">
                    {calculatedResult.title}
                  </h1>
                  <p className="text-base sm:text-lg font-serif italic text-terracotta">
                    &ldquo;{calculatedResult.tagline}&rdquo;
                  </p>
                  <p className="text-sm sm:text-base text-forest-muted leading-relaxed">
                    {calculatedResult.description}
                  </p>
                </div>

                {/* Palette Swatches & Material Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-borderSage/70">
                  {/* Curated Palette */}
                  <div className="p-6 rounded-2xl bg-white border border-borderSage space-y-3">
                    <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block">
                      Recommended Color Palette:
                    </span>
                    <div className="grid grid-cols-4 gap-3">
                      {calculatedResult.colorPalette.map((col) => (
                        <div key={col.name} className="flex flex-col items-center gap-1.5 text-center">
                          <div
                            className="w-14 h-14 rounded-2xl border-2 border-borderSage shadow-soft"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span className="text-[11px] font-bold text-forest-deep leading-tight">
                            {col.name}
                          </span>
                          <span className="text-[10px] text-forest-muted uppercase">{col.hex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Materials & Characteristics */}
                  <div className="p-6 rounded-2xl bg-white border border-borderSage space-y-3">
                    <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block">
                      Recommended Materials & Textures:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {calculatedResult.materials.map((mat) => (
                        <span
                          key={mat}
                          className="px-3 py-1 rounded-xl bg-sage-100 text-forest-deep text-xs font-semibold"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block pt-2">
                      What Defines This Style:
                    </span>
                    <ul className="space-y-1.5 text-xs text-forest-muted">
                      {calculatedResult.keyCharacteristics.map((char, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Retake & Actions */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-borderSage/70">
                  <button
                    onClick={restartQuiz}
                    className="text-xs font-bold text-forest-muted hover:text-forest-deep flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Take Quiz Again
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/room-studio/planner"
                      className="px-5 py-3 rounded-xl border border-forest-dark bg-white hover:bg-sage-100 text-forest-deep text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-soft"
                    >
                      <Layout className="w-4 h-4 text-terracotta" /> Open in 2D Room Studio
                    </Link>
                    <Link
                      href={`/shop?style=${encodeURIComponent(calculatedResult.style)}`}
                      className="px-6 py-3 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-soft"
                    >
                      Shop {calculatedResult.style} Furniture <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Matching Recommended Furniture Showcase */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-extrabold text-forest-deep">
                    Tailored Pieces for {calculatedResult.title}
                  </h2>
                  <Link
                    href={`/shop?style=${encodeURIComponent(calculatedResult.style)}`}
                    className="text-xs font-bold text-terracotta hover:underline"
                  >
                    View all matching pieces →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {matchingProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
