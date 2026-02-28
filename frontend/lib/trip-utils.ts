import { TripPlan } from "@/types/trip";

/**
 * Encode trip plan to URL-safe string
 */
export function encodeTripPlan(plan: TripPlan): string {
  try {
    const json = JSON.stringify(plan);
    const base64 = btoa(encodeURIComponent(json));
    return base64;
  } catch (error) {
    console.error("Failed to encode trip plan:", error);
    return "";
  }
}

/**
 * Decode trip plan from URL-safe string
 */
export function decodeTripPlan(encoded: string): TripPlan | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const plan = JSON.parse(json) as TripPlan;
    return plan;
  } catch (error) {
    console.error("Failed to decode trip plan:", error);
    return null;
  }
}

/**
 * Create empty trip plan
 */
export function createEmptyTripPlan(): TripPlan {
  const today = new Date().toISOString().split("T")[0];
  return {
    title: "新しい旅行プラン",
    days: [
      {
        date: today,
        locations: [],
      },
    ],
  };
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}時間`;
  }
  return `${hours}時間${mins}分`;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
