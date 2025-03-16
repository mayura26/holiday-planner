export type Activity = {
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
  | "Other"


export type DaySchedule = Activity[];

export const colors: Record<Category, string> = {
  "Driving": "#B91C1C", // Darker red
  "Hiking": "#2F855A", // Darker green
  "Rafting": "#2B6CB0", // Darker blue
  "Eating": "#6B46C1", // Darker purple
  "Hotel/Rest": "#4A5568", // Darker yellow/gold
  "Other": "#065F60" // Darker teal
};

export const schedule: Record<number, DaySchedule> = {
  1: [
    { 
      startTime: 12.0, 
      duration: 1.5, 
      label: "Arrive PHX (Customs, Luggage, Car Rental)", 
      category: "Other",
      notes: "Direct flight from YYZ Toronto Pearson International (10:00 AM) to PHX Phoenix Sky Harbor (12:00 PM), April 12, 2025. Flight duration: 5 hours.\nCar Rental: Fox, Expedia itinerary #73050356560289. Pick-up at 1805 East Sky Harbor Circle South, Phoenix, Arizona, USA, PHX. Hours: 12:01 a.m. - 12:30 a.m."
    },
    { 
      startTime: 13.5, 
      duration: 2.0, 
      label: "Drive to Sedona", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Phoenix+Sky+Harbor+International+Airport+to+Sedona+AZ"
    },
    { 
      startTime: 15.75, 
      duration: 0.25, 
      label: "Shuttle to Seven Sacred Pools", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Sedona+to+Seven+Sacred+Pools+Sedona+AZ",
      notes: "Red Rock Shuttle service to Soldier Pass Trailhead. Shuttle runs from 8 AM to 6 PM. Advance reservation recommended. Alternative: Groome Transportation shuttle service (928-350-8466)."
    },
    { 
      startTime: 16.0, 
      duration: 1.0, 
      label: "Seven Sacred Pools Hike", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=Seven+Sacred+Pools+Trailhead+Parking+Sedona+AZ",
      allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/soldier-pass-trail-to-seven-sacred-pools",
      notes: "Easy 1.1-mile hike via Soldier Pass Trail. Trail is suitable for all skill levels. Shared with Jeep traffic. Best in spring when pools have water. Download trail map in advance as some junctions lack clear signage."
    },
    { 
      startTime: 17.0, 
      duration: 0.25, 
      label: "Return Shuttle", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Seven+Sacred+Pools+to+Sedona+AZ"
    },
    { startTime: 17.5, duration: 0.67, label: "Quick Dinner", category: "Eating" },
    { startTime: 18.17, duration: 1.0, label: "Sunset at Airport Mesa", category: "Other" },
    { startTime: 19.5, duration: 3.5, label: "Hotel Check-in & Rest", category: "Hotel/Rest", notes: "Sedona Pines Resort, 6701 W State Route 89A, Sedona, AZ 86336. Phone: +1 928-282-6640. Check-in from 16:00. One-Bedroom Cottage for 2 adults. Non-refundable booking. Confirmation PIN should be kept confidential." }
  ],
  2: [
    { startTime: 5.5, duration: 0.5, label: "Wake Up & Check Out", category: "Hotel/Rest", notes: "Sedona Pines Resort check-out by 11:00." },
    { 
      startTime: 6.0, 
      duration: 0.25, 
      label: "Drive to Devil's Bridge 4WD Lot", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Sedona+Pines+Resort+to+Devils+Bridge+Trailhead+Sedona+AZ"
    },
    { 
      startTime: 6.25, 
      duration: 1.5, 
      label: "Devil's Bridge Hike", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=Devils+Bridge+Trailhead+Parking+Sedona+AZ",
      allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/devils-bridge-trail",
      notes: "Moderate 4-mile round trip hike with 400 ft elevation gain. Popular spot for photos on the natural bridge. Early start recommended to avoid crowds."
    },
    { 
      startTime: 8.25, 
      duration: 2.5, 
      label: "Drive to Grand Canyon", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Devils+Bridge+Trailhead+Sedona+to+Grand+Canyon+South+Rim"
    },
    { startTime: 11.0, duration: 0.75, label: "Lunch in Tusayan (Pizza & Pasta)", category: "Eating" },
    { 
      startTime: 12.0, 
      duration: 0.5, 
      label: "Enter Grand Canyon NP", 
      category: "Other",
      notes: "America the Beautiful Pass ($80/year) covers entry to all national parks. Single vehicle entry fee is $35 (valid for 7 days) if you don't have the annual pass."
    },
    { 
      startTime: 12.5, 
      duration: 2.0, 
      label: "South Kaibab Trail Hike (Ooh Aah Point)", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=South+Kaibab+Trailhead+Parking+Grand+Canyon",
      allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/south-kaibab-trail-to-ooh-aah-point",
      notes: "Moderate 1.8-mile round trip hike to Ooh Aah Point. 600 ft elevation change. No water available on trail. Use shuttle to trailhead as no private vehicles allowed."
    },
    { 
      startTime: 14.5, 
      duration: 2.5, 
      label: "Desert View Drive", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=South+Kaibab+Trailhead+to+Desert+View+Drive+Grand+Canyon"
    },
    { startTime: 17.5, duration: 1.0, label: "Sunset at Lipan Point", category: "Other" },
    { startTime: 19.25, duration: 1.5, label: "Dinner at El Tovar", category: "Eating" },
    { startTime: 20.5, duration: 2.0, label: "Hotel & Rest", category: "Hotel/Rest", notes: "Red Feather Lodge, 300 State Route 64, Grand Canyon, AZ, 86023. Check-in from 4:00 PM. Free cancellation until 12 Apr 2025 at 4:00 p.m." }
  ],
  3: [
    { startTime: 7.0, duration: 1.0, label: "Breakfast & Pack Up", category: "Eating", notes: "Red Feather Lodge check-out by noon." },
    { 
      startTime: 8.0, 
      duration: 1.5, 
      label: "Grand Canyon Rim Trail Walk", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=Grand+Canyon+Visitor+Center+Parking",
      allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/grand-canyon-rim-trail-to-hermits-rest"
    },
    { 
      startTime: 9.5, 
      duration: 0.25, 
      label: "Hermit Road Shuttle (Hopi → Yavapai)", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Hopi+Point+to+Yavapai+Point+Grand+Canyon"
    },
    { startTime: 9.75, duration: 0.25, label: "Final Packing", category: "Other" },
    { 
      startTime: 10.0, 
      duration: 2.5, 
      label: "Drive to Page", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Grand+Canyon+South+Rim+to+Page+AZ"
    },
    { 
      startTime: 12.5, 
      duration: 0.5, 
      label: "Quick Lunch in Page", 
      category: "Eating",
      notes: "Grab a quick lunch before kayak tour check-in. Options: Big John's Texas BBQ (fast service), Slackers Burger Joint, or grab sandwiches at Safeway."
    },
    { 
      startTime: 13.15, 
      duration: 0.75, 
      label: "Check-in for Antelope Canyon Kayak Tour", 
      category: "Other", 
      notes: "Guest Name: Mayura Vivekananda. Number of Participants: 2. Tour Start Time: 2:00 PM. Booking ID: B-PR4VN53. Check-in 45 minutes prior (1:15 PM) at store location. You'll drive to boat launch after check-in (directions provided at check-in). Need National Parks pass or $30/car fee. Complete waivers online before arrival."
    },
    { 
      startTime: 14.0, 
      duration: 3.0, 
      label: "Antelope Canyon Kayak Tour", 
      category: "Rafting", 
      notes: "Located in Glen Canyon National Recreation Area. Provided: Life jacket (PFD), dry bag, double or single sit-on-top kayak. Bring: Water bottles (2 recommended), snacks, camera. Wear: Sturdy water shoes/sandals, sun protection, layers. Expect steep sandy hill walking and choppy waters in first/last mile. Tours leave on time - no refunds for late arrival. Tipping guide appreciated but not required."
    },
    { 
      startTime: 17.0, 
      duration: 0.5, 
      label: "Drive to Horseshoe Bend", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Lake+Powell+Wahweap+Overlook+to+Horseshoe+Bend+Page+AZ"
    },
    { 
      startTime: 17.5, 
      duration: 1.5, 
      label: "Horseshoe Bend Hike", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=Horseshoe+Bend+Parking+Lot+Page+AZ",
      allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/horseshoe-bend-trail",
      notes: "Easy 1.5-mile round trip hike. $10 parking fee. Bring water and sun protection. Best lighting for photos in late afternoon."
    },
    { 
      startTime: 19.0, 
      duration: 1.5, 
      label: "Dinner in Page", 
      category: "Eating",
      notes: "Recommended restaurants: El Tapatio, State 48 Tavern, or Bonkers Restaurant."
    },
    { startTime: 20.5, duration: 2.5, label: "Hotel & Rest", category: "Hotel/Rest", notes: "Airbnb: Desert Dreams 'Casita', 545 Pinto Rd, Page, AZ 86040. Hosts: Michael And Lorie. Check-in: 3:00 PM. 2 adults." }
  ],
  4: [
    { startTime: 7.0, duration: 1.0, label: "Wake Up, Pack, Check Out", category: "Hotel/Rest", notes: "Airbnb checkout by 11:00 AM." },
    { 
      startTime: 8.5, 
      duration: 0.5, 
      label: "Antelope Canyon Check-in", 
      category: "Other",
      notes: "Check-in 30 minutes before tour time. Bring ID matching reservation name. Photography tips: set camera to landscape mode, ISO 400-800."
    },
    { 
      startTime: 9.17, 
      duration: 1.33, 
      label: "Antelope Canyon Tour", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=Antelope+Canyon+Tours+Parking+Page+AZ",
      allTrailsUrl: "https://www.alltrails.com/trail/us/arizona/upper-antelope-canyon-trail",
      notes: "Upper Antelope Canyon tour. Moderate 0.5-mile walk through slot canyon. No backpacks allowed. Navajo guide will point out best photo spots."
    },
    { startTime: 10.75, duration: 0.5, label: "Pick up Grab-and-Go Sandwiches", category: "Eating" },
    { 
      startTime: 11.15, 
      duration: 2.0, 
      label: "Drive to Monument Valley", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Page+AZ+to+Monument+Valley+Tribal+Park"
    },
    { startTime: 13.15, duration: 0.75, label: "Monument Valley Stop", category: "Other" },
    { 
      startTime: 14.0, 
      duration: 0.5, 
      label: "Drive to Goosenecks SP", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Monument+Valley+to+Goosenecks+State+Park+UT"
    },
    { startTime: 14.5, duration: 0.5, label: "Goosenecks Overlook", category: "Other" },
    { 
      startTime: 15.0, 
      duration: 2.5, 
      label: "Drive to Moab", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Goosenecks+State+Park+to+Moab+UT"
    },
    { startTime: 17.5, duration: 1.5, label: "Dead Horse Point Sunset", category: "Other" },
    { 
      startTime: 19.0, 
      duration: 0.5, 
      label: "Drive Back to Moab", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Dead+Horse+Point+State+Park+to+Moab+UT"
    },
    { 
      startTime: 20.0, 
      duration: 1.5, 
      label: "Dinner in Moab", 
      category: "Eating",
      notes: "Recommended restaurants: Moab Brewery, Desert Bistro, or Antica Forma (pizza)."
    },
    { startTime: 21.5, duration: 1.5, label: "Hotel & Rest", category: "Hotel/Rest", notes: "Kokopelli West, 236 N 100 W, Moab, UT, 84532. Check-in from 4:00 PM. Reserved for Mayura Vivekananda. House accommodation. Free cancellation until 16 Mar 2025 at 6:00 p.m. Total: CA $1,155.44 for 3 nights." }
  ],
  5: [
    { startTime: 7.0, duration: 1.0, label: "Breakfast & Raft Prep", category: "Eating" },
    { 
      startTime: 8.0, 
      duration: 0.75, 
      label: "Drive to Navtec Expeditions", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Kokopelli+West+Moab+to+321+N+Main+St+Moab+UT"
    },
    { startTime: 9.0, duration: 3.0, label: "Fisher Towers Half-Day Rafting", category: "Rafting", notes: "Confirmation #: 1618601913, Booking Ref: 123425084. Meet at Kokopelli Lodgings (72 S 100 E, Moab). Free cancellation before Apr 15." },
    { startTime: 12.0, duration: 0.5, label: "Dry Off & Snack/Coffee", category: "Eating" },
    { 
      startTime: 12.5, 
      duration: 0.5, 
      label: "Drive to Fisher Towers", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Moab+to+Fisher+Towers+UT"
    },
    { 
      startTime: 13.0, 
      duration: 3.0, 
      label: "Hike Fisher Towers", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=Fisher+Towers+Trailhead+Parking+Utah",
      allTrailsUrl: "https://www.alltrails.com/trail/us/utah/fisher-towers-trail"
    },
    { 
      startTime: 16.0, 
      duration: 0.5, 
      label: "Drive back to Moab", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Fisher+Towers+to+Moab+UT"
    },
    { 
      startTime: 16.5, 
      duration: 0.67, 
      label: "Drive to Canyonlands NP (Shafer Trailhead)", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Moab+to+Shafer+Trail+Canyonlands"
    },
    { startTime: 17.0, duration: 1.5, label: "Shafer Trail Scenic Drive", category: "Other" },
    { 
      startTime: 18.5, 
      duration: 1.0, 
      label: "Drive Potash Road for Petroglyphs", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Shafer+Trail+to+Potash+Road+Moab"
    },
    { 
      startTime: 19.5, 
      duration: 0.5, 
      label: "Drive back to Moab (Sunset Views)", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Potash+Road+to+Moab+UT"
    },
    { startTime: 20.0, duration: 1.5, label: "Dinner in Moab", category: "Eating" },
    { startTime: 21.5, duration: 1.5, label: "Hotel & Rest", category: "Hotel/Rest", notes: "Kokopelli West, 236 N 100 W, Moab, UT, 84532." }
  ],
  6: [
    { startTime: 7.0, duration: 1.0, label: "Breakfast & Pack Hiking Gear", category: "Eating" },
    { startTime: 8.0, duration: 0.25, label: "Pick up Sandwiches/Snacks", category: "Eating" },
    { 
      startTime: 8.15, 
      duration: 0.5, 
      label: "Drive to Arches NP Entrance", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Moab+to+Arches+National+Park+Entrance",
      notes: "Timed entry reservation required April-October. America the Beautiful Pass covers entry fee but not timed entry reservation."
    },
    { 
      startTime: 9.0, 
      duration: 1.0, 
      label: "Windows & Turret Arch Loop", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=The+Windows+Trailhead+Parking+Arches+National+Park",
      allTrailsUrl: "https://www.alltrails.com/trail/us/utah/the-windows-loop-and-turret-arch"
    },
    { startTime: 10.0, duration: 0.5, label: "Quick Stop at Balanced Rock", category: "Other" },
    { 
      startTime: 10.5, 
      duration: 1.5, 
      label: "Hike to Landscape Arch", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=Devils+Garden+Trailhead+Parking+Arches+National+Park",
      allTrailsUrl: "https://www.alltrails.com/trail/us/utah/landscape-arch-trail"
    },
    { startTime: 12.0, duration: 0.75, label: "Lunch at Devil's Garden", category: "Eating" },
    { startTime: 12.75, duration: 1.75, label: "Return to Moab (Rest Break)", category: "Hotel/Rest" },
    { 
      startTime: 14.5, 
      duration: 0.5, 
      label: "Drive back to Arches NP", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Moab+to+Arches+National+Park"
    },
    { 
      startTime: 15.0, 
      duration: 0.75, 
      label: "Sand Dune Arch Hike", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=Sand+Dune+Arch+Parking+Arches+National+Park",
      allTrailsUrl: "https://www.alltrails.com/trail/us/utah/sand-dune-arch-trail"
    },
    { 
      startTime: 15.75, 
      duration: 1.5, 
      label: "Delicate Arch Hike", 
      category: "Hiking", 
      mapUrl: "https://maps.google.com/?q=Delicate+Arch+Trailhead+Parking+Arches+National+Park",
      allTrailsUrl: "https://www.alltrails.com/trail/us/utah/delicate-arch-trail",
      notes: "Moderate to difficult 3-mile round trip hike with 480 ft elevation gain. Exposed trail with little shade. Bring at least 1 liter of water per person."
    },
    { startTime: 17.25, duration: 0.75, label: "Option: Sunset at The Windows", category: "Other" },
    { 
      startTime: 18.0, 
      duration: 0.5, 
      label: "Drive back to Moab", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Arches+National+Park+to+Moab+UT"
    },
    { 
      startTime: 19.0, 
      duration: 1.5, 
      label: "Dinner in Moab", 
      category: "Eating",
      notes: "Recommended restaurants: Sunset Grill (panoramic views), Spoke on Center, or Quesadilla Mobilla (food truck)."
    },
    { startTime: 20.5, duration: 1.5, label: "Return to Hotel & Rest", category: "Hotel/Rest", notes: "Kokopelli West, 236 N 100 W, Moab, UT, 84532." }
  ],
  7: [
    { startTime: 9.0, duration: 1.0, label: "Relaxed Breakfast & Final Packing in Moab", category: "Eating" },
    { startTime: 10.0, duration: 0.5, label: "Check Out & Grab Coffee/Snacks", category: "Hotel/Rest", notes: "Kokopelli West check-out by 10:00 AM." },
    { 
      startTime: 10.5, 
      duration: 4.0, 
      label: "Drive from Moab to Tuba City", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Moab+UT+to+Tuba+City+AZ"
    },
    { 
      startTime: 14.5, 
      duration: 1.0, 
      label: "Lunch at Hogan/Tuuvi Café", 
      category: "Eating",
      notes: "Authentic Navajo cuisine including fry bread and Navajo tacos."
    },
    { 
      startTime: 15.5, 
      duration: 2.0, 
      label: "Drive from Tuba City to Flagstaff", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Tuba+City+AZ+to+Flagstaff+AZ"
    },
    { startTime: 17.5, duration: 0.5, label: "Hotel Check-in in Flagstaff", category: "Hotel/Rest", notes: "Hotel Aspen InnSuites Flagstaff/Grand Canyon, 1008 E Route 66, Flagstaff, AZ, 86001. Check-in from 4:00 PM. Reserved for Mayura Vivekananda. Standard Room, 1 King Bed for 2 adults. Free cancellation until 17 Apr 2025 at 12:00 p.m. Total: US$110.82 (CA $159.27). Phone: 1 (928) 774-7356." },
    { 
      startTime: 18.0, 
      duration: 1.5, 
      label: "Dinner in Flagstaff", 
      category: "Eating",
      notes: "Recommended restaurants: Josephine's Modern American Bistro, Tinderbox Kitchen, or Pizzicletta."
    },
    { startTime: 19.5, duration: 1.5, label: "Pack for Flight, Relax, Walk", category: "Hotel/Rest" }
  ],
  8: [
    { startTime: 5.5, duration: 0.5, label: "Quick Breakfast & Final Packing", category: "Eating", notes: "Hotel Aspen InnSuites check-out by 11:00 AM." },
    { 
      startTime: 6.0, 
      duration: 2.5, 
      label: "Drive from Flagstaff to PHX Airport", 
      category: "Driving",
      mapUrl: "https://maps.google.com/?q=Flagstaff+AZ+to+Phoenix+Sky+Harbor+International+Airport"
    },
    { startTime: 8.5, duration: 0.5, label: "Return Rental Car", category: "Other", notes: "Fox Car Rental, Expedia itinerary #73050356560289. Drop-off at 1805 East Sky Harbor Circle South, Phoenix, Arizona, USA, PHX. Hours: 12:01 a.m. - 12:30 a.m. Return by Sat, Apr 19, 12:00 p.m." },
    { startTime: 9.0, duration: 0.5, label: "Check-in & Drop Luggage", category: "Other" },
    { 
      startTime: 9.5, 
      duration: 1.0, 
      label: "Security & Airport Time", 
      category: "Other",
      notes: "TSA PreCheck available at PHX Terminal 3. Arrive at least 2 hours before international flights."
    },
    { 
      startTime: 13.0, 
      duration: 4.08, 
      label: "Flight to Toronto", 
      category: "Other", 
      notes: "Porter Airlines PD 642, ClassicStandard. Departs PHX Terminal 3 at 1:00 PM. Arrives YYZ Terminal 3 at 8:05 PM. Duration: 4hr 5min. Date: Sat Apr 19, 2025."
    }
  ]
};
