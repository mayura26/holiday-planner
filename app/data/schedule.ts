export type Activity = {
  startTime: number;
  duration: number;
  label: string;
  category: Category;
};

export type Category =
  | "Driving"
  | "Hiking"
  | "Rafting"
  | "Eating"
  | "Hotel/Rest"
  | "Other"
  | "Sleeping";

export type DaySchedule = Activity[];

export const colors: Record<Category, string> = {
  "Driving": "#E53E3E", // Darker red
  "Hiking": "#2F855A", // Darker green
  "Rafting": "#2B6CB0", // Darker blue
  "Eating": "#6B46C1", // Darker purple
  "Hotel/Rest": "#B7791F", // Darker yellow/gold
  "Other": "#C05621", // Darker orange
  "Sleeping": "#4A5568" // Darker gray
};

export const schedule: Record<number, DaySchedule> = {
  1: [
    { startTime: 12.0, duration: 1.5, label: "Arrive PHX (Customs, Luggage, Car Rental)", category: "Other" },
    { startTime: 13.5, duration: 2.0, label: "Drive to Sedona", category: "Driving" },
    { startTime: 15.75, duration: 0.25, label: "Shuttle to Seven Sacred Pools", category: "Driving" },
    { startTime: 16.0, duration: 1.0, label: "Seven Sacred Pools Hike", category: "Hiking" },
    { startTime: 17.0, duration: 0.25, label: "Return Shuttle", category: "Driving" },
    { startTime: 17.5, duration: 0.67, label: "Quick Dinner", category: "Eating" },
    { startTime: 18.17, duration: 1.0, label: "Sunset at Airport Mesa", category: "Other" },
    { startTime: 19.5, duration: 3.5, label: "Hotel Check-in & Rest", category: "Hotel/Rest" },
    { startTime: 23.0, duration: 7.0, label: "Sleep", category: "Sleeping" }
  ],
  2: [
    { startTime: 5.5, duration: 0.5, label: "Wake Up & Check Out", category: "Hotel/Rest" },
    { startTime: 6.0, duration: 0.25, label: "Drive to Devil's Bridge 4WD Lot", category: "Driving" },
    { startTime: 6.25, duration: 1.5, label: "Devil's Bridge Hike", category: "Hiking" },
    { startTime: 8.25, duration: 2.5, label: "Drive to Grand Canyon", category: "Driving" },
    { startTime: 11.0, duration: 0.75, label: "Lunch in Tusayan (Pizza & Pasta)", category: "Eating" },
    { startTime: 12.0, duration: 0.5, label: "Enter Grand Canyon NP", category: "Other" },
    { startTime: 12.5, duration: 2.0, label: "South Kaibab Trail Hike (Ooh Aah Point)", category: "Hiking" },
    { startTime: 14.5, duration: 2.5, label: "Desert View Drive", category: "Driving" },
    { startTime: 17.5, duration: 1.0, label: "Sunset at Lipan Point", category: "Other" },
    { startTime: 19.25, duration: 1.5, label: "Dinner at El Tovar", category: "Eating" },
    { startTime: 20.5, duration: 2.0, label: "Hotel & Rest", category: "Hotel/Rest" },
    { startTime: 23.0, duration: 7.0, label: "Sleep", category: "Sleeping" }
  ],
  3: [
    { startTime: 7.0, duration: 1.0, label: "Breakfast & Pack Up", category: "Eating" },
    { startTime: 8.0, duration: 1.5, label: "Grand Canyon Rim Trail Walk", category: "Hiking" },
    { startTime: 9.5, duration: 0.25, label: "Hermit Road Shuttle (Hopi → Yavapai)", category: "Driving" },
    { startTime: 9.75, duration: 0.25, label: "Final Packing", category: "Other" },
    { startTime: 10.0, duration: 2.5, label: "Drive to Page", category: "Driving" },
    { startTime: 12.5, duration: 1.0, label: "Lunch in Page", category: "Eating" },
    { startTime: 13.5, duration: 2.5, label: "Lake Powell/Wahweap Overlook", category: "Other" },
    { startTime: 16.0, duration: 0.5, label: "Drive to Horseshoe Bend", category: "Driving" },
    { startTime: 16.5, duration: 1.5, label: "Horseshoe Bend Hike", category: "Hiking" },
    { startTime: 18.5, duration: 1.5, label: "Dinner in Page", category: "Eating" },
    { startTime: 20.0, duration: 3.0, label: "Hotel & Rest", category: "Hotel/Rest" },
    { startTime: 23.0, duration: 7.0, label: "Sleep", category: "Sleeping" }
  ],
  4: [
    { startTime: 7.0, duration: 1.0, label: "Wake Up, Pack, Check Out", category: "Hotel/Rest" },
    { startTime: 8.5, duration: 0.5, label: "Antelope Canyon Check-in", category: "Other" },
    { startTime: 9.17, duration: 1.33, label: "Antelope Canyon Tour", category: "Hiking" },
    { startTime: 10.75, duration: 0.5, label: "Pick up Grab-and-Go Sandwiches", category: "Eating" },
    { startTime: 11.15, duration: 2.0, label: "Drive to Monument Valley", category: "Driving" },
    { startTime: 13.15, duration: 0.75, label: "Monument Valley Stop", category: "Other" },
    { startTime: 14.0, duration: 0.5, label: "Drive to Goosenecks SP", category: "Driving" },
    { startTime: 14.5, duration: 0.5, label: "Goosenecks Overlook", category: "Other" },
    { startTime: 15.0, duration: 2.5, label: "Drive to Moab", category: "Driving" },
    { startTime: 17.5, duration: 1.5, label: "Dead Horse Point Sunset", category: "Other" },
    { startTime: 19.0, duration: 0.5, label: "Drive Back to Moab", category: "Driving" },
    { startTime: 20.0, duration: 1.5, label: "Dinner in Moab", category: "Eating" },
    { startTime: 21.5, duration: 1.5, label: "Hotel & Rest", category: "Hotel/Rest" },
    { startTime: 23.0, duration: 7.0, label: "Sleep", category: "Sleeping" }
  ],
  5: [
    { startTime: 7.0, duration: 1.0, label: "Breakfast & Raft Prep", category: "Eating" },
    { startTime: 8.0, duration: 4.0, label: "Colorado River Rafting", category: "Rafting" },
    { startTime: 12.0, duration: 0.5, label: "Dry Off & Snack/Coffee", category: "Eating" },
    { startTime: 12.5, duration: 0.5, label: "Drive to Fisher Towers", category: "Driving" },
    { startTime: 13.0, duration: 3.0, label: "Hike Fisher Towers", category: "Hiking" },
    { startTime: 16.0, duration: 0.5, label: "Drive back to Moab", category: "Driving" },
    { startTime: 16.5, duration: 0.67, label: "Drive to Canyonlands NP (Shafer Trailhead)", category: "Driving" },
    { startTime: 17.0, duration: 1.5, label: "Shafer Trail Scenic Drive", category: "Other" },
    { startTime: 18.5, duration: 1.0, label: "Drive Potash Road for Petroglyphs", category: "Driving" },
    { startTime: 19.5, duration: 0.5, label: "Drive back to Moab (Sunset Views)", category: "Driving" },
    { startTime: 20.0, duration: 1.5, label: "Dinner in Moab", category: "Eating" },
    { startTime: 21.5, duration: 1.5, label: "Hotel & Rest", category: "Hotel/Rest" },
    { startTime: 23.0, duration: 7.0, label: "Sleep", category: "Sleeping" }
  ],
  6: [
    { startTime: 7.0, duration: 1.0, label: "Breakfast & Pack Hiking Gear", category: "Eating" },
    { startTime: 8.0, duration: 0.25, label: "Pick up Sandwiches/Snacks", category: "Eating" },
    { startTime: 8.15, duration: 0.5, label: "Drive to Arches NP Entrance", category: "Driving" },
    { startTime: 9.0, duration: 1.0, label: "Windows & Turret Arch Loop", category: "Hiking" },
    { startTime: 10.0, duration: 0.5, label: "Quick Stop at Balanced Rock", category: "Other" },
    { startTime: 10.5, duration: 1.5, label: "Hike to Landscape Arch", category: "Hiking" },
    { startTime: 12.0, duration: 0.75, label: "Lunch at Devil's Garden", category: "Eating" },
    { startTime: 12.75, duration: 1.75, label: "Return to Moab (Rest Break)", category: "Hotel/Rest" },
    { startTime: 14.5, duration: 0.5, label: "Drive back to Arches NP", category: "Driving" },
    { startTime: 15.0, duration: 0.75, label: "Sand Dune Arch Hike", category: "Hiking" },
    { startTime: 15.75, duration: 1.5, label: "Delicate Arch Hike", category: "Hiking" },
    { startTime: 17.25, duration: 0.75, label: "Option: Sunset at The Windows", category: "Other" },
    { startTime: 18.0, duration: 0.5, label: "Drive back to Moab", category: "Driving" },
    { startTime: 19.0, duration: 1.5, label: "Dinner in Moab", category: "Eating" },
    { startTime: 20.5, duration: 1.5, label: "Return to Hotel & Rest", category: "Hotel/Rest" },
    { startTime: 23.0, duration: 7.0, label: "Sleep", category: "Sleeping" }
  ],
  7: [
    { startTime: 9.0, duration: 1.0, label: "Relaxed Breakfast & Final Packing in Moab", category: "Eating" },
    { startTime: 10.0, duration: 0.5, label: "Check Out & Grab Coffee/Snacks", category: "Hotel/Rest" },
    { startTime: 10.5, duration: 4.0, label: "Drive from Moab to Tuba City", category: "Driving" },
    { startTime: 14.5, duration: 1.0, label: "Lunch at Hogan/Tuuvi Café", category: "Eating" },
    { startTime: 15.5, duration: 2.0, label: "Drive from Tuba City to Flagstaff", category: "Driving" },
    { startTime: 17.5, duration: 0.5, label: "Hotel Check-in in Flagstaff", category: "Hotel/Rest" },
    { startTime: 18.0, duration: 1.5, label: "Dinner in Flagstaff", category: "Eating" },
    { startTime: 19.5, duration: 1.5, label: "Pack for Flight, Relax, Walk", category: "Hotel/Rest" },
    { startTime: 23.0, duration: 7.0, label: "Sleep", category: "Sleeping" }
  ],
  8: [
    { startTime: 5.5, duration: 0.5, label: "Quick Breakfast & Final Packing", category: "Eating" },
    { startTime: 6.0, duration: 2.5, label: "Drive from Flagstaff to PHX Airport", category: "Driving" },
    { startTime: 8.5, duration: 0.5, label: "Return Rental Car", category: "Other" },
    { startTime: 9.0, duration: 0.5, label: "Check-in & Drop Luggage", category: "Other" },
    { startTime: 9.5, duration: 1.0, label: "Security & Airport Time", category: "Other" }
  ]
};
