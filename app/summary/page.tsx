import { HolidaySummary } from '../components/HolidaySummary';
import { schedule } from '../data/schedule';
import Link from 'next/link';

export default function SummaryPage() {
  // Transform the schedule record into an array of day objects
  const scheduleArray = Object.entries(schedule).map(([day, activities]) => ({
    day: parseInt(day),
    activities
  }));

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Holiday Summary</h1>
          <Link 
            href="/" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Schedule
          </Link>
        </div>
        <HolidaySummary schedule={scheduleArray} />
      </div>
    </main>
  );
} 