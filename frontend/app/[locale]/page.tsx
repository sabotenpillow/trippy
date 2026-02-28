"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { TripPlan, Day } from "@/types/trip";
import { createEmptyTripPlan, encodeTripPlan, decodeTripPlan, generateId } from "@/lib/trip-utils";
import { DayEditor } from "@/components/DayEditor";
import { TripTimeline } from "@/components/TripTimeline";
import { TripMap } from "@/components/TripMap";
import { AdSense } from "@/components/AdSense";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UserButton from "@/components/UserButton";

export default function HomePage() {
  const t = useTranslations('common');
  const tTrip = useTranslations('trip');
  const [tripPlan, setTripPlan] = useState<TripPlan>(createEmptyTripPlan());
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [copied, setCopied] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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

  // Get all locations from all days
  const allLocations = tripPlan.days.flatMap((day) => day.locations);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
            <UserButton />
            <LanguageSwitcher />
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">✈️ {t('appName')}</h1>
            <p className="text-sm md:text-base text-gray-600">{tTrip('title')}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setMode("edit")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md transition-colors text-sm md:text-base ${
                  mode === "edit"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t('editMode')}
              </button>
              <button
                onClick={() => setMode("view")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-md transition-colors text-sm md:text-base ${
                  mode === "view"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t('previewMode')}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={shareTrip}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm md:text-base"
              >
                {copied ? `✓ ${t('urlCopied')}` : `📋 ${t('shareUrl')}`}
              </button>
            </div>
          </div>

          {mode === "edit" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tTrip('title')}
              </label>
              <input
                type="text"
                value={tripPlan.title}
                onChange={(e) => setTripPlan({ ...tripPlan, title: e.target.value })}
                placeholder={tTrip('title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
          )}
        </div>

        {/* Map Section */}
        {allLocations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-800">🗺️ Map</h2>
              <button
                onClick={() => setShowMap(!showMap)}
                className="px-3 py-1 text-xs md:text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                {showMap ? "Hide" : "Show"}
              </button>
            </div>
            {showMap && (
              <TripMap locations={allLocations} apiKey={googleMapsApiKey} />
            )}
          </div>
        )}

        {mode === "edit" ? (
          <div className="space-y-6">
            {tripPlan.days.map((day, index) => (
              <DayEditor
                key={index}
                day={day}
                onUpdate={(d) => updateDay(index, d)}
                onDelete={tripPlan.days.length > 1 ? () => deleteDay(index) : undefined}
                googleMapsApiKey={googleMapsApiKey}
              />
            ))}

            {/* Ad between days and add button */}
            <AdSense
              adSlot="1234567890"
              adFormat="horizontal"
              className="my-6"
            />

            <button
              onClick={addDay}
              className="w-full py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
            >
              + {tTrip('addDay')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <TripTimeline plan={tripPlan} />
            
            {/* Ad at the bottom of timeline */}
            <AdSense
              adSlot="1234567890"
              adFormat="auto"
              className="mt-8"
            />
          </div>
        )}
      </div>
    </main>
  );
}
