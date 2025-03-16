import matplotlib.pyplot as plt
import numpy as np
import matplotlib.patches as mpatches

###############################################################################
# 1. DEFINE THE ITINERARY DATA (Using Your Real Data)
###############################################################################
# Each day is keyed by its day number (1 to 8).
# Each event is a tuple: (start_time in 24h, duration in hours, "Label", "Category")
#
# Categories: "Driving", "Hiking", "Rafting", "Eating", "Hotel/Rest", "Other", "Sleeping"
# Times are given as decimal hours (e.g., 13.5 = 1:30 PM).

schedule = {
    1: [
        (12.0, 1.5, "Arrive PHX (Customs, Luggage, Car Rental)", "Other"),   # 12:00–13:30
        (13.5, 2.0, "Drive to Sedona", "Driving"),                          # 13:30–15:30
        (15.45, 0.25, "Shuttle to Seven Sacred Pools", "Driving"),          # 15:45–16:00
        (16.0, 1.0, "Seven Sacred Pools Hike", "Hiking"),                   # 16:00–17:00
        (17.0, 0.25, "Return Shuttle", "Driving"),                          # 17:00–17:15
        (17.3, 0.67, "Quick Dinner", "Eating"),                             # ~17:15–18:10 (40 min)
        (18.1, 1.0, "Sunset at Airport Mesa", "Other"),                     # 18:10–19:10
        (19.1, 3.83, "Hotel Check-in & Rest", "Hotel/Rest"),                  # 19:10–23:00
        (23.0, 7.0, "Sleep", "Sleeping")                                     # 23:00–06:00 (next day)
    ],
    2: [
        (5.5, 0.5, "Wake Up & Check Out", "Hotel/Rest"),                      # 05:30–06:00
        (6.0, 0.25, "Drive to Devil's Bridge 4WD Lot", "Driving"),            # 06:00–06:15
        (6.25, 1.5, "Devil's Bridge Hike", "Hiking"),                         # 06:15–07:45
        (8.15, 2.5, "Drive to Grand Canyon", "Driving"),                      # 08:15–10:45
        (11.0, 0.75, "Lunch in Tusayan (Pizza & Pasta)", "Eating"),           # 11:00–11:45
        (12.0, 0.5, "Enter Grand Canyon NP", "Other"),                        # 12:00–12:30
        (12.5, 2.0, "South Kaibab Trail Hike (Ooh Aah Point)", "Hiking"),       # 12:30–14:30
        (14.5, 2.5, "Desert View Drive", "Driving"),                          # 14:30–17:00
        (17.0, 1.0, "Sunset at Lipan Point", "Other"),                        # 17:00–18:00
        (18.0, 1.0, "Dinner at El Tovar", "Eating"),                          # 18:00–19:00
        (19.0, 2.0, "Hotel & Rest", "Hotel/Rest"),                            # 19:00–21:00
        (23.0, 7.0, "Sleep", "Sleeping")                                     # 23:00–06:00
    ],
    3: [
        (7.0, 1.0, "Breakfast & Pack Up", "Eating"),                          # 07:00–08:00
        (8.0, 1.5, "Grand Canyon Rim Trail Walk", "Hiking"),                  # 08:00–09:30
        (9.3, 0.25, "Hermit Road Shuttle (Hopi → Yavapai)", "Driving"),        # 09:30–09:45
        (9.75, 0.25, "Final Packing", "Other"),                               # 09:45–10:00
        (10.0, 2.5, "Drive to Page", "Driving"),                              # 10:00–12:30
        (12.5, 1.0, "Lunch in Page", "Eating"),                               # 12:30–13:30
        (13.5, 2.5, "Lake Powell/Wahweap Overlook", "Other"),                 # 13:30–16:00
        (16.0, 0.5, "Drive to Horseshoe Bend", "Driving"),                    # 16:00–16:30
        (16.5, 1.5, "Horseshoe Bend Hike", "Hiking"),                           # 16:30–18:00
        (18.3, 1.5, "Dinner in Page", "Eating"),                              # 18:30–20:00
        (20.0, 3.0, "Hotel & Rest", "Hotel/Rest"),                            # 20:00–23:00
        (23.0, 7.0, "Sleep", "Sleeping")                                      # 23:00–06:00
    ],
    4: [
        (7.0, 1.0, "Wake Up, Pack, Check Out", "Hotel/Rest"),                 # 07:00–08:00
        (8.5, 0.5, "Antelope Canyon Check-in", "Other"),                      # 08:30–09:00
        (9.1, 1.2, "Antelope Canyon Tour", "Hiking"),                         # 09:10–10:30
        (10.45, 0.5, "Pick up Grab-and-Go Sandwiches", "Eating"),              # 10:45–11:15
        (11.15, 2.0, "Drive to Monument Valley", "Driving"),                 # 11:15–13:15
        (13.15, 0.75, "Monument Valley Stop", "Other"),                       # 13:15–14:00
        (14.0, 0.5, "Drive to Goosenecks SP", "Driving"),                      # 14:00–14:30
        (14.5, 0.5, "Goosenecks Overlook", "Other"),                           # 14:30–15:00
        (15.0, 2.5, "Drive to Moab", "Driving"),                              # 15:00–17:30
        (17.5, 1.5, "Dead Horse Point Sunset", "Other"),                      # 17:30–19:00
        (19.0, 0.5, "Drive Back to Moab", "Driving"),                         # 19:00–19:30
        (20.0, 1.5, "Dinner in Moab", "Eating"),                              # 20:00–21:30
        (21.5, 1.5, "Hotel & Rest", "Hotel/Rest"),                            # 21:30–23:00
        (23.0, 7.0, "Sleep", "Sleeping")                                      # 23:00–06:00
    ],
    5: [
        (7.0, 1.0, "Breakfast & Raft Prep", "Eating"),                        # 07:00–08:00
        (8.0, 4.0, "Colorado River Rafting", "Rafting"),                      # 08:00–12:00
        (12.0, 0.5, "Dry Off & Snack/Coffee", "Eating"),                      # 12:00–12:30
        (12.5, 0.5, "Drive to Fisher Towers", "Driving"),                    # 12:30–13:00
        (13.0, 3.0, "Hike Fisher Towers", "Hiking"),                         # 13:00–16:00
        (16.0, 0.5, "Drive back to Moab", "Driving"),                         # 16:00–16:30
        (16.5, 0.67, "Drive to Canyonlands NP (Shafer Trailhead)", "Driving"), # 16:30–17:00 (~40 min)
        (17.0, 1.5, "Shafer Trail Scenic Drive", "Other"),                    # 17:00–18:30
        (18.5, 1.0, "Drive Potash Road for Petroglyphs", "Driving"),            # 18:30–19:30
        (19.5, 0.5, "Drive back to Moab (Sunset Views)", "Driving"),            # 19:30–20:00
        (20.0, 1.5, "Dinner in Moab", "Eating"),                              # 20:00–21:30
        (21.5, 1.5, "Hotel & Rest", "Hotel/Rest"),                            # 21:30–23:00
        (23.0, 7.0, "Sleep", "Sleeping")                                      # 23:00–06:00
    ],
    6: [
        (7.0, 1.0, "Breakfast & Pack Hiking Gear", "Eating"),                 # 07:00–08:00
        (8.0, 0.25, "Pick up Sandwiches/Snacks", "Eating"),                   # 08:00–08:15
        (8.15, 0.5, "Drive to Arches NP Entrance", "Driving"),                # 08:15–08:45
        (9.0, 1.0, "Windows & Turret Arch Loop", "Hiking"),                   # 09:00–10:00
        (10.0, 0.5, "Quick Stop at Balanced Rock", "Other"),                  # 10:00–10:30
        (10.5, 1.5, "Hike to Landscape Arch", "Hiking"),                      # 10:30–12:00
        (12.0, 0.75, "Lunch at Devil's Garden", "Eating"),                    # 12:00–12:45
        (12.75, 1.75, "Return to Moab (Rest Break)", "Hotel/Rest"),             # 12:45–14:30
        (14.5, 0.5, "Drive back to Arches NP", "Driving"),                    # 14:30–15:00
        (15.0, 0.75, "Sand Dune Arch Hike", "Hiking"),                         # 15:00–15:45
        (15.75, 1.5, "Delicate Arch Hike", "Hiking"),                          # 15:45–17:15
        (17.25, 0.75, "Option: Sunset at The Windows", "Other"),              # 17:15–18:00
        (18.0, 0.5, "Drive back to Moab", "Driving"),                         # 18:00–18:30
        (19.0, 1.5, "Dinner in Moab", "Eating"),                              # 19:00–20:30
        (20.5, 1.5, "Return to Hotel & Rest", "Hotel/Rest"),                    # 20:30–22:00
        (23.0, 7.0, "Sleep", "Sleeping")                                      # 23:00–06:00
    ],
    7: [
        (9.0, 1.0, "Relaxed Breakfast & Final Packing in Moab", "Eating"),      # 09:00–10:00
        (10.0, 0.5, "Check Out & Grab Coffee/Snacks", "Hotel/Rest"),            # 10:00–10:30
        (10.5, 4.0, "Drive from Moab to Tuba City", "Driving"),                # 10:30–14:30
        (14.5, 1.0, "Lunch at Hogan/Tuuvi Café", "Eating"),                    # 14:30–15:30
        (15.5, 2.0, "Drive from Tuba City to Flagstaff", "Driving"),           # 15:30–17:30
        (17.5, 0.5, "Hotel Check-in in Flagstaff", "Hotel/Rest"),               # 17:30–18:00
        (18.0, 1.5, "Dinner in Flagstaff", "Eating"),                         # 18:00–19:30
        (19.5, 1.5, "Pack for Flight, Relax, Walk", "Hotel/Rest"),              # 19:30–21:00
        (23.0, 7.0, "Sleep", "Sleeping")                                      # 23:00–06:00
    ],
    8: [
        (5.5, 0.5, "Quick Breakfast & Final Packing", "Eating"),              # 05:30–06:00
        (6.0, 2.5, "Drive from Flagstaff to PHX Airport", "Driving"),          # 06:00–08:30
        (8.5, 0.5, "Return Rental Car", "Other"),                             # 08:30–09:00
        (9.0, 0.5, "Check-in & Drop Luggage", "Other"),                       # 09:00–09:30
        (9.5, 1.0, "Security & Airport Time", "Other")                        # 09:30–10:30
        # Flight Check-In Deadline at 11:00 (not plotted as an event)
    ]
}

