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
import { PlusCircle, Trash2, Save, Loader2, Home, Upload, Download, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChangeEvent } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadSchedule, saveSchedule, revalidateSchedulePaths } from '../actions/schedule';
import { AIScheduleDialog } from './AIScheduleDialog';

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

export function ScheduleEditor() {
  const [currentSchedule, setCurrentSchedule] = useState<Record<number, Activity[]>>({});
  const [selectedDay, setSelectedDay] = useState("1");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
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
    
    // Calculate the next date based on the last day's date
    let nextDate = "2025-09-01"; // Default start date
    if (days.length > 0) {
      const lastDayNumber = Math.max(...days.map(Number));
      const lastDayActivities = currentSchedule[lastDayNumber] || [];
      const lastActivity = lastDayActivities[0];
      if (lastActivity?.date) {
        const lastDate = new Date(lastActivity.date);
        lastDate.setDate(lastDate.getDate() + 1);
        nextDate = lastDate.toISOString().split('T')[0];
      }
    }
    
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

  function handleExportSchedule() {
    try {
      // Convert the schedule to JSON
      const scheduleJson = JSON.stringify(currentSchedule, null, 2);
      
      // Create a blob with the JSON data
      const blob = new Blob([scheduleJson], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'schedule.json';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Schedule exported", { duration: 1000 });
    } catch (error) {
      console.error('Error exporting schedule:', error);
      toast.error("Error exporting schedule", {
        description: (error as Error).message || "An unexpected error occurred"
      });
    }
  }

  function handleImportSchedule() {
    try {
      setImportError('');
      
      if (!importData.trim()) {
        setImportError('Please paste JSON data');
        return;
      }
      
      // Parse the JSON data
      const parsedData = JSON.parse(importData);
      
      // Basic validation: ensure it's an object with numeric keys
      if (typeof parsedData !== 'object' || parsedData === null || Array.isArray(parsedData)) {
        setImportError('Invalid schedule format');
        return;
      }
      
      // Validate each day's activities
      for (const day in parsedData) {
        if (!Array.isArray(parsedData[day])) {
          setImportError(`Day ${day} activities should be an array`);
          return;
        }
        
        for (const activity of parsedData[day]) {
          if (typeof activity !== 'object' || activity === null) {
            setImportError(`Invalid activity in day ${day}`);
            return;
          }
          
          if (typeof activity.label !== 'string' || 
              typeof activity.startTime !== 'number' || 
              typeof activity.duration !== 'number' ||
              typeof activity.date !== 'string' ||
              !Object.keys(colors).includes(activity.category)) {
            setImportError(`Invalid activity data in day ${day}`);
            return;
          }
        }
      }
      
      // Update the schedule
      setCurrentSchedule(parsedData);
      setImportDialogOpen(false);
      setImportData('');
      
      // If we just imported a schedule and the current selected day doesn't exist,
      // select the first day
      if (!parsedData[selectedDay] && Object.keys(parsedData).length > 0) {
        setSelectedDay(Object.keys(parsedData)[0]);
      }
      
      toast.success("Schedule imported", { duration: 1000 });
    } catch (error) {
      console.error('Error importing schedule:', error);
      setImportError('Invalid JSON data');
    }
  }

  function handleAIScheduleUpdate(newSchedule: Record<number, Activity[]>) {
    setCurrentSchedule(newSchedule);
    
    // If the current selected day doesn't exist in the new schedule, select the first available day
    if (!newSchedule[Number(selectedDay)] && Object.keys(newSchedule).length > 0) {
      const firstDay = Object.keys(newSchedule).sort((a, b) => Number(a) - Number(b))[0];
      setSelectedDay(firstDay);
    }
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
          
          {/* Export and Import Buttons */}
          <Button 
            onClick={handleExportSchedule} 
            size="sm"
            variant="outline"
            className="text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-1 sm:gap-2"
            disabled={isLoading || Object.keys(currentSchedule).length === 0}
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                variant="outline"
                className="text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-1 sm:gap-2"
                disabled={isLoading}
              >
                <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Import</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] w-[80vw] mx-auto max-h-[90vh] overflow-y-auto p-2 sm:p-6">
              <DialogHeader className="pb-1 sm:pb-2">
                <DialogTitle className="text-sm sm:text-xl">Import Schedule</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-2 sm:gap-5 py-1 sm:py-2">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="importData" className="text-xs sm:text-sm font-medium">
                    Paste JSON Data
                  </Label>
                  <Textarea
                    id="importData"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    className="w-full text-xs sm:text-sm font-mono"
                    rows={10}
                    placeholder="Paste your schedule JSON here..."
                  />
                  {importError && (
                    <p className="text-xs text-red-500">{importError}</p>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex-col gap-2 pt-2 sm:pt-4 sm:flex-row sm:gap-0">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setImportDialogOpen(false);
                    setImportData('');
                    setImportError('');
                  }} 
                  className="w-full h-8 sm:h-10 text-xs sm:text-sm sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleImportSchedule} 
                  className="w-full h-8 sm:h-10 text-xs sm:text-sm sm:w-auto"
                >
                  Import
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* AI Schedule Update Button */}
          <Button 
            onClick={() => setAiDialogOpen(true)}
            size="sm"
            variant="outline"
            className="text-xs sm:text-sm h-8 sm:h-10 flex items-center gap-1 sm:gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-950"
            disabled={isLoading || Object.keys(currentSchedule).length === 0}
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">AI Update</span>
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
                {days.map(day => {
                  const dayActivities = currentSchedule[Number(day)] || [];
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
                              const dayActivities = currentSchedule[Number(selectedDay)] || [];
                              let defaultDate = "2025-09-01";
                              
                              if (dayActivities.length > 0) {
                                const firstActivity = dayActivities[0];
                                defaultDate = firstActivity?.date || "2025-09-01";
                              } else {
                                // If no activities exist for this day, calculate the date based on day number
                                const dayNumber = Number(selectedDay);
                                if (dayNumber > 1) {
                                  const previousDay = dayNumber - 1;
                                  const previousDayActivities = currentSchedule[previousDay] || [];
                                  const previousActivity = previousDayActivities[0];
                                  if (previousActivity?.date) {
                                    const prevDate = new Date(previousActivity.date);
                                    prevDate.setDate(prevDate.getDate() + 1);
                                    defaultDate = prevDate.toISOString().split('T')[0];
                                  }
                                }
                              }
                              
                              setEditingActivity({
                                date: defaultDate,
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
      
      {/* AI Schedule Dialog */}
      <AIScheduleDialog
        isOpen={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        currentSchedule={currentSchedule}
        onScheduleUpdate={handleAIScheduleUpdate}
      />
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
      date: "2025-09-01",
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
        
        {/* Date */}
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="date" className="text-xs sm:text-sm font-medium">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, date: e.target.value})}
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