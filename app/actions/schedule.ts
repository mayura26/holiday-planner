'use server';

import fs from 'fs';
import path from 'path';
import { Activity, DaySchedule } from '../data/schedule';
import { revalidatePath } from 'next/cache';

// Get the file path for the schedule data
const getScheduleFilePath = () => {
  return path.join(process.cwd(), 'app/data/schedule-data.json');
};

export async function loadSchedule() {
  try {
    const filePath = getScheduleFilePath();
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      // If not, return an empty schedule
      return { 
        success: true, 
        data: {} as Record<number, DaySchedule>
      };
    }
    
    // Read the schedule from the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    return { 
      success: true, 
      data
    };
  } catch (error) {
    console.error('Error reading schedule file:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: {} as Record<number, DaySchedule>  // Provide empty data on error
    };
  }
}

export async function saveSchedule(scheduleData: Record<number, Activity[]>) {
  try {
    const filePath = getScheduleFilePath();
    
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the schedule to the file
    fs.writeFileSync(filePath, JSON.stringify(scheduleData, null, 2), 'utf8');
    
    return { success: true };
  } catch (error) {
    console.error('Error saving schedule file:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// New action to revalidate specific paths
export async function revalidateSchedulePaths() {
  try {
    // Revalidate the home page and summary page
    revalidatePath('/');
    revalidatePath('/summary');
    return { success: true };
  } catch (error) {
    console.error('Error revalidating paths:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 