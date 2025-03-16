import { schedule, colors, Category } from './data/schedule';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DaySchedule } from './components/DaySchedule';

export default function Home() {
  const days = Object.keys(schedule).map(Number);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Holiday Planner</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(colors).map(([category, color]) => (
              <Badge
                key={category}
                style={{ backgroundColor: color }}
                className="text-white"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue={days[0].toString()} className="w-full">
          <TabsList className="mb-4">
            {days.map((day) => (
              <TabsTrigger key={day} value={day.toString()}>
                Day {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map((day) => (
            <TabsContent key={day} value={day.toString()}>
              <Card className="p-6">
                <DaySchedule day={day} activities={schedule[day]} />
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  );
}
