export interface Transport {
  method: string; // '電車', '車', '飛行機', '徒歩' etc.
  duration: number; // minutes
  distance?: number; // meters
  travelMode?: 'DRIVING' | 'WALKING' | 'TRANSIT' | 'BICYCLING';
}

export interface Location {
  id: string;
  name: string;
  stayDuration: number; // minutes
  notes?: string;
  transport?: Transport; // transport to this location from previous one
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string; // Google Places ID
}

export interface Day {
  date: string; // ISO 8601 format (YYYY-MM-DD)
  locations: Location[];
}

export interface TripPlan {
  title: string;
  days: Day[];
}
