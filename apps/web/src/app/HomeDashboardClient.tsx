"use client";

import { useEffect, useState } from "react";
import {
  getHomeLearningStats,
  type HomeLearningStats,
} from "@kitakana/storage";
import { HomeDashboard, type HomeDashboardStats } from "@kitakana/ui";

function toDashboardStats(stats: HomeLearningStats): HomeDashboardStats {
  return {
    accuracy: stats.accuracy,
    correctAnswers: stats.correctAnswers,
    sessionsCount: stats.sessionsCount,
    streakDays: stats.streakDays,
    totalAnswers: stats.totalAnswers,
  };
}

export function HomeDashboardClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<HomeDashboardStats>();

  useEffect(() => {
    let isActive = true;

    getHomeLearningStats()
      .then((nextStats) => {
        if (isActive) {
          setStats(toDashboardStats(nextStats));
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to load local learning stats.", error);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return <HomeDashboard isLoading={isLoading} stats={stats} />;
}
