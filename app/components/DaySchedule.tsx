"use client";

import { Activity, colors, Category } from '../data/schedule';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DayScheduleProps {
  day: number;
  activities: Activity[];
}

function formatTime(time: number): string {
  const hours = Math.floor(time);
  const minutes = Math.round((time % 1) * 100);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function formatDuration(duration: number): string {
  if (duration >= 1) {
    return `${duration.toFixed(1)}h`;
  }
  return `${Math.round(duration * 60)}m`;
}

function formatTimeRange(startTime: number, endTime: number, duration: number): string {
  const start = formatTime(startTime);
  const end = formatTime(endTime);
  return `${start} - ${end} (${formatDuration(duration)})`;
}

export function DaySchedule({ day, activities }: DayScheduleProps) {
  const [showTimescale, setShowTimescale] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const totalHours = activities.reduce((sum, activity) => sum + activity.duration, 0);
  const categorySummary = Object.fromEntries(
    Object.keys(colors).map(category => [
      category,
      activities.reduce((sum, activity) => 
        activity.category === category ? sum + activity.duration : sum, 
        0
      )
    ]).filter(([_, hours]) => (hours as number) > 0)
  );

  // Calculate the earliest and latest times for the day
  const startTime = Math.floor(Math.min(...activities.map(a => a.startTime)));
  const endTime = Math.ceil(Math.max(...activities.map(a => a.startTime + a.duration)));
  const totalTimeRange = endTime - startTime;

  // Generate hour markers for the timescale
  const hourMarkers = [];
  for (let hour = startTime; hour <= endTime; hour++) {
    hourMarkers.push(hour);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Day {day}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id={`timescale-${day}`}
              checked={showTimescale}
              onCheckedChange={setShowTimescale}
            />
            <Label htmlFor={`timescale-${day}`}>Show Timescale</Label>
          </div>
          <div className="text-sm text-gray-600">
            Total: {totalHours.toFixed(1)} hours
          </div>
        </div>
      </div>

      <div className={showTimescale ? 'relative ml-16' : 'space-y-2'}>
        {showTimescale && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-14 -ml-16 border-r border-gray-200">
              {hourMarkers.map((hour) => (
                <div
                  key={hour}
                  className="absolute w-full"
                  style={{
                    top: `${((hour - startTime) / totalTimeRange) * 100}%`,
                  }}
                >
                  <div className="absolute right-full pr-2 translate-y-1 translate-x-10 text-xs text-gray-500 whitespace-nowrap">
                    {formatTime(hour)}
                  </div>
                  <div className="absolute left-0 right-[-9999px] border-t border-gray-100 -translate-y-px" />
                </div>
              ))}
            </div>
            <div 
              className="relative bg-gray-50/30"
              style={{ height: `${totalTimeRange * 60}px` }}
              onClick={() => setSelectedActivity(null)}
            >
              {activities.map((activity, index) => {
                const endTime = activity.startTime + activity.duration;
                const top = ((activity.startTime - startTime) / totalTimeRange) * 100;
                const height = (activity.duration / totalTimeRange) * 100;
                const isShort = height < 5;
                const isSelected = selectedActivity === index;

                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            "absolute left-0 right-0 rounded-lg overflow-hidden cursor-pointer shadow-sm mx-1",
                            isShort ? "z-0" : "",
                            isSelected ? "z-10" : ""
                          )}
                          style={{
                            backgroundColor: colors[activity.category],
                            top: `${top}%`,
                            height: isShort && isSelected ? '4rem' : `${Math.max(height, isShort ? 2 : 4)}%`,
                            transition: 'height 0.2s ease-in-out'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActivity(isSelected ? null : index);
                          }}
                        >
                          <div className="absolute inset-0">
                            <div 
                              className={cn(
                                "absolute inset-0 flex flex-col justify-center transition-all duration-150",
                                isShort ? "p-0.5" : "p-1.5",
                                isShort && isSelected && "p-2 bg-black/20"
                              )}
                            >
                              <div className={cn(
                                "font-medium text-white leading-tight truncate",
                                isShort ? "text-[10px]" : "text-sm",
                                isSelected && isShort && "text-xs mb-1"
                              )}>
                                {activity.label}
                              </div>
                              <div 
                                className={cn(
                                  "text-white/90 truncate transition-all duration-150",
                                  isShort 
                                    ? cn(
                                        "text-[10px] h-0 opacity-0",
                                        isSelected && "h-auto opacity-100"
                                      )
                                    : "text-xs mt-auto"
                                )}
                              >
                                {formatTimeRange(activity.startTime, endTime, activity.duration)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{activity.label}</p>
                        <p className="text-xs text-gray-500">{activity.category}</p>
                        <p className="text-xs">{formatTimeRange(activity.startTime, endTime, activity.duration)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </>
        )}
        
        {!showTimescale && activities.map((activity, index) => {
          const endTime = activity.startTime + activity.duration;

          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="relative h-16 rounded-lg overflow-hidden cursor-pointer shadow-sm"
                    style={{
                      backgroundColor: colors[activity.category],
                    }}
                  >
                    <div className="absolute inset-0 p-3 text-white">
                      <div className="font-semibold">{activity.label}</div>
                      <div className="text-sm opacity-90">
                        {formatTimeRange(activity.startTime, endTime, activity.duration)}
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{activity.category}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Object.entries(categorySummary).map(([category, hours]) => (
          <Card 
            key={category} 
            className="p-2"
            style={{ 
              backgroundColor: `${colors[category as keyof typeof colors]}20`,
              borderLeft: `3px solid ${colors[category as keyof typeof colors]}`
            }}
          >
            <div className="text-xs font-medium text-gray-600">{category}</div>
            <div className="text-sm font-semibold text-gray-900">{(hours as number).toFixed(1)}h</div>
          </Card>
        ))}
      </div>
    </div>
  );
} 