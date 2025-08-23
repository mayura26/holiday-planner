import { loadSchedule } from "./actions/schedule";
import { DaySchedule } from "./components/DaySchedule";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeaderButtons } from "./components/HeaderButtons";

// Revalidate the page every 60 seconds instead of on every request
// This provides a balance between performance and fresh data
export const revalidate = 60;

function formatDate(dateString: string): string {
  // Manual date formatting to avoid any timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Manual weekday calculation for 2025
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate day of week manually for 2025
  // September 1, 2025 is a Monday
  const startDate = new Date(2025, 8, 1); // Month is 0-indexed, so 8 = September
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const weekdayIndex = (1 + daysDiff) % 7; // Monday = 1, so we adjust
  
  return `${weekdays[weekdayIndex]}, ${months[month - 1]} ${day}`;
}

export default async function Home() {
  const { data: schedule, success } = await loadSchedule();
  const days = Object.keys(schedule).sort((a, b) => Number(a) - Number(b));
  
  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Holiday Planner</h1>
        <HeaderButtons />
      </div>
      
      <div className="space-y-8">
        {days.length > 0 ? (
          <Tabs defaultValue={days[0]} className="w-full">
            <div className="w-full overflow-x-auto pb-1">
              <TabsList className="flex w-full min-w-max">
                {days.map(day => {
                  const dayActivities = schedule[Number(day)] || [];
                  const firstActivity = dayActivities[0];
                  const displayText = firstActivity?.date ? formatDate(firstActivity.date) : `Day ${day}`;
                  
                  return (
                    <TabsTrigger 
                      key={day} 
                      value={day} 
                      className="flex-1 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4 min-w-[60px]"
                    >
                      {displayText}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
            
            {days.map(day => (
              <TabsContent key={day} value={day} className="mt-4 sm:mt-6 border rounded-lg p-6 shadow-sm">
                <DaySchedule
                  day={Number(day)}
                  activities={schedule[Number(day)] || []}
                  defaultShowTimescale={false}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-medium text-gray-500 mb-4">No schedule found</h2>
            <p className="text-gray-400 mb-8">Start by creating a schedule in the editor</p>
            <Link href="/editor">
              <Button>Create Schedule</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
