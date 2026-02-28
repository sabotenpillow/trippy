"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Location, Transport } from "@/types/trip";
import { formatDuration, formatDistance, getTravelModeEmoji } from "@/lib/trip-utils";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { RouteSearch } from "./RouteSearch";

interface LocationCardProps {
  location: Location;
  index: number;
  previousLocation?: Location;
  onUpdate: (location: Location) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  showTransport: boolean;
  googleMapsApiKey?: string;
}

export function LocationCard({
  location,
  index,
  previousLocation,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  showTransport,
  googleMapsApiKey,
}: LocationCardProps) {
  const t = useTranslations('location');
  const tTransport = useTranslations('transport');
  const [showRouteSearch, setShowRouteSearch] = useState(false);

  const handleTransportChange = (field: keyof Transport, value: string | number) => {
    const transport = location.transport || { method: "", duration: 0 };
    onUpdate({
      ...location,
      transport: { ...transport, [field]: value },
    });
  };

  const handlePlaceSelect = (
    name: string,
    placeDetails?: { coordinates: { lat: number; lng: number }; placeId: string }
  ) => {
    onUpdate({
      ...location,
      name,
      coordinates: placeDetails?.coordinates,
      placeId: placeDetails?.placeId,
    });
  };

  const handleRouteSelect = (transport: {
    method: string;
    duration: number;
    distance?: number;
    travelMode?: 'DRIVING' | 'WALKING' | 'TRANSIT' | 'BICYCLING';
  }) => {
    onUpdate({
      ...location,
      transport,
    });
  };

  const canSearchRoute = googleMapsApiKey && 
    previousLocation?.coordinates && 
    location.coordinates;

  return (
    <div className="space-y-3 md:space-y-4">
      {showTransport && (
        <div className="pl-2 md:pl-4 space-y-2 md:space-y-3">
          {/* Route Search Button */}
          {canSearchRoute && (
            <button
              onClick={() => setShowRouteSearch(true)}
              className="w-full py-2 px-3 md:px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 text-sm md:text-base"
            >
              🔍 ルート検索
            </button>
          )}

          {/* Transport Info */}
          {location.transport && (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0">
                    {location.transport.travelMode 
                      ? getTravelModeEmoji(location.transport.travelMode)
                      : "🚆"}
                  </span>
                  <input
                    type="text"
                    value={location.transport.method}
                    onChange={(e) => handleTransportChange("method", e.target.value)}
                    placeholder="移動方法"
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 min-w-0"
                  />
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <input
                    type="number"
                    value={location.transport.duration}
                    onChange={(e) => handleTransportChange("duration", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    className="w-16 bg-transparent border-none outline-none text-right text-gray-700"
                  />
                  <span className="text-gray-600 whitespace-nowrap">分</span>
                  {location.transport.distance && (
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      ({formatDistance(location.transport.distance)})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-3 md:p-4">
        <div className="flex items-start gap-2 md:gap-3">
          <div className="flex flex-col gap-1 mt-2">
            <button
              onClick={onMoveUp}
              disabled={!onMoveUp}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-sm md:text-base"
            >
              ▲
            </button>
            <button
              onClick={onMoveDown}
              disabled={!onMoveDown}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-sm md:text-base"
            >
              ▼
            </button>
          </div>

          <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                地点名
                {location.coordinates && (
                  <span className="ml-2 text-green-600 text-xs">📍 座標設定済み</span>
                )}
              </label>
              <PlacesAutocomplete
                value={location.name}
                onChange={handlePlaceSelect}
                apiKey={googleMapsApiKey}
                placeholder="例: 東京駅"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">滞在時間</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={location.stayDuration}
                    onChange={(e) => onUpdate({ ...location, stayDuration: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  />
                  <span className="text-sm text-gray-600 whitespace-nowrap">分</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDuration(location.stayDuration)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">メモ（任意）</label>
              <input
                type="text"
                value={location.notes || ""}
                onChange={(e) => onUpdate({ ...location, notes: e.target.value })}
                placeholder="例: ランチ予約済み"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
          </div>

          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 mt-2 text-xl flex-shrink-0"
            aria-label="削除"
          >
            ×
          </button>
        </div>
      </div>

      {/* Route Search Modal */}
      {showRouteSearch && previousLocation && (
        <RouteSearch
          origin={previousLocation}
          destination={location}
          apiKey={googleMapsApiKey}
          onSelect={handleRouteSelect}
          onClose={() => setShowRouteSearch(false)}
        />
      )}
    </div>
  );
}
