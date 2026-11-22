import React from "react";
import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import BestSellersSection from "@/components/home/BestSellersSection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import StyleQuizBanner from "@/components/home/StyleQuizBanner";
import RoomStudioBanner from "@/components/home/RoomStudioBanner";
import DesignerSpotlight from "@/components/home/DesignerSpotlight";
import EditorialSection from "@/components/home/EditorialSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Section 1: Hero with modular carousel & testimonial */}
      <Hero />

      {/* Section 2: Shopping by Category (Bento Grid) */}
      <CategorySection />

      {/* Section 4: Best Sellers */}
      <BestSellersSection />

      {/* Section 5: New Arrivals */}
      <NewArrivalsSection />

      {/* Section 6: Find Your Furniture Style Quiz Banner */}
      <StyleQuizBanner />

      {/* Section 7: Room Studio Promotion (2D Planner + Photo Visualizer) */}
      <RoomStudioBanner />

      {/* Section 8: Designer Spotlight */}
      <DesignerSpotlight />

      {/* Section 9: Interior Inspiration / Journal */}
      <EditorialSection />
    </div>
  );
}
