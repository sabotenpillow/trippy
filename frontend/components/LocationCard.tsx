"use client";

import { Location, Transport } from "@/types/trip";
import { formatDuration } from "@/lib/trip-utils";

interface LocationCardProps {
  location: Location;
  index: number;
  onUpdate: (location: Location) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  showTransport: boolean;
}

export function LocationCard({
  location,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  showTransport,
}: LocationCardProps) {
  const handleTransportChange = (field: keyof Transport, value: string | number) => {
    const transport = location.transport || { method: "", duration: 0 };
    onUpdate({
      ...location,
      transport: { ...transport, [field]: value },
    });
  };

  return (
    <div className="space-y-4">
      {showTransport && location.transport && (
        <div className="flex items-center gap-3 text-sm text-gray-600 pl-4">
          <div className="flex-1 flex items-center gap-2 bg-blue-50 rounded-lg p-3">
            <span className="text-blue-600">🚆</span>
            <input
              type="text"
              value={location.transport.method}
              onChange={(e) => handleTransportChange("method", e.target.value)}
              placeholder="移動方法 (例: 電車)"
              className="flex-1 bg-transparent border-none outline-none text-gray-700"
            />
            <input
              type="number"
              value={location.transport.duration}
              onChange={(e) => handleTransportChange("duration", parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              className="w-20 bg-transparent border-none outline-none text-right text-gray-700"
            />
            <span className="text-gray-600">分</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-1 mt-2">
            <button
              onClick={onMoveUp}
              disabled={!onMoveUp}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ▲
            </button>
            <button
              onClick={onMoveDown}
              disabled={!onMoveDown}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ▼
            </button>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">地点名</label>
              <input
                type="text"
                value={location.name}
                onChange={(e) => onUpdate({ ...location, name: e.target.value })}
                placeholder="例: 東京駅"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">滞在時間</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={location.stayDuration}
                    onChange={(e) => onUpdate({ ...location, stayDuration: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600">分</span>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 mt-2"
            aria-label="削除"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
