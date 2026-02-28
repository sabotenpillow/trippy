"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string, placeDetails?: {
    coordinates: { lat: number; lng: number };
    placeId: string;
  }) => void;
  apiKey?: string;
  placeholder?: string;
  className?: string;
}

export function PlacesAutocomplete({
  value,
  onChange,
  apiKey,
  placeholder = "地点を検索...",
  className = "",
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    setOptions({
      key: apiKey,
      v: "weekly",
      libraries: ["places"],
    });

    importLibrary("places")
      .then(() => {
        if (!inputRef.current) return;

        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: ["place_id", "geometry", "name", "formatted_address"],
            types: ["establishment", "geocode"],
          }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();

          if (place?.geometry?.location) {
            const coordinates = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            onChange(
              place.name || place.formatted_address || value,
              {
                coordinates,
                placeId: place.place_id || "",
              }
            );
          }
        });

        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load Google Maps Places:", error);
      });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [apiKey]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        disabled={!apiKey}
      />
      {!apiKey && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-md">
          <span className="text-xs text-gray-500">APIキー未設定</span>
        </div>
      )}
      {apiKey && isLoaded && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          🔍
        </div>
      )}
    </div>
  );
}
