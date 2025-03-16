'use server';

import fs from 'fs/promises';
import path from 'path';
import { Activity, DaySchedule } from '../data/schedule';

export async function saveSchedule(schedule: Record<number, DaySchedule>) {
  try {
    // Format the schedule data as a TypeScript file
    const scheduleContent = `export type Activity = {
  startTime: number;
  duration: number;
  label: string;
  category: Category;
  notes?: string;
  mapUrl?: string;
  allTrailsUrl?: string;
};

export type Category =
  | "Driving"
  | "Hiking"
  | "Rafting"
  | "Eating"
  | "Hotel/Rest"
  | "Other"


export type DaySchedule = Activity[];

export const colors: Record<Category, string> = {
  "Driving": "#B91C1C", // Darker red
  "Hiking": "#2F855A", // Darker green
  "Rafting": "#2B6CB0", // Darker blue
  "Eating": "#6B46C1", // Darker purple
  "Hotel/Rest": "#4A5568", // Darker yellow/gold
  "Other": "#065F60" // Darker teal
};

export const schedule: Record<number, DaySchedule> = ${JSON.stringify(schedule, null, 2)};
`;

    // Write to the schedule.ts file
    const filePath = path.join(process.cwd(), 'app', 'data', 'schedule.ts');
    await fs.writeFile(filePath, scheduleContent);

    return { success: true };
  } catch (error) {
    console.error('Error saving schedule:', error);
    return { success: false, error: (error as Error).message };
  }
} 