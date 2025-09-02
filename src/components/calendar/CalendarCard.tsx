import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { NationDecision } from '@/components/dashboard/InlineDecisionEditor';
import { differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

export interface CalendarConsultation {
  id: string;
  company: string;
  project: string;
  deadline: Date;
  decision: NationDecision;
  daysRemaining?: number;
}

interface CalendarCardProps {
  consultation: CalendarConsultation;
  isCompact?: boolean;
  onClick?: (consultation: CalendarConsultation) => void;
}

export function CalendarCard({ consultation, isCompact = false, onClick }: CalendarCardProps) {
  const daysRemaining = differenceInDays(consultation.deadline, new Date());
  const isPending = !consultation.decision || consultation.decision === 'pending';
  const isDueToday = isPending && daysRemaining === 0;
  const isActionRequired = isPending && daysRemaining > 0 && daysRemaining <= 7;
  const isOverdue = isPending && daysRemaining < 0;
  
  const getCardStyle = () => {
    if (!isPending) return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-400 hover:shadow-lg hover:shadow-green-100/50';
    if (isOverdue) return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300 hover:border-red-400 hover:shadow-lg hover:shadow-red-100/50';
    if (isDueToday) return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300 hover:border-red-400 hover:shadow-lg hover:shadow-red-100/50';
    if (isActionRequired) return 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-100/50';
    return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-100/50';
  };

  const getTimeDisplay = () => {
    if (!isPending) {
      const icons = {
        endorse_no_concerns: <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />,
        conditional_endorsement: <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />,
        not_endorsed: <XCircle className="h-3.5 w-3.5 text-red-600" />,
        pending: <Clock className="h-3.5 w-3.5 text-slate-600" />
      };
      const labels = {
        endorse_no_concerns: 'Endorsed',
        conditional_endorsement: 'Conditional',
        not_endorsed: 'Not Endorsed',
        pending: 'Pending'
      };
      return (
        <div className="flex items-center gap-1.5">
          {icons[consultation.decision]}
          <span className="text-xs font-medium">{labels[consultation.decision]}</span>
        </div>
      );
    }
    
    if (isOverdue) {
      return (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-red-600 animate-pulse" />
          <span className="text-xs font-semibold text-red-700">{Math.abs(daysRemaining)}d overdue</span>
        </div>
      );
    }
    
    if (isDueToday) {
      return (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-red-600 animate-pulse" />
          <span className="text-xs font-semibold text-red-700">Due Today</span>
        </div>
      );
    }
    
    if (isActionRequired) {
      return (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-orange-600" />
          <span className="text-xs font-semibold text-orange-700">Action Required</span>
        </div>
      );
    }
    
    // For consultations further than 7 days out
    return (
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-gray-500" />
        <span className="text-xs text-gray-600">{daysRemaining} days</span>
      </div>
    );
  };

  if (isCompact) {
    return (
      <div
        className={cn(
          "p-2 rounded-lg border-2 cursor-pointer transition-all transform hover:scale-105",
          getCardStyle()
        )}
        onClick={() => onClick?.(consultation)}
      >
        <div className="text-xs font-semibold truncate text-slate-800">{consultation.project}</div>
        <div className="mt-1.5">
          {getTimeDisplay()}
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all transform hover:scale-[1.02] border-2",
        getCardStyle()
      )}
      onClick={() => onClick?.(consultation)}
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight">
            {consultation.project}
          </h4>
        </div>
        
        <div className="flex items-center justify-between">
          {getTimeDisplay()}
        </div>
      </div>
    </Card>
  );
}