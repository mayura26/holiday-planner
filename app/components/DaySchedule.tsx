"use client";

import { Activity, colors, Category } from '../data/schedule';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DayScheduleProps {
  day: number;
  activities: Activity[];
  defaultShowTimescale?: boolean;
  globalStartTime?: number;
  globalEndTime?: number;
  isCompact?: boolean;
}

function formatTime(time: number): string {
  const hours = Math.floor(time);
  const minutes = Math.round((time % 1) * 60);
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

export function DaySchedule({ 
  day, 
  activities, 
  defaultShowTimescale = false,
  globalStartTime,
  globalEndTime,
  isCompact = false
}: DayScheduleProps) {
  const [showTimescale, setShowTimescale] = useState(defaultShowTimescale);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [showNotes, setShowNotes] = useState<Activity | null>(null);
  const totalHours = activities.reduce((sum, activity) => sum + activity.duration, 0);
  const categorySummary = Object.fromEntries(
    Object.keys(colors).map(category => [
      category,
      activities
        .filter(activity => activity.category === category)
        .reduce((sum, activity) => sum + activity.duration, 0)
    ] as [string, number])
    .filter(([_, hours]) => hours > 0)
  );

  // Calculate time range for visualization
  const startTime = globalStartTime ?? Math.min(...activities.map(a => a.startTime));
  const endTime = globalEndTime ?? Math.max(...activities.map(a => a.startTime + a.duration));
  const totalTimeRange = endTime - startTime;
  const hourMarkers = Array.from(
    { length: Math.ceil(endTime) - Math.floor(startTime) + 1 },
    (_, i) => Math.floor(startTime) + i
  );

  return (
    <div className={cn("space-y-3", isCompact && "space-y-1.5")}>
      <div className={cn(
        "flex justify-between items-center",
        isCompact && "text-sm"
      )}>
        <h3 className={cn(
          "font-bold",
          isCompact ? "text-base" : "text-2xl"
        )}>Day {day}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-1">
            <Switch
              id={`timescale-${day}`}
              checked={showTimescale}
              onCheckedChange={setShowTimescale}
            />
            <Label htmlFor={`timescale-${day}`} className={cn(
              isCompact && "text-xs"
            )}>Time</Label>
          </div>
          <div className={cn(
            "text-gray-600",
            isCompact ? "text-xs" : "text-sm"
          )}>
            {totalHours.toFixed(1)}h
          </div>
        </div>
      </div>

      <div className={showTimescale ? 'relative ml-12' : 'space-y-1.5'}>
        {showTimescale && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-10 -ml-12 border-r border-gray-200 overflow-hidden">
              {hourMarkers.map((hour) => (
                <div
                  key={hour}
                  className="absolute w-full"
                  style={{
                    top: `${((hour - startTime) / totalTimeRange) * 100}%`,
                  }}
                >
                  <div className={cn(
                    "absolute right-full pr-1 translate-y-1 translate-x-10 whitespace-nowrap text-gray-500",
                    isCompact ? "text-[8px]" : "text-xs"
                  )}>
                    {formatTime(hour)}
                  </div>
                  <div className="absolute left-0 right-0 border-t border-gray-100 -translate-y-px" />
                </div>
              ))}
            </div>
            <div 
              className="relative bg-gray-50/30 overflow-hidden"
              style={{ height: isCompact ? `${totalTimeRange * 35}px` : `${totalTimeRange * 60}px` }}
              onClick={() => setSelectedActivity(null)}
            >
              {activities.map((activity, index) => {
                const endTime = activity.startTime + activity.duration;
                const top = ((activity.startTime - startTime) / totalTimeRange) * 100;
                const height = (activity.duration / totalTimeRange) * 100;
                const isShort = height < 4;
                const isSelected = selectedActivity === index;

                return (
                  <div 
                    key={index}
                    className={cn(
                      "absolute left-0 right-0 rounded-md overflow-hidden cursor-pointer shadow-sm mx-0.5",
                      isShort ? "z-0" : "",
                      isSelected ? "z-10" : ""
                    )}
                    style={{
                      backgroundColor: colors[activity.category],
                      top: `${top}%`,
                      height: isShort && isSelected ? '3rem' : `${Math.max(height, isShort ? 1.5 : 3)}%`,
                      transition: 'height 0.2s ease-in-out'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activity.notes || activity.mapUrl) {
                        setShowNotes(activity);
                      } else {
                        setSelectedActivity(isSelected ? null : index);
                      }
                    }}
                  >
                    <div className="absolute inset-0">
                      <div 
                        className={cn(
                          "absolute inset-0 flex flex-col justify-center transition-all duration-150",
                          isShort ? "p-0.5" : "p-1",
                          isShort && isSelected && "p-1.5 bg-black/20"
                        )}
                      >
                        <div className={cn(
                          "font-medium text-white leading-tight truncate",
                          isShort ? "text-[8px]" : "text-xs",
                          isSelected && isShort && "text-[10px] mb-0.5"
                        )}>
                          {activity.label}
                          {activity.mapUrl && (
                            <span className="ml-1 inline-flex items-center">
                              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div 
                          className={cn(
                            "text-white/90 truncate transition-all duration-150",
                            isShort 
                              ? cn(
                                  "text-[8px] h-0 opacity-0",
                                  isSelected && "h-auto opacity-100"
                                )
                              : "text-[10px] mt-auto"
                          )}
                        >
                          {formatTimeRange(activity.startTime, endTime, activity.duration)}
                          {isSelected && activity.notes && (
                            <div className="mt-1 text-[9px] opacity-90 whitespace-pre-wrap">
                              {activity.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        
        {!showTimescale && activities.map((activity, index) => {
          const endTime = activity.startTime + activity.duration;

          return (
            <div 
              key={index}
              className={cn(
                "relative rounded-lg overflow-hidden cursor-pointer shadow-sm",
                isCompact ? "h-12" : "h-16"
              )}
              style={{
                backgroundColor: colors[activity.category],
              }}
              onClick={() => {
                if (activity.notes || activity.mapUrl) {
                  setShowNotes(activity);
                }
              }}
            >
              <div className={cn(
                "absolute inset-0 text-white",
                isCompact ? "p-2" : "p-3"
              )}>
                <div className={cn(
                  "font-semibold flex items-center justify-between",
                  isCompact && "text-sm"
                )}>
                  <span className="flex items-center">
                    {activity.label}
                    {activity.mapUrl && (
                      <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    )}
                  </span>
                  {activity.notes && (
                    <svg 
                      className="w-4 h-4 opacity-75" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className={cn(
                  "opacity-90",
                  isCompact ? "text-xs" : "text-sm"
                )}>
                  {formatTimeRange(activity.startTime, endTime, activity.duration)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {Object.entries(categorySummary).map(([category, hours]) => (
          <Card 
            key={category} 
            className={cn(
              "relative overflow-hidden",
              isCompact ? "p-1.5" : "p-2"
            )}
            style={{ 
              backgroundColor: `${colors[category as keyof typeof colors]}20`,
              borderLeft: `3px solid ${colors[category as keyof typeof colors]}`
            }}
          >
            <div className={cn(
              "font-medium text-gray-600",
              isCompact ? "text-[10px]" : "text-xs"
            )}>{category}</div>
            <div className={cn(
              "font-semibold text-gray-900",
              isCompact ? "text-xs" : "text-sm"
            )}>{(hours as number).toFixed(1)}h</div>
          </Card>
        ))}
      </div>

      <Dialog open={showNotes !== null} onOpenChange={() => setShowNotes(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showNotes?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              {showNotes?.category}
            </div>
            <div className="text-sm">
              {formatTimeRange(
                showNotes?.startTime || 0,
                (showNotes?.startTime || 0) + (showNotes?.duration || 0),
                showNotes?.duration || 0
              )}
            </div>
            {showNotes?.mapUrl && (
              <div className="text-sm mt-2">
                <a 
                  href={showNotes.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg 
                    className="w-4 h-4 mr-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {showNotes.category === "Hiking" 
                    ? "View Trailhead Parking on Google Maps" 
                    : "View on Google Maps"}
                </a>
              </div>
            )}
            
            {showNotes?.category === "Hiking" && showNotes?.allTrailsUrl && (
              <div className="text-sm mt-2">
                <a 
                  href={showNotes.allTrailsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 flex items-center"
                >
                  <svg 
                    className="w-4 h-4 mr-1" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4.5 9.5c0 1.1-.9 2-2 2s-2-.9-2-2h-4c0 1.1-.9 2-2 2s-2-.9-2-2H4v-3h1v-4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4h1v3h-1.5z" />
                  </svg>
                  View Trail on AllTrails
                </a>
              </div>
            )}

            {showNotes?.notes && (
              <div className="text-sm whitespace-pre-wrap border-t pt-2 mt-2">
                {showNotes.notes}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 