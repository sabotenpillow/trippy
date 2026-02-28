"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { Location } from "@/types/trip";

interface TripMapProps {
  locations: Location[];
  apiKey?: string;
}

export function TripMap({ locations, apiKey }: TripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [error, setError] = useState<string>("");
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Initialize map
  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps APIキーが設定されていません");
      return;
    }

    setOptions({
      key: apiKey,
      v: "weekly",
    });

    importLibrary("maps")
      .then(() => {
        if (mapRef.current && !map) {
          const newMap = new google.maps.Map(mapRef.current, {
            center: { lat: 35.6812, lng: 139.7671 }, // Tokyo
            zoom: 12,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
          });
          setMap(newMap);
        }
      })
      .catch((e) => {
        console.error("Failed to load Google Maps:", e);
        setError("Google Mapsの読み込みに失敗しました");
      });
  }, [apiKey, map]);

  // Update markers and route
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Clear existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    // Filter locations with coordinates
    const validLocations = locations.filter((loc) => loc.coordinates);

    if (validLocations.length === 0) return;

    // Add markers
    const bounds = new google.maps.LatLngBounds();
    const path: google.maps.LatLng[] = [];

    validLocations.forEach((location, index) => {
      if (!location.coordinates) return;

      const position = {
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      };

      const marker = new google.maps.Marker({
        position,
        map,
        label: {
          text: `${index + 1}`,
          color: "white",
          fontWeight: "bold",
        },
        title: location.name,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${location.name}</h3>
            ${location.notes ? `<p style="font-size: 12px; color: #666;">${location.notes}</p>` : ""}
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
      path.push(new google.maps.LatLng(position.lat, position.lng));
    });

    // Draw route line
    if (path.length > 1) {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#4F46E5",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      });
    }

    // Fit bounds
    if (validLocations.length === 1) {
      map.setCenter(bounds.getCenter());
      map.setZoom(14);
    } else {
      map.fitBounds(bounds);
    }
  }, [map, locations]);

  if (!apiKey) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800 font-semibold mb-2">
          Google Maps APIキーが未設定です
        </p>
        <p className="text-yellow-700 text-sm">
          環境変数 <code className="bg-yellow-100 px-2 py-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> を設定してください
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-gray-300">
      <div ref={mapRef} className="w-full h-full" />
      {locations.filter((loc) => loc.coordinates).length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90">
          <p className="text-gray-600">地点に座標が設定されていません</p>
        </div>
      )}
    </div>
  );
}
