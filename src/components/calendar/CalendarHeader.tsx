import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange } from 'lucide-react';
import { format } from 'date-fns';

export type CalendarView = 'week' | 'month';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  dateRangeLabel: string;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  dateRangeLabel
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate('prev')}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('today')}
        >
          Today
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate('next')}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold ml-2">
          {dateRangeLabel}
        </h2>
      </div>
      
      <ToggleGroup 
        type="single" 
        value={view} 
        onValueChange={(value) => value && onViewChange(value as CalendarView)}
        className="border rounded-md p-1"
      >
        <ToggleGroupItem value="week" aria-label="Week view" className="px-3 py-1">
          <CalendarDays className="h-4 w-4 mr-2" />
          Week
        </ToggleGroupItem>
        <ToggleGroupItem value="month" aria-label="Month view" className="px-3 py-1">
          <CalendarRange className="h-4 w-4 mr-2" />
          Month
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}