"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  DEFAULT_LEARNING_PREFERENCES,
  loadLearningPreferences,
  resetLearningPreferences,
  saveLearningPreferences,
  type LearningPreferences,
} from "@kitakana/storage";

const LEARNING_PREFERENCES_CHANGE_EVENT = "kitakana:learning-preferences";

function getSnapshot(): string {
  return JSON.stringify(loadLearningPreferences());
}

function getServerSnapshot(): string {
  return JSON.stringify(DEFAULT_LEARNING_PREFERENCES);
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(LEARNING_PREFERENCES_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener(LEARNING_PREFERENCES_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function notifyLearningPreferencesChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LEARNING_PREFERENCES_CHANGE_EVENT));
}

export function useLearningPreferences() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const preferences = useMemo(
    () => JSON.parse(snapshot) as LearningPreferences,
    [snapshot],
  );

  const updatePreferences = useCallback(
    (patch: Partial<LearningPreferences>) => {
      saveLearningPreferences({ ...loadLearningPreferences(), ...patch });
      notifyLearningPreferencesChanged();
    },
    [],
  );

  const resetPreferences = useCallback(() => {
    resetLearningPreferences();
    notifyLearningPreferencesChanged();
  }, []);

  return {
    isLoaded: true,
    preferences,
    resetPreferences,
    updatePreferences,
  };
}
