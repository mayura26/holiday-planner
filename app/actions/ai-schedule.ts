'use server';

import OpenAI from 'openai';
import { Activity, Category, colors } from '../data/schedule';
import { loadSchedule, saveSchedule } from './schedule';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIScheduleUpdateRequest {
  prompt: string;
  currentSchedule: Record<number, Activity[]>;
  model: string;
}

export interface AIScheduleUpdateResponse {
  success: boolean;
  updatedSchedule?: Record<number, Activity[]>;
  error?: string;
  explanation?: string;
}

const systemPrompt = `You are a helpful assistant that updates holiday/travel schedules based on user requests. 

Current schedule structure:
- The schedule is organized by day numbers (1, 2, 3, etc.)
- Each day contains an array of activities
- Each activity has: date (YYYY-MM-DD), startTime (decimal hours, e.g. 14.5 for 2:30 PM), duration (decimal hours), label (string), category, and optional notes
- Categories available: ${Object.keys(colors).join(', ')}

Rules:
1. Always preserve existing activities unless explicitly asked to modify/delete them
2. When adding new activities, maintain chronological order within each day
3. Use realistic time estimates for activities
4. If dates aren't specified, infer based on existing schedule context
5. Provide brief explanation of changes made
6. Only return valid JSON for the schedule structure
7. Be conservative - if unsure about a change, ask for clarification rather than making assumptions

Response format: Return ONLY a JSON object with this structure:
{
  "schedule": { /* updated schedule object */ },
  "explanation": "Brief description of changes made"
}`;

export async function updateScheduleWithAI(request: AIScheduleUpdateRequest): Promise<AIScheduleUpdateResponse> {
  try {
    // Validate API key exists
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env.local file.'
      };
    }

    const userPrompt = `
Current schedule:
${JSON.stringify(request.currentSchedule, null, 2)}

User request: ${request.prompt}

Please update the schedule according to the user's request and provide an explanation of the changes.`;

    // Configure token parameter based on model type
    // Increased limit to accommodate airline tickets and detailed travel data
    const isGPT5Model = request.model.startsWith('gpt-5');
    const tokenConfig = isGPT5Model 
      ? { max_completion_tokens: 8000 }
      : { max_tokens: 8000 };

    const completion = await openai.chat.completions.create({
      model: request.model, // Use the model specified by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: isGPT5Model ? 1 : 0.1, // Lower temperature for more consistent results
      ...tokenConfig,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response received from OpenAI');
    }

    // Parse the AI response
    let aiResponse;
    try {
      aiResponse = JSON.parse(response);
    } catch (parseError) {
      throw new Error('Invalid JSON response from AI: ' + response);
    }

    // Validate the response structure
    if (!aiResponse.schedule || !aiResponse.explanation) {
      throw new Error('Invalid response format from AI');
    }

    // Validate the schedule structure
    const updatedSchedule = aiResponse.schedule;
    for (const day in updatedSchedule) {
      if (!Array.isArray(updatedSchedule[day])) {
        throw new Error(`Day ${day} activities should be an array`);
      }
      
      for (const activity of updatedSchedule[day]) {
        if (typeof activity !== 'object' || activity === null) {
          throw new Error(`Invalid activity in day ${day}`);
        }
        
        if (typeof activity.label !== 'string' || 
            typeof activity.startTime !== 'number' || 
            typeof activity.duration !== 'number' ||
            typeof activity.date !== 'string' ||
            !Object.keys(colors).includes(activity.category)) {
          throw new Error(`Invalid activity data in day ${day}: ${JSON.stringify(activity)}`);
        }
      }
    }

    // Save the updated schedule
    const saveResult = await saveSchedule(updatedSchedule);
    if (!saveResult.success) {
      throw new Error('Failed to save updated schedule: ' + saveResult.error);
    }

    return {
      success: true,
      updatedSchedule,
      explanation: aiResponse.explanation
    };

  } catch (error) {
    console.error('Error in AI schedule update:', error);
    
    // Provide more specific error messages
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Invalid OpenAI API key. Please check your configuration.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'OpenAI API quota exceeded. Please check your billing.';
      } else if (error.message.includes('Invalid JSON')) {
        errorMessage = 'AI returned invalid response. Please try rephrasing your request.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}