###############################################################################
# 2. DEFINE COLORS FOR EACH CATEGORY
###############################################################################
colors = {
    "Driving":    "#4B9CD3",  # Strong blue
    "Hiking":     "#2ECC71",  # Vibrant green
    "Rafting":    "#9B59B6",  # Purple
    "Eating":     "#E74C3C",  # Bright red
    "Hotel/Rest": "#F39C12",  # Golden orange
    "Other":      "#FFD700",  # Yellow
    "Sleeping":   "#34495E"   # Dark blue-gray
}

###############################################################################
# 3. CREATE THE CALENDAR-STYLE PLOT WITH REVERSED TIME AND HOURLY GRID
###############################################################################
# X-axis: Days 1–8 (vertical columns)
# Y-axis: Time of day from 0 to 24 (we extend to 26 for summary text),
#        reversed so that 0 (earliest time) is at the top.
all_days = sorted(schedule.keys())
num_days = len(all_days)

fig, ax = plt.subplots(figsize=(14, 10))

# Set y-axis to 0 to 26, then invert so 0 is at the top.
ax.set_ylim(0, 26)
ax.invert_yaxis()

ax.set_xlim(0.5, num_days + 0.5)
ax.set_xticks(range(1, num_days + 1))
ax.set_xticklabels([f"Day {d}" for d in all_days])

