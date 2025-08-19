export type Activity = {
  date: string;
  startTime: number;
  duration: number;
  label: string;
  category: Category;
  notes?: string;
  mapUrl?: string;
  allTrailsUrl?: string;
};

export type Category =
  | "Driving"
  | "Hiking"
  | "Rafting"
  | "Eating"
  | "Hotel/Rest"
  | "Flight"
  | "Transport"
  | "Sightseeing"
  | "Other"


export type DaySchedule = Activity[];

export const colors: Record<Category, string> = {
  "Driving": "#B91C1C", // Darker red
  "Hiking": "#2F855A", // Darker green
  "Rafting": "#2B6CB0", // Darker blue
  "Eating": "#6B46C1", // Darker purple
  "Hotel/Rest": "#4A5568", // Darker yellow/gold
  "Flight": "#DC2626", // Bright red for flights
  "Transport": "#059669", // Green for transport
  "Sightseeing": "#7C3AED", // Purple for sightseeing
  "Other": "#065F60" // Darker teal
};

// The schedule data is now loaded from schedule-data.json
