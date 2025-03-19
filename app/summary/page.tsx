import { HolidaySummary } from '../components/HolidaySummary';
import { loadSchedule } from '../actions/schedule';
import { Activity } from '../data/schedule';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Revalidate the page every 60 seconds instead of on every request
// This provides a balance between performance and fresh data
export const revalidate = 60;

export default async function SummaryPage() {
  const { data: schedule, success } = await loadSchedule();
  
  // Transform the schedule record into an array of day objects with the correct type
  const scheduleArray = Object.entries(schedule).map(([day, activities]) => ({
    day: parseInt(day),
    activities: activities as Activity[]
  }));

  return (
    <main className="container mx-auto py-8">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Holiday Summary</h1>
          <Link href="/">
            <Button variant="outline">
              Back to Schedule
            </Button>
          </Link>
        </div>
        <HolidaySummary schedule={scheduleArray} />
      </div>
    </main>
  );
} 