# Set hourly grid lines from 0 to 24.
ax.set_yticks(np.arange(0, 25, 1))
ax.set_yticklabels([f"{h}:00" for h in range(0, 25)])
ax.set_ylabel("Time of Day")
ax.yaxis.grid(True, which='major', linestyle='--', alpha=0.5)

# Dictionary to accumulate daily totals per category.
daily_summaries = {}

# Plot events for each day.
for day in all_days:
    events = schedule[day]
    cat_sums = {}  # accumulate hours per category for the day
    
    for (start, duration, label, category) in events:
        # Accumulate duration for summary.
        cat_sums[category] = cat_sums.get(category, 0) + duration
        
        # For each event, draw a rectangle. Each day is centered at x=day, width=0.8.
        x_left = day - 0.4
        width = 0.8
        
        # Handle events that cross midnight (particularly sleep events)
        if start + duration > 24:
            # First part - from start to midnight
            first_duration = 24 - start
            rect = plt.Rectangle((x_left, start), width, first_duration, 
                               color=colors.get(category, "gray"), alpha=0.8)
            ax.add_patch(rect)
            
            # Add label to the first part if it's long enough
            if first_duration > 0.5:  # Only add label if there's enough space
                ax.text(x_left + 0.02, start + first_duration * 0.5, label,
                       va='center', ha='left', fontsize=8, color="black")
                
            # Second part - from midnight to end (will appear at top of next day if applicable)
            if day < max(all_days):  # Only if there's a next day
                second_duration = duration - first_duration
                rect = plt.Rectangle((x_left + 1, 0), width, second_duration, 
                                   color=colors.get(category, "gray"), alpha=0.8)
                ax.add_patch(rect)
                
                # Add label to the second part if it's long enough
                if second_duration > 0.5:  # Only add label if there's enough space
                    ax.text(x_left + 1.02, second_duration * 0.5, label,
                           va='center', ha='left', fontsize=8, color="black")
        else:
            # Normal event (doesn't cross midnight)
            rect = plt.Rectangle((x_left, start), width, duration, 
                               color=colors.get(category, "gray"), alpha=0.8)
            ax.add_patch(rect)
            ax.text(x_left + 0.02, start + duration * 0.5, label,
                    va='center', ha='left', fontsize=8, color="black")
    
    daily_summaries[day] = cat_sums

