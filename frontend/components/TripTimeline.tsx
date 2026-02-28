"use client";

import { TripPlan } from "@/types/trip";
import { formatDuration, getTravelModeEmoji } from "@/lib/trip-utils";

interface TripTimelineProps {
  plan: TripPlan;
}

export function TripTimeline({ plan }: TripTimelineProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
        <p className="text-gray-600 mt-2">
          {plan.days.length}日間の旅程
        </p>
      </div>

      {plan.days.map((day, dayIndex) => {
        const totalStayTime = day.locations.reduce((sum, loc) => sum + loc.stayDuration, 0);
        const totalTransportTime = day.locations.reduce(
          (sum, loc) => sum + (loc.transport?.duration || 0),
          0
        );

        return (
          <div key={dayIndex} className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Day {dayIndex + 1}
              </h2>
              <p className="text-gray-600">{day.date}</p>
              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <span>滞在: {formatDuration(totalStayTime)}</span>
                <span>移動: {formatDuration(totalTransportTime)}</span>
                <span className="font-semibold">合計: {formatDuration(totalStayTime + totalTransportTime)}</span>
              </div>
            </div>

            <div className="space-y-4">
              {day.locations.map((location, locIndex) => (
                <div key={location.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                      {locIndex + 1}
                    </div>
                    {locIndex < day.locations.length - 1 && (
                      <div className="w-0.5 flex-1 bg-blue-200 my-2" />
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    {location.transport && (
                      <div className="mb-3 text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {location.transport.travelMode 
                              ? getTravelModeEmoji(location.transport.travelMode)
                              : "🚆"}
                          </span>
                          <span className="font-medium">{location.transport.method}</span>
                          <span className="text-gray-500">
                            ({formatDuration(location.transport.duration)})
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {location.name || "未設定"}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <p>滞在時間: {formatDuration(location.stayDuration)}</p>
                        {location.notes && (
                          <p className="mt-2 text-gray-500">📝 {location.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
