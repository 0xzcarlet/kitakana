export type LearningPracticeEngine = "multiple-choice" | "typing";
export type LearningKanaTypePreference = "hiragana" | "katakana" | "both";
export type LearningQuestionCount = 5 | 10 | 20;

export type LearningPreferences = {
  defaultEngine: LearningPracticeEngine;
  defaultKanaType: LearningKanaTypePreference;
  questionCount: LearningQuestionCount;
  showRomaji: boolean;
};

const LEARNING_PREFERENCES_STORAGE_KEY = "kitakana.learningPreferences.v1";

export const DEFAULT_LEARNING_PREFERENCES: LearningPreferences = {
  defaultEngine: "multiple-choice",
  defaultKanaType: "hiragana",
  questionCount: 10,
  showRomaji: true,
};

const VALID_ENGINES = new Set<LearningPracticeEngine>([
  "multiple-choice",
  "typing",
]);
const VALID_KANA_TYPES = new Set<LearningKanaTypePreference>([
  "hiragana",
  "katakana",
  "both",
]);
const VALID_QUESTION_COUNTS = new Set<LearningQuestionCount>([5, 10, 20]);

function getLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function normalizeLearningPreferences(value: unknown): LearningPreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_LEARNING_PREFERENCES;
  }

  const candidate = value as Partial<LearningPreferences>;

  return {
    defaultEngine:
      candidate.defaultEngine && VALID_ENGINES.has(candidate.defaultEngine)
        ? candidate.defaultEngine
        : DEFAULT_LEARNING_PREFERENCES.defaultEngine,
    defaultKanaType:
      candidate.defaultKanaType && VALID_KANA_TYPES.has(candidate.defaultKanaType)
        ? candidate.defaultKanaType
        : DEFAULT_LEARNING_PREFERENCES.defaultKanaType,
    questionCount:
      candidate.questionCount && VALID_QUESTION_COUNTS.has(candidate.questionCount)
        ? candidate.questionCount
        : DEFAULT_LEARNING_PREFERENCES.questionCount,
    showRomaji:
      typeof candidate.showRomaji === "boolean"
        ? candidate.showRomaji
        : DEFAULT_LEARNING_PREFERENCES.showRomaji,
  };
}

export function loadLearningPreferences(): LearningPreferences {
  const storage = getLocalStorage();
  if (!storage) return DEFAULT_LEARNING_PREFERENCES;

  const raw = storage.getItem(LEARNING_PREFERENCES_STORAGE_KEY);
  if (!raw) return DEFAULT_LEARNING_PREFERENCES;

  try {
    return normalizeLearningPreferences(JSON.parse(raw));
  } catch {
    return DEFAULT_LEARNING_PREFERENCES;
  }
}

export function saveLearningPreferences(
  preferences: LearningPreferences,
): LearningPreferences {
  const normalized = normalizeLearningPreferences(preferences);
  const storage = getLocalStorage();

  if (storage) {
    storage.setItem(
      LEARNING_PREFERENCES_STORAGE_KEY,
      JSON.stringify(normalized),
    );
  }

  return normalized;
}

export function resetLearningPreferences(): LearningPreferences {
  const storage = getLocalStorage();
  if (storage) {
    storage.removeItem(LEARNING_PREFERENCES_STORAGE_KEY);
  }
  return DEFAULT_LEARNING_PREFERENCES;
}

export const learningPreferenceTestUtils = {
  LEARNING_PREFERENCES_STORAGE_KEY,
  normalizeLearningPreferences,
};
