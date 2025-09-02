import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type DecisionStatus = 'completed' | 'due_soon' | 'overdue' | 'pending';
export type ConsultationStatus = 'action_needed' | 'on_track';
export type Priority = 'critical' | 'standard';

interface StatusBadgeProps {
  status: DecisionStatus | ConsultationStatus | Priority;
  className?: string;
}

const statusConfig = {
  // Decision status
  completed: {
    label: 'Completed',
    icon: '🟢',
    className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
  },
  due_soon: {
    label: 'Due Soon',
    icon: '🟡',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
  },
  overdue: {
    label: 'Overdue',
    icon: '🔴',
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
  },
  pending: {
    label: 'Pending',
    icon: '⚪',
    className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100',
  },
  // Consultation status
  action_needed: {
    label: 'Action Needed',
    icon: '🟠',
    className: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100',
  },
  on_track: {
    label: 'On Track',
    icon: '🟢',
    className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
  },
  // Priority
  critical: {
    label: 'Critical',
    icon: '🔴',
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
  },
  standard: {
    label: 'Standard',
    icon: '🟠',
    className: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}

export function calculateDecisionStatus(
  nationDecision: string | null,
  responseDeadline: Date
): DecisionStatus {
  if (nationDecision !== null && nationDecision !== 'pending') return 'completed';
  
  const today = new Date();
  const deadline = new Date(responseDeadline);
  const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDeadline <= 1) return 'overdue';
  if (daysUntilDeadline <= 7) return 'due_soon';
  return 'pending';
}