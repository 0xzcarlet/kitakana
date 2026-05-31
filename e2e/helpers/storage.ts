import type { Page } from "@playwright/test";

export async function getLearningSessionCount(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const request = indexedDB.open("kitakana-local");

        request.onerror = () => resolve(0);
        request.onsuccess = () => {
          const db = request.result;

          if (!db.objectStoreNames.contains("learningSessions")) {
            db.close();
            resolve(0);
            return;
          }

          const transaction = db.transaction("learningSessions", "readonly");
          const countRequest = transaction
            .objectStore("learningSessions")
            .count();

          countRequest.onerror = () => {
            db.close();
            resolve(0);
          };
          countRequest.onsuccess = () => {
            const count = countRequest.result;
            db.close();
            resolve(count);
          };
        };
      }),
  );
}