# Create a legend.
legend_patches = [mpatches.Patch(color=col, label=cat) for cat, col in colors.items()]
ax.legend(handles=legend_patches, loc='upper right')

ax.set_title("8-Day Itinerary (Google Calendar–Style, Earliest Time at Top)")

###############################################################################
# 4. ADD DAILY SUMMARY OF HOURS BY CATEGORY AT THE BOTTOM OF EACH DAY
###############################################################################
# Position summaries below the 24-hour mark
y_start = 24.5  # Starting position for summary text
line_spacing = 0.3  # Spacing between lines

for day in all_days:
    cat_sums = daily_summaries[day]
    # Sort categories by total hours (descending) for better visual hierarchy
    sorted_cats = sorted(cat_sums.items(), key=lambda x: x[1], reverse=True)
    
    # Calculate total hours for the day
    total_hours = sum(cat_sums.values())
    
    # Add a separator line
    ax.text(day, y_start, "─" * 15, ha='center', va='top', fontsize=8, color="gray")
    
    # Add total hours summary
    ax.text(day, y_start + line_spacing, f"Total: {total_hours:.1f}h",
            ha='center', va='top', fontsize=8, color="black", weight='bold')
    
    # Add individual category summaries
    for i, (cat, hrs) in enumerate(sorted_cats, start=2):
        y_pos = y_start + (i * line_spacing)
        summary_text = f"{cat}: {hrs:.1f}h"
        ax.text(day, y_pos, summary_text,
                ha='center', va='top', fontsize=7, color=colors.get(cat, "black"))

# Adjust the plot limits to accommodate the new summary format
ax.set_ylim(0, y_start + (len(colors) + 2) * line_spacing)
ax.invert_yaxis()

plt.tight_layout()
plt.show()
