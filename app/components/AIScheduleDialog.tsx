'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { updateScheduleWithAI, AIScheduleUpdateRequest } from '../actions/ai-schedule';
import { Activity } from '../data/schedule';

interface AIScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentSchedule: Record<number, Activity[]>;
  onScheduleUpdate: (newSchedule: Record<number, Activity[]>) => void;
}

export function AIScheduleDialog({ 
  isOpen, 
  onOpenChange, 
  currentSchedule, 
  onScheduleUpdate 
}: AIScheduleDialogProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-5-mini');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAIResponse, setLastAIResponse] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [aiThinkingDetails, setAiThinkingDetails] = useState<string>('');
  const [showAiDetails, setShowAiDetails] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsProcessing(true);
    setLastAIResponse(null);
    setAiThinkingDetails('');
    setCurrentPrompt(prompt.trim());
    setProcessingStep('Analyzing your request...');
    
    try {
      const request: AIScheduleUpdateRequest = {
        prompt: prompt.trim(),
        currentSchedule,
        model: selectedModel
      };

      setProcessingStep('Consulting AI to update your schedule...');
      setAiThinkingDetails('Sending request to OpenAI with your current schedule and request...\n\nPrompt sent to AI:\n"' + prompt.trim() + '"\n\nWaiting for AI response...');
      
      const result = await updateScheduleWithAI(request);
      
      // Show what the AI actually returned
      if (result.success) {
        setAiThinkingDetails(prevDetails => prevDetails + '\n\n✅ AI Response received!\n\nAI Analysis:\n' + (result.explanation || 'Schedule updated successfully'));
      }
      
      if (result.success && result.updatedSchedule) {
        setProcessingStep('Applying changes to your schedule...');
        
        // Update the schedule in the parent component
        onScheduleUpdate(result.updatedSchedule);
        
        // Store the AI's explanation to show in the dialog
        setLastAIResponse(result.explanation || 'Schedule updated successfully');
        
        // Show success toast
        toast.success('Schedule updated successfully', {
          duration: 3000
        });
        
        // Clear the prompt but keep dialog open to show the explanation
        setPrompt('');
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error updating schedule with AI:', error);
      toast.error('Failed to update schedule', {
        description: (error as Error).message || 'Please check your OpenAI configuration and try again.',
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // Auto-scroll to bottom when AI details update and are visible
  useEffect(() => {
    if (showAiDetails && scrollRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [aiThinkingDetails, showAiDetails]);

  const handleCancel = () => {
    setPrompt('');
    setLastAIResponse(null);
    setProcessingStep('');
    setAiThinkingDetails('');
    setShowAiDetails(false);
    setCurrentPrompt('');
    onOpenChange(false);
  };

  // Example prompts to help users get started
  const examplePrompts = [
    "Add a 2-hour lunch break at 12:00 PM on day 2",
    "Insert a 1-hour shopping activity before dinner on day 3", 
    "Add a morning jog at 7:00 AM for 45 minutes on all days",
    "Schedule a 3-hour museum visit on day 4 in the afternoon",
    "Add travel time between activities on day 1"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[90vw] mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Schedule Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-blue-800 dark:text-blue-200">{processingStep}</span>
                </div>
                {aiThinkingDetails && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAiDetails(!showAiDetails);
                      // Auto-scroll to bottom when opening details
                      if (!showAiDetails) {
                        setTimeout(() => {
                          if (scrollRef.current) {
                            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                          }
                        }, 100);
                      }
                    }}
                    className="h-6 px-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    {showAiDetails ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show AI Details
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {/* Collapsible AI Details */}
              {showAiDetails && aiThinkingDetails && (
                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                  <div 
                    ref={scrollRef}
                    className="bg-blue-100 dark:bg-blue-900 rounded p-2 font-mono text-xs text-blue-900 dark:text-blue-100 whitespace-pre-wrap max-h-40 overflow-y-auto"
                  >
                    {aiThinkingDetails}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Response/Explanation */}
          {lastAIResponse && !isProcessing && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <p className="font-medium mb-1">AI Changes Applied:</p>
                    <p>{lastAIResponse}</p>
                  </div>
                </div>
                {aiThinkingDetails && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAiDetails(!showAiDetails);
                      // Auto-scroll to bottom when opening details
                      if (!showAiDetails) {
                        setTimeout(() => {
                          if (scrollRef.current) {
                            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                          }
                        }, 100);
                      }
                    }}
                    className="h-6 px-2 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                  >
                    {showAiDetails ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show Details
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {/* Collapsible AI Details */}
              {showAiDetails && aiThinkingDetails && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                  <div 
                    ref={scrollRef}
                    className="bg-green-100 dark:bg-green-900 rounded p-2 font-mono text-xs text-green-900 dark:text-green-100 whitespace-pre-wrap max-h-40 overflow-y-auto"
                  >
                    {aiThinkingDetails}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Model selection */}
          <div className="space-y-2">
            <Label htmlFor="model-select" className="text-sm font-medium">
              AI Model:
            </Label>
            <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isProcessing}>
              <SelectTrigger id="model-select" className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-5-mini">GPT-5 Mini</SelectItem>
                <SelectItem value="gpt-5-nano">GPT-5 Nano</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Main prompt input */}
          <div className="space-y-2">
            <Label htmlFor="ai-prompt" className="text-sm font-medium">
              Describe what you want to add or change in your schedule:
            </Label>
            <Textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                // Trigger submit on Enter (but not Shift+Enter for new lines)
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isProcessing && prompt.trim()) {
                    handleSubmit();
                  }
                }
              }}
              placeholder="e.g., Add a 2-hour museum visit on day 3 at 2:00 PM, or Insert a lunch break between activities...

💡 Tip: Press Enter to update, or Shift+Enter for new line"
              className="min-h-[100px] text-sm resize-none"
              disabled={isProcessing}
            />
          </div>

          {/* Example prompts */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Example prompts (click to use):
            </Label>
            <div className="grid gap-1">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-950 rounded border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                  disabled={isProcessing}
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {lastAIResponse ? 'Close' : 'Cancel'}
          </Button>
          {!lastAIResponse && (
            <Button 
              onClick={handleSubmit}
              disabled={isProcessing || !prompt.trim()}
              className="w-full sm:w-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {processingStep ? 'Processing...' : 'Updating Schedule...'}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Update Schedule
                </>
              )}
            </Button>
          )}
          {lastAIResponse && (
            <Button 
              onClick={() => {
                setLastAIResponse(null);
                setPrompt('');
                setAiThinkingDetails('');
                setShowAiDetails(false);
                setCurrentPrompt('');
              }}
              className="w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Make Another Update
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
