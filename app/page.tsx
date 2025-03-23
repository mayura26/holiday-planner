import { loadSchedule } from "./actions/schedule";
import { DaySchedule } from "./components/DaySchedule";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, BarChart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Revalidate the page every 60 seconds instead of on every request
// This provides a balance between performance and fresh data
export const revalidate = 60;

export default async function Home() {
  const { data: schedule, success } = await loadSchedule();
  const days = Object.keys(schedule).sort((a, b) => Number(a) - Number(b));
  
  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Holiday Planner</h1>
        <div className="flex gap-2">
          <Link href="/summary">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Summary
            </Button>
          </Link>
          <Link href="/editor">
            <Button className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Schedule
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="space-y-8">
        {days.length > 0 ? (
          <Tabs defaultValue={days[0]} className="w-full">
            <div className="w-full overflow-x-auto pb-1">
              <TabsList className="flex w-full min-w-max">
                {days.map(day => (
                  <TabsTrigger 
                    key={day} 
                    value={day} 
                    className="flex-1 text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4 min-w-[60px]"
                  >
                    Day {day}
                  </TabsTrigger>
                ))}
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
