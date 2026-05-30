import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_LEARNING_PREFERENCES,
  learningPreferenceTestUtils,
  loadLearningPreferences,
  resetLearningPreferences,
  saveLearningPreferences,
} from "./learningPreferences";

class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const { LEARNING_PREFERENCES_STORAGE_KEY } = learningPreferenceTestUtils;

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("learning preferences", () => {
  it("returns defaults when local storage is empty", () => {
    expect(loadLearningPreferences()).toEqual(DEFAULT_LEARNING_PREFERENCES);
  });

  it("saves and loads preferences", () => {
    const preferences = {
      defaultEngine: "typing" as const,
      defaultKanaType: "katakana" as const,
      questionCount: 5 as const,
      showRomaji: false,
    };

    expect(saveLearningPreferences(preferences)).toEqual(preferences);
    expect(loadLearningPreferences()).toEqual(preferences);
  });

  it("falls back to defaults for invalid JSON", () => {
    localStorage.setItem(LEARNING_PREFERENCES_STORAGE_KEY, "{nope");

    expect(loadLearningPreferences()).toEqual(DEFAULT_LEARNING_PREFERENCES);
  });

  it("falls back per field for partial or invalid values", () => {
    localStorage.setItem(
      LEARNING_PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        defaultEngine: "typing",
        defaultKanaType: "romaji",
        questionCount: 99,
        showRomaji: false,
      }),
    );

    expect(loadLearningPreferences()).toEqual({
      defaultEngine: "typing",
      defaultKanaType: DEFAULT_LEARNING_PREFERENCES.defaultKanaType,
      questionCount: DEFAULT_LEARNING_PREFERENCES.questionCount,
      showRomaji: false,
    });
  });

  it("resets preferences to defaults", () => {
    saveLearningPreferences({
      defaultEngine: "typing",
      defaultKanaType: "both",
      questionCount: 20,
      showRomaji: false,
    });

    expect(resetLearningPreferences()).toEqual(DEFAULT_LEARNING_PREFERENCES);
    expect(loadLearningPreferences()).toEqual(DEFAULT_LEARNING_PREFERENCES);
  });
});
