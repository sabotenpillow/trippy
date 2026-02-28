"use client";

import { Day, Location } from "@/types/trip";
import { generateId } from "@/lib/trip-utils";
import { LocationCard } from "./LocationCard";

interface DayEditorProps {
  day: Day;
  onUpdate: (day: Day) => void;
  onDelete?: () => void;
}

export function DayEditor({ day, onUpdate, onDelete }: DayEditorProps) {
  const addLocation = () => {
    const newLocation: Location = {
      id: generateId(),
      name: "",
      stayDuration: 60,
      transport: day.locations.length > 0 ? { method: "", duration: 0 } : undefined,
    };
    onUpdate({ ...day, locations: [...day.locations, newLocation] });
  };

  const updateLocation = (index: number, location: Location) => {
    const newLocations = [...day.locations];
    newLocations[index] = location;
    onUpdate({ ...day, locations: newLocations });
  };

  const deleteLocation = (index: number) => {
    const newLocations = day.locations.filter((_, i) => i !== index);
    // If deleting first location, remove transport from new first location
    if (index === 0 && newLocations.length > 0) {
      newLocations[0] = { ...newLocations[0], transport: undefined };
    }
    onUpdate({ ...day, locations: newLocations });
  };

  const moveLocation = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= day.locations.length) return;

    const newLocations = [...day.locations];
    [newLocations[index], newLocations[newIndex]] = [newLocations[newIndex], newLocations[index]];

    // Swap transports
    const transport1 = newLocations[index].transport;
    const transport2 = newLocations[newIndex].transport;
    newLocations[index] = { ...newLocations[index], transport: transport2 };
    newLocations[newIndex] = { ...newLocations[newIndex], transport: transport1 };

    // First location should never have transport
    if (newLocations[0].transport) {
      newLocations[0] = { ...newLocations[0], transport: undefined };
    }

    onUpdate({ ...day, locations: newLocations });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">日付</label>
          <input
            type="date"
            value={day.date}
            onChange={(e) => onUpdate({ ...day, date: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            この日を削除
          </button>
        )}
      </div>

      <div className="space-y-4">
        {day.locations.map((location, index) => (
          <LocationCard
            key={location.id}
            location={location}
            index={index}
            onUpdate={(loc) => updateLocation(index, loc)}
            onDelete={() => deleteLocation(index)}
            onMoveUp={index > 0 ? () => moveLocation(index, "up") : undefined}
            onMoveDown={index < day.locations.length - 1 ? () => moveLocation(index, "down") : undefined}
            showTransport={index > 0}
          />
        ))}
      </div>

      <button
        onClick={addLocation}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        + 地点を追加
      </button>
    </div>
  );
}
