"use client";

import { useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { Location } from "@/types/trip";
import { formatDuration, formatDistance, getTravelModeLabel, getTravelModeEmoji } from "@/lib/trip-utils";

interface RouteSearchProps {
  origin: Location;
  destination: Location;
  apiKey?: string;
  onSelect: (transport: {
    method: string;
    duration: number;
    distance?: number;
    travelMode?: 'DRIVING' | 'WALKING' | 'TRANSIT' | 'BICYCLING';
  }) => void;
  onClose: () => void;
}

interface RouteOption {
  mode: google.maps.TravelMode;
  duration: number; // minutes
  distance: number; // meters
  durationText: string;
  distanceText: string;
}

export function RouteSearch({ origin, destination, apiKey, onSelect, onClose }: RouteSearchProps) {
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [error, setError] = useState<string>("");
  const [searched, setSearched] = useState(false);

  const searchRoutes = async () => {
    if (!apiKey) {
      setError("Google Maps APIキーが設定されていません");
      return;
    }

    if (!origin.coordinates || !destination.coordinates) {
      setError("出発地と目的地の両方に座標が必要です");
      return;
    }

    setLoading(true);
    setError("");
    setRoutes([]);

    try {
      setOptions({ key: apiKey, v: "weekly" });
      await importLibrary("routes");

      const directionsService = new google.maps.DirectionsService();
      const originLatLng = new google.maps.LatLng(origin.coordinates.lat, origin.coordinates.lng);
      const destLatLng = new google.maps.LatLng(destination.coordinates.lat, destination.coordinates.lng);

      // Search multiple travel modes
      const modes: google.maps.TravelMode[] = [
        google.maps.TravelMode.DRIVING,
        google.maps.TravelMode.WALKING,
        google.maps.TravelMode.TRANSIT,
        google.maps.TravelMode.BICYCLING,
      ];

      const results: RouteOption[] = [];

      for (const mode of modes) {
        try {
          const result = await directionsService.route({
            origin: originLatLng,
            destination: destLatLng,
            travelMode: mode,
          });

          if (result.routes && result.routes[0] && result.routes[0].legs && result.routes[0].legs[0]) {
            const leg = result.routes[0].legs[0];
            if (leg.duration && leg.distance) {
              results.push({
                mode,
                duration: Math.ceil(leg.duration.value / 60), // seconds to minutes
                distance: leg.distance.value,
                durationText: leg.duration.text,
                distanceText: leg.distance.text,
              });
            }
          }
        } catch (err) {
          console.log(`No route found for mode: ${mode}`);
        }
      }

      if (results.length === 0) {
        setError("ルートが見つかりませんでした");
      } else {
        setRoutes(results);
      }
      setSearched(true);
    } catch (err) {
      console.error("Route search error:", err);
      setError("ルート検索に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (route: RouteOption) => {
    onSelect({
      method: getTravelModeLabel(route.mode),
      duration: route.duration,
      distance: route.distance,
      travelMode: route.mode as 'DRIVING' | 'WALKING' | 'TRANSIT' | 'BICYCLING',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">ルート検索</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="mb-4 text-sm space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 flex-shrink-0">📍</span>
              <span className="font-medium break-words">{origin.name || "出発地"}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 flex-shrink-0">📍</span>
              <span className="font-medium break-words">{destination.name || "目的地"}</span>
            </div>
          </div>

          {!searched && (
            <button
              onClick={searchRoutes}
              disabled={loading || !apiKey}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {loading ? "検索中..." : "🔍 ルートを検索"}
            </button>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs md:text-sm">
              {error}
            </div>
          )}

          {routes.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs md:text-sm font-medium text-gray-700 mb-3">
                移動手段を選択してください：
              </p>
              {routes.map((route, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(route)}
                  className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <span className="text-xl md:text-2xl flex-shrink-0">{getTravelModeEmoji(route.mode)}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm md:text-base">
                          {getTravelModeLabel(route.mode)}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600 truncate">
                          {route.durationText} • {route.distanceText}
                        </div>
                      </div>
                    </div>
                    <div className="text-blue-500 flex-shrink-0">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searched && routes.length > 0 && (
            <button
              onClick={onClose}
              className="w-full mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm md:text-base"
            >
              キャンセル
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
