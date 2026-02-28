"use client";

import { useState, useEffect } from "react";
import { TripPlan, Day } from "@/types/trip";
import { createEmptyTripPlan, encodeTripPlan, decodeTripPlan, generateId } from "@/lib/trip-utils";
import { DayEditor } from "@/components/DayEditor";
import { TripTimeline } from "@/components/TripTimeline";

export default function HomePage() {
  const [tripPlan, setTripPlan] = useState<TripPlan>(createEmptyTripPlan());
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [copied, setCopied] = useState(false);

  // Load from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get("plan");
      if (encoded) {
        const decoded = decodeTripPlan(encoded);
        if (decoded) {
          setTripPlan(decoded);
          setMode("view");
        }
      }
    }
  }, []);

  const addDay = () => {
    const lastDate = tripPlan.days[tripPlan.days.length - 1]?.date;
    const nextDate = lastDate
      ? new Date(new Date(lastDate).getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      : new Date().toISOString().split("T")[0];

    const newDay: Day = {
      date: nextDate,
      locations: [],
    };
    setTripPlan({ ...tripPlan, days: [...tripPlan.days, newDay] });
  };

  const updateDay = (index: number, day: Day) => {
    const newDays = [...tripPlan.days];
    newDays[index] = day;
    setTripPlan({ ...tripPlan, days: newDays });
  };

  const deleteDay = (index: number) => {
    const newDays = tripPlan.days.filter((_, i) => i !== index);
    setTripPlan({ ...tripPlan, days: newDays.length > 0 ? newDays : [{ date: new Date().toISOString().split("T")[0], locations: [] }] });
  };

  const shareTrip = () => {
    const encoded = encodeTripPlan(tripPlan);
    const url = `${window.location.origin}${window.location.pathname}?plan=${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTrip = () => {
    window.history.pushState({}, "", window.location.pathname);
    setTripPlan(createEmptyTripPlan());
    setMode("edit");
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">✈️ Trippy</h1>
          <p className="text-gray-600">旅行経路を作成してURLで共有しよう</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("edit")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === "edit"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                編集
              </button>
              <button
                onClick={() => setMode("view")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === "view"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                プレビュー
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shareTrip}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                {copied ? "✓ コピー済み" : "📋 共有リンクをコピー"}
              </button>
              <button
                onClick={resetTrip}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                新規作成
              </button>
            </div>
          </div>

          {mode === "edit" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                旅行タイトル
              </label>
              <input
                type="text"
                value={tripPlan.title}
                onChange={(e) => setTripPlan({ ...tripPlan, title: e.target.value })}
                placeholder="例: 北海道旅行"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {mode === "edit" ? (
          <div className="space-y-6">
            {tripPlan.days.map((day, index) => (
              <DayEditor
                key={index}
                day={day}
                onUpdate={(d) => updateDay(index, d)}
                onDelete={tripPlan.days.length > 1 ? () => deleteDay(index) : undefined}
              />
            ))}

            <button
              onClick={addDay}
              className="w-full py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
            >
              + 日を追加
            </button>
          </div>
        ) : (
          <TripTimeline plan={tripPlan} />
        )}
      </div>
    </main>
  );
}
