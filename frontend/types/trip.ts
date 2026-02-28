export interface Transport {
  method: string; // '電車', '車', '飛行機', '徒歩', etc.
  duration: number; // minutes
}

export interface Location {
  id: string;
  name: string;
  stayDuration: number; // minutes
  notes?: string;
  transport?: Transport; // transport to this location from previous one
}

export interface Day {
  date: string; // ISO 8601 format (YYYY-MM-DD)
  locations: Location[];
}

export interface TripPlan {
  title: string;
  days: Day[];
}
