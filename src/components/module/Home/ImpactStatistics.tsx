"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCounter } from "@/hooks/useCounter";
import React from "react";

const stats = [
  { label: "Active Projects", value: 1200, suffix: "+" },
  { label: "CO2 Reduced (Tons)", value: 450000, suffix: "" },
  { label: "Community Members", value: 85000, suffix: "" },
  { label: "Trees Planted", value: 2500000, suffix: "" },
];

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(0) + "k";
  return num.toString();
};

const StatCard = ({ value, label, suffix }: any) => {
  const count = useCounter(value);

  return (
    <div
      className="
      group p-6 text-center rounded-2xl transition-all duration-300
      bg-white/70 dark:bg-white/5 backdrop-blur-md
      border border-green-100 dark:border-white/10
      hover:shadow-lg hover:-translate-y-1
    "
    >
      <div
        className="
        text-3xl md:text-4xl font-extrabold mb-2
        text-green-600 dark:text-green-400
      "
      >
        {formatNumber(count)}
        {suffix}
      </div>

      <div
        className="
        text-sm uppercase tracking-wide
        text-gray-600 dark:text-gray-400
      "
      >
        {label}
      </div>
    </div>
  );
};

const ImpactStatistics = () => {
  return (
    <section
      className="
      relative py-20 overflow-hidden
      bg-gradient-to-b from-green-50 via-white to-green-50
      dark:bg-gradient-to-b dark:from-gray-950 dark:via-black dark:to-gray-900
    "
    >
      {/* 🌿 Glow (light + dark adjusted) */}
      <div
        className="
        absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px]
        bg-green-200/30 dark:bg-green-900/20
        rounded-full blur-3xl
      "
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="
            text-3xl md:text-4xl font-bold
            text-gray-800 dark:text-white
          "
          >
            Our Environmental Impact
          </h2>

          <p
            className="
            mt-3 max-w-xl mx-auto
            text-gray-500 dark:text-gray-400
          "
          >
            Real progress towards a greener future through innovation and
            community efforts.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStatistics;
