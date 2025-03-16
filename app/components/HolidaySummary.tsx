"use client";

import { Activity, colors, Category } from '../data/schedule';
import { DaySchedule } from './DaySchedule';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HolidaySummaryProps {
  schedule: { day: number; activities: Activity[] }[];
}

export function HolidaySummary({ schedule }: HolidaySummaryProps) {
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);

  // Calculate overall statistics
  const totalHours = schedule.reduce((sum, day) => 
    sum + day.activities.reduce((daySum, activity) => daySum + activity.duration, 0), 
    0
  );

  // Calculate category totals
  const categoryTotals = schedule.reduce((totals, day) => {
    day.activities.forEach((activity) => {
      totals[activity.category] = (totals[activity.category] || 0) + activity.duration;
    });
    return totals;
  }, {} as Record<Category, number>);

  // Sort categories by total hours (descending)
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, hoursA], [, hoursB]) => hoursB - hoursA);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        {/* Category summary */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-transparent"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Activity Breakdown</h3>
              {/* Preview of top 3 categories */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                {sortedCategories.slice(0, 3).map(([category, hours], index) => (
                  <span key={category} className="flex items-center">
                    {index > 0 && "•"}
                    <span className="ml-2">
                      {category}: {hours.toFixed(1)}h
                    </span>
                  </span>
                ))}
                {sortedCategories.length > 3 && (
                  <span className="text-gray-400">
                    +{sortedCategories.length - 3} more
                  </span>
                )}
              </div>
            </div>
            {isBreakdownExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {isBreakdownExpanded && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {sortedCategories.map(([category, hours]) => (
                  <Card 
                    key={category}
                    className="p-3 relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="text-sm font-medium">{category}</div>
                      <div className="text-lg font-bold">{hours.toFixed(1)}h</div>
                      <div className="text-xs text-gray-500">
                        {((hours / totalHours) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{ backgroundColor: colors[category as Category] }}
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable container */}
      <div className="relative">
        {/* Scrollable days container */}
        <div className="overflow-x-auto">
          <div className="flex gap-3 px-1" style={{ minWidth: 'min-content' }}>
            {schedule.map((day) => (
              <div 
                key={day.day}
                className="w-[min(60vw,320px)] flex-none"
              >
                <DaySchedule 
                  day={day.day} 
                  activities={day.activities}
                  defaultShowTimescale={true}
                  isCompact={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 