"use client";

import { useState, useEffect } from 'react';
import { Activity, Category, colors, schedule } from '../data/schedule';
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
import { saveSchedule } from '../actions/schedule';

export function ScheduleEditor() {
  const [currentSchedule, setCurrentSchedule] = useState({ ...schedule });
  const [selectedDay, setSelectedDay] = useState("1");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const days = Object.keys(currentSchedule).sort((a, b) => Number(a) - Number(b));

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
        toast.success("Schedule saved", {
          description: "Your schedule has been successfully saved."
        });
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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schedule Editor</h1>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </Link>
          <Button 
            onClick={handleSaveSchedule} 
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Schedule
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs value={selectedDay} onValueChange={setSelectedDay}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="flex-1 overflow-x-auto">
            {days.map(day => (
              <TabsTrigger key={day} value={day} className="flex-1">
                Day {day}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={handleAddDay}>
              <PlusCircle className="h-4 w-4 mr-1" /> Add Day
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeleteDay} disabled={days.length <= 1}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete Day
            </Button>
          </div>
        </div>
        
        {days.map(day => (
          <TabsContent key={day} value={day} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Activities</span>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
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
                          <PlusCircle className="h-4 w-4 mr-1" /> Add Activity
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
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {currentSchedule[Number(day)]?.map((activity, index) => (
                        <Card key={index} className="relative overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-2"
                            style={{ backgroundColor: colors[activity.category] }}
                          />
                          <CardContent className="p-4 pl-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{activity.label}</h4>
                                <p className="text-sm text-gray-500">
                                  {formatTime(activity.startTime)} - {formatTime(activity.startTime + activity.duration)} 
                                  ({activity.duration.toFixed(1)}h) • {activity.category}
                                </p>
                                {activity.notes && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {activity.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
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
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteActivity(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {currentSchedule[Number(day)]?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No activities for this day. Click "Add Activity" to get started.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
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
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{formData.label ? `Edit: ${formData.label}` : 'Add New Activity'}</DialogTitle>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="label" className="text-right">
            Activity
          </Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, label: e.target.value})}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <Select 
            value={formData.category} 
            onValueChange={(value: string) => setFormData({...formData, category: value as Category})}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(colors) as Category[]).map((category) => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: colors[category] }}
                    />
                    {category}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="startTime" className="text-right">
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
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="duration" className="text-right">
            Duration (hours)
          </Label>
          <Input
            id="duration"
            type="number"
            min="0.25"
            step="0.25"
            value={formData.duration}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, duration: parseFloat(e.target.value)})}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="mapUrl" className="text-right">
            Map URL
          </Label>
          <Input
            id="mapUrl"
            value={formData.mapUrl || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, mapUrl: e.target.value || undefined})}
            className="col-span-3"
            placeholder="https://maps.google.com/?q=..."
          />
        </div>
        
        {formData.category === "Hiking" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="allTrailsUrl" className="text-right">
              AllTrails URL
            </Label>
            <Input
              id="allTrailsUrl"
              value={formData.allTrailsUrl || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, allTrailsUrl: e.target.value || undefined})}
              className="col-span-3"
              placeholder="https://www.alltrails.com/trail/..."
            />
          </div>
        )}
        
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="notes" className="text-right pt-2">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, notes: e.target.value || undefined})}
            className="col-span-3"
            rows={4}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          Save Activity
        </Button>
      </DialogFooter>
    </DialogContent>
  );
} 