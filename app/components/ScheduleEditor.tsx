"use client";

import { useState, useEffect } from 'react';
import { Activity, Category, colors } from '../data/schedule';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DaySchedule } from './DaySchedule';
import { PlusCircle, Trash2, Save, Loader2, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadSchedule, saveSchedule, revalidateSchedulePaths } from '../actions/schedule';

export function ScheduleEditor() {
  const [currentSchedule, setCurrentSchedule] = useState<Record<number, Activity[]>>({});
  const [selectedDay, setSelectedDay] = useState("1");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load schedule from disk when component mounts
  useEffect(() => {
    async function fetchSchedule() {
      try {
        setIsLoading(true);
        const result = await loadSchedule();
        
        if (result.success) {
          setCurrentSchedule(result.data);
          
          // Ensure we have a valid selected day
          if (Object.keys(result.data).length > 0 && !result.data[selectedDay]) {
            setSelectedDay(Object.keys(result.data)[0]);
          }
        } else {
          throw new Error(result.error || 'Failed to load schedule');
        }
      } catch (error) {
        console.error('Error loading schedule:', error);
        toast.error("Error loading schedule", {
          description: (error as Error).message || "An unexpected error occurred"
        });
        // No default schedule to fall back to
        setCurrentSchedule({});
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSchedule();
  }, [selectedDay]);

  const days = Object.keys(currentSchedule).sort((a, b) => Number(a) - Number(b));
  
  // Ensure the selected day tab is visible
  useEffect(() => {
    const selectedTabElement = document.querySelector(`[data-state="active"][role="tab"]`);
    if (selectedTabElement) {
      selectedTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedDay]);

  function handleSaveActivity(activity: Activity, index: number | null) {
    const dayNumber = Number(selectedDay);
    const dayActivities = [...currentSchedule[dayNumber]];
    
    if (index !== null) {
      // Edit existing activity
      dayActivities[index] = activity;
    } else {
      // Add new activity
      dayActivities.push(activity);
      // Sort by start time
      dayActivities.sort((a, b) => a.startTime - b.startTime);
    }
    
    setCurrentSchedule({
      ...currentSchedule,
      [dayNumber]: dayActivities
    });
    
    setIsDialogOpen(false);
    setEditingActivity(null);
    setEditingIndex(null);
  }

  function handleDeleteActivity(index: number) {
    const dayNumber = Number(selectedDay);
    const dayActivities = [...currentSchedule[dayNumber]];
    dayActivities.splice(index, 1);
    
    setCurrentSchedule({
      ...currentSchedule,
      [dayNumber]: dayActivities
    });
  }

  function handleAddDay() {
    const newDayNumber = Math.max(...days.map(Number)) + 1;
    setCurrentSchedule({
      ...currentSchedule,
      [newDayNumber]: []
    });
    setSelectedDay(newDayNumber.toString());
  }

  function handleDeleteDay() {
    if (days.length <= 1) return;
    
    const { [Number(selectedDay)]: _, ...restSchedule } = currentSchedule;
    setCurrentSchedule(restSchedule);
    setSelectedDay(Object.keys(restSchedule)[0]);
  }

  async function handleSaveSchedule() {
    try {
      setIsSaving(true);
      
      const result = await saveSchedule(currentSchedule);
      
      if (result.success) {
        toast.success("Schedule saved", { duration: 1000 });
      } else {
        throw new Error(result.error || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error("Error saving schedule", {
        description: (error as Error).message || "An unexpected error occurred"
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleHomeClick() {
    try {
      setIsNavigating(true);
            
      // Then revalidate the paths
      await revalidateSchedulePaths();
      
      // Navigate to home page
      router.push('/');
      
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error("Error saving schedule", {
        description: (error as Error).message || "An unexpected error occurred"
      });
    }
  }

  function formatTime(time: number): string {
    const hours = Math.floor(time);
    const minutes = Math.round((time % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  function parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + (minutes / 60);
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Schedule Editor</h1>
        <div className="flex gap-2 sm:gap-3">
          <Button 
            onClick={handleHomeClick} 
            size="sm"
            className="text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-1 sm:gap-2"
            disabled={isNavigating || isLoading}
          >
            {isNavigating ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span>Navigating...</span>
              </>
            ) : (
              <>
                <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sm:inline">Home</span>
              </>
            )}
          </Button>
          <Button 
            onClick={handleSaveSchedule} 
            size="sm"
            className="text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-1 sm:gap-2"
            disabled={isSaving || isLoading}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Save</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading schedule...</p>
        </div>
      ) : (
        <Tabs value={selectedDay} onValueChange={setSelectedDay} className="w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-2 sm:mb-4">
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
            <div className="flex gap-2 sm:ml-4">
              <Button variant="outline" size="sm" className="text-xs h-7 sm:h-9" onClick={handleAddDay}>
                <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                <span>Add Day</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 sm:h-9" onClick={handleDeleteDay} disabled={days.length <= 1}>
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                <span>Delete Day</span>
              </Button>
            </div>
          </div>
          
          {days.map(day => (
            <TabsContent key={day} value={day} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader className="px-3 py-2 sm:p-6">
                    <CardTitle className="flex justify-between items-center text-base sm:text-lg">
                      <span>Activities</span>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="h-7 sm:h-9 text-xs sm:text-sm"
                            onClick={() => {
                              setEditingActivity({
                                startTime: 8,
                                duration: 1,
                                label: "",
                                category: "Other"
                              });
                              setEditingIndex(null);
                            }}
                          >
                            <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Add Activity
                          </Button>
                        </DialogTrigger>
                        <ActivityDialog 
                          activity={editingActivity}
                          onSave={(activity) => handleSaveActivity(activity, editingIndex)}
                          onCancel={() => {
                            setIsDialogOpen(false);
                            setEditingActivity(null);
                            setEditingIndex(null);
                          }}
                          formatTime={formatTime}
                          parseTime={parseTime}
                        />
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pt-0 pb-3 sm:p-6 sm:pt-0">
                    <ScrollArea className="h-[400px] sm:h-[500px] pr-2 sm:pr-4">
                      <div className="space-y-3">
                        {currentSchedule[Number(day)]?.map((activity, index) => (
                          <Card key={index} className="relative overflow-hidden">
                            <div 
                              className="absolute left-0 top-0 bottom-0 w-1 sm:w-2"
                              style={{ backgroundColor: colors[activity.category] }}
                            />
                            <CardContent className="p-2 sm:p-4 pl-3 sm:pl-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-sm sm:text-base">{activity.label}</h4>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    {formatTime(activity.startTime)} - {formatTime(activity.startTime + activity.duration)} 
                                    ({activity.duration.toFixed(1)}h) • {activity.category}
                                  </p>
                                  {activity.notes && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                      {activity.notes}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-1 sm:gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
                                    onClick={() => {
                                      setEditingActivity({...activity});
                                      setEditingIndex(index);
                                      setIsDialogOpen(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 sm:h-8 text-red-500 hover:text-red-700 px-2 sm:px-3"
                                    onClick={() => handleDeleteActivity(index)}
                                  >
                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {currentSchedule[Number(day)]?.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            No activities for this day. Click &quot;Add Activity&quot; to get started.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="px-3 py-2 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pt-0 pb-3 sm:p-6 sm:pt-0">
                    <DaySchedule 
                      day={Number(day)} 
                      activities={currentSchedule[Number(day)] || []} 
                      defaultShowTimescale={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

interface ActivityDialogProps {
  activity: Activity | null;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
  formatTime: (time: number) => string;
  parseTime: (timeStr: string) => number;
}

function ActivityDialog({ activity, onSave, onCancel, formatTime, parseTime }: ActivityDialogProps) {
  const [formData, setFormData] = useState<Activity>(
    activity || {
      startTime: 8,
      duration: 1,
      label: "",
      category: "Other"
    }
  );

  // Update formData when activity changes (important for edit mode)
  useEffect(() => {
    if (activity) {
      setFormData(activity);
    }
  }, [activity]);

  if (!activity) return null;

  return (
    <DialogContent className="sm:max-w-[500px] w-[80vw] mx-auto max-h-[90vh] overflow-y-auto p-2 sm:p-6">
      <DialogHeader className="pb-1 sm:pb-2">
        <DialogTitle className="text-sm sm:text-xl">
          {formData.label ? `Edit: ${formData.label}` : 'Add New Activity'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-2 sm:gap-5 py-1 sm:py-2">
        {/* Activity Name */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="label" className="text-xs sm:text-sm font-medium">
            Activity Name
          </Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, label: e.target.value})}
            className="w-full h-8 sm:h-10 text-xs sm:text-sm"
          />
        </div>
        
        {/* Category */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="category" className="text-xs sm:text-sm font-medium">
            Category
          </Label>
          <Select 
            value={formData.category} 
            onValueChange={(value: string) => setFormData({...formData, category: value as Category})}
          >
            <SelectTrigger className="w-full h-8 sm:h-10 text-xs sm:text-sm">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(colors) as Category[]).map((category) => (
                <SelectItem key={category} value={category} className="text-xs sm:text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 sm:w-4 sm:h-4 rounded-full mr-1 sm:mr-2" 
                      style={{ backgroundColor: colors[category] }}
                    />
                    {category}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Time and Duration */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="startTime" className="text-xs sm:text-sm font-medium">
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              value={formatTime(formData.startTime).replace('.', ':')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const timeValue = e.target.value;
                if (timeValue) {
                  setFormData({...formData, startTime: parseTime(timeValue)});
                }
              }}
              className="w-full h-8 sm:h-10 text-xs sm:text-sm"
            />
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="duration" className="text-xs sm:text-sm font-medium">
              Duration
            </Label>
            <Input
              id="duration"
              type="number"
              min="0.25"
              step="0.25"
              value={formData.duration}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, duration: parseFloat(e.target.value)})}
              className="w-full h-8 sm:h-10 text-xs sm:text-sm"
            />
          </div>
        </div>
        
        {/* Map URL */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="mapUrl" className="text-xs sm:text-sm font-medium">
            Map URL
          </Label>
          <Input
            id="mapUrl"
            value={formData.mapUrl || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, mapUrl: e.target.value || undefined})}
            className="w-full h-8 sm:h-10 text-xs sm:text-sm truncate"
            placeholder="Maps URL..."
          />
        </div>
        
        {/* AllTrails URL (only for Hiking) */}
        {formData.category === "Hiking" && (
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="allTrailsUrl" className="text-xs sm:text-sm font-medium">
              AllTrails URL
            </Label>
            <Input
              id="allTrailsUrl"
              value={formData.allTrailsUrl || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, allTrailsUrl: e.target.value || undefined})}
              className="w-full h-8 sm:h-10 text-xs sm:text-sm truncate"
              placeholder="AllTrails URL..."
            />
          </div>
        )}
        
        {/* Notes */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="notes" className="text-xs sm:text-sm font-medium">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, notes: e.target.value || undefined})}
            className="w-full text-xs sm:text-sm"
            rows={3}
          />
        </div>
      </div>
      
      <DialogFooter className="flex-col gap-2 pt-2 sm:pt-4 sm:flex-row sm:gap-0">
        <Button variant="outline" onClick={onCancel} className="w-full h-8 sm:h-10 text-xs sm:text-sm sm:w-auto">
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)} className="w-full h-8 sm:h-10 text-xs sm:text-sm sm:w-auto">
          Save Activity
        </Button>
      </DialogFooter>
    </DialogContent>
  );
} 