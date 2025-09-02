import React, { useState, useMemo } from 'react';
import { CalendarCard, CalendarConsultation } from './CalendarCard';
import { CalendarHeader, CalendarView } from './CalendarHeader';
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  getWeek,
  isSameMonth
} from 'date-fns';
import { cn } from '@/lib/utils';

interface ConsultationCalendarProps {
  consultations: CalendarConsultation[];
  onConsultationClick?: (consultation: CalendarConsultation) => void;
}

export function ConsultationCalendar({ consultations, onConsultationClick }: ConsultationCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');

  const dateRange = useMemo(() => {
    if (view === 'week') {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 })
      };
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return {
        start: startOfWeek(monthStart, { weekStartsOn: 1 }),
        end: endOfWeek(monthEnd, { weekStartsOn: 1 })
      };
    }
  }, [currentDate, view]);

  const days = useMemo(() => {
    return eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  }, [dateRange]);

  const consultationsByDay = useMemo(() => {
    const map = new Map<string, CalendarConsultation[]>();
    
    consultations.forEach(consultation => {
      const dateKey = format(consultation.deadline, 'yyyy-MM-dd');
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, consultation]);
    });
    
    return map;
  }, [consultations]);

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
    } else if (view === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    }
  };

  const dateRangeLabel = useMemo(() => {
    if (view === 'week') {
      const weekNum = getWeek(currentDate, { weekStartsOn: 1 });
      const start = format(dateRange.start, 'MMM d');
      const end = format(dateRange.end, 'MMM d, yyyy');
      return `Week ${weekNum}: ${start} - ${end}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  }, [currentDate, view, dateRange]);

  const renderWeekView = () => {
    return (
      <div className="grid grid-cols-7 gap-6 p-6 bg-white rounded-xl">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayConsultations = consultationsByDay.get(dateKey) || [];
          const isCurrentDay = isToday(day);

          return (
            <div key={dateKey} className="min-h-[450px] flex flex-col">
              <div className={cn(
                "text-center pb-3 mb-4 border-b-2 transition-colors",
                isCurrentDay ? "border-blue-500" : "border-gray-200"
              )}>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {format(day, 'EEE')}
                </div>
                <div className={cn(
                  "text-2xl font-bold mt-1 transition-colors",
                  isCurrentDay ? "text-blue-600" : "text-slate-700"
                )}>
                  {format(day, 'd')}
                </div>
                {isCurrentDay && (
                  <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mt-1">
                    Today
                  </div>
                )}
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {dayConsultations.map((consultation) => (
                  <CalendarCard
                    key={consultation.id}
                    consultation={consultation}
                    onClick={onConsultationClick}
                  />
                ))}
                {dayConsultations.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-3xl mb-2 opacity-20">📅</div>
                    <div className="text-xs text-muted-foreground">
                      No consultations
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 bg-gradient-to-r from-slate-50 to-gray-50 border-b-2 border-gray-200">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="px-3 py-3 text-center">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {day.slice(0, 3)}
              </div>
            </div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayConsultations = consultationsByDay.get(dateKey) || [];
              const isCurrentDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={dateKey}
                  className={cn(
                    "min-h-[140px] p-3 border-r border-b border-gray-200 last:border-r-0 transition-colors hover:bg-gray-50",
                    !isCurrentMonth && "bg-gray-50/50",
                    isCurrentDay && "bg-blue-50 ring-2 ring-blue-400 ring-inset"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn(
                      "text-sm font-bold",
                      !isCurrentMonth && "text-muted-foreground",
                      isCurrentDay && "text-blue-700"
                    )}>
                      {format(day, 'd')}
                    </div>
                    {dayConsultations.length > 0 && (
                      <div className="text-[10px] font-semibold text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                        {dayConsultations.length}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {dayConsultations.slice(0, 2).map((consultation) => (
                      <CalendarCard
                        key={consultation.id}
                        consultation={consultation}
                        isCompact
                        onClick={onConsultationClick}
                      />
                    ))}
                    {dayConsultations.length > 2 && (
                      <div className="text-[10px] text-center text-muted-foreground font-medium bg-gray-100 rounded py-0.5 cursor-pointer hover:bg-gray-200 transition-colors"
                           onClick={() => dayConsultations.forEach(c => onConsultationClick?.(c))}>
                        +{dayConsultations.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
        dateRangeLabel={dateRangeLabel}
      />
      
      <div className="shadow-lg rounded-xl border border-gray-100">
        {view === 'week' ? renderWeekView() : renderMonthView()}
      </div>
    </div>
  );
}