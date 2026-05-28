import Dexie, { type Table } from "dexie";
import type { LearningSessionRecord } from "./types";

export class KitakanaStorageDatabase extends Dexie {
  learningSessions!: Table<LearningSessionRecord, number>;

  constructor() {
    super("kitakana-local");

    this.version(1).stores({
      learningSessions: "++id, completedAt, source",
    });
  }
}

export const kitakanaDb = new KitakanaStorageDatabase();
