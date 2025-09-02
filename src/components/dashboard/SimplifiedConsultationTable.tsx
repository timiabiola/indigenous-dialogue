import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InlineDecisionEditor, NationDecision } from './InlineDecisionEditor';
import { Button } from '@/components/ui/button';
import { format, differenceInDays } from 'date-fns';
import { AlertCircle, Clock, Mail, CheckCircle, AlertTriangle, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SimplifiedConsultation {
  id: string;
  company: string;
  project: string;
  deadline: Date;
  decision: NationDecision | null;
  daysRemaining?: number;
  emailSent: boolean;
  emailSentAt?: Date;
}

interface SimplifiedConsultationTableProps {
  consultations: SimplifiedConsultation[];
  onDecisionUpdate: (id: string, decision: NationDecision) => void;
  onSendEmail: (consultation: SimplifiedConsultation) => void;
  emailLoadingId?: string;
}

export function SimplifiedConsultationTable({
  consultations,
  onDecisionUpdate,
  onSendEmail,
  emailLoadingId,
}: SimplifiedConsultationTableProps) {
  
  const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining <= 0) return 'text-red-600 font-bold';
    if (daysRemaining <= 3) return 'text-red-500';
    if (daysRemaining <= 7) return 'text-yellow-500';
    return 'text-gray-600';
  };

  const getRowColor = (daysRemaining: number, decision: NationDecision | null) => {
    if (decision && decision !== 'pending') return 'bg-green-50/30';
    if (decision === 'pending') return 'bg-blue-50/30';
    if (daysRemaining <= 0) return 'bg-red-50';
    if (daysRemaining <= 3) return 'bg-orange-50';
    if (daysRemaining <= 7) return 'bg-yellow-50';
    return '';
  };

  const renderEmailButton = (consultation: SimplifiedConsultation) => {
    const isLoading = emailLoadingId === consultation.id;
    const hasDecision = consultation.decision && consultation.decision !== 'pending';
    
    if (consultation.emailSent) {
      return (
        <Button
          disabled
          size="sm"
          variant="outline"
          className="bg-green-50 border-green-200 text-green-700 cursor-default"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Email Sent
        </Button>
      );
    }
    
    // Don't show email button if no decision has been made yet
    if (!hasDecision) {
      return (
        <div className="text-xs text-muted-foreground text-center py-2">
          Make decision first
        </div>
      );
    }
    
    // Check if this is a conditional endorsement
    const isConditional = consultation.decision === 'conditional_endorsement';
    
    return (
      <Button
        onClick={() => onSendEmail(consultation)}
        disabled={isLoading}
        size="sm"
        variant={isConditional ? "outline" : "default"}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Sending...
          </>
        ) : isConditional ? (
          <>
            <Edit3 className="h-4 w-4" />
            Draft Reply
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" />
            Send Email
          </>
        )}
      </Button>
    );
  };

  const sortedConsultations = [...consultations].sort((a, b) => {
    // Sort by urgency: pending and no decision come first, then by deadline
    const isPendingA = !a.decision || a.decision === 'pending';
    const isPendingB = !b.decision || b.decision === 'pending';
    
    if (isPendingA && !isPendingB) return -1;
    if (!isPendingA && isPendingB) return 1;
    
    const daysA = differenceInDays(a.deadline, new Date());
    const daysB = differenceInDays(b.deadline, new Date());
    return daysA - daysB;
  });

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold text-base">Company</TableHead>
            <TableHead className="font-semibold text-base">Project</TableHead>
            <TableHead className="font-semibold text-base">Deadline</TableHead>
            <TableHead className="font-semibold text-base">Days Left</TableHead>
            <TableHead className="font-semibold text-base">Decision</TableHead>
            <TableHead className="font-semibold text-base text-center">Send Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedConsultations.map((consultation) => {
            const daysRemaining = differenceInDays(consultation.deadline, new Date());
            const isOverdue = daysRemaining <= 0;
            const isUrgent = daysRemaining <= 3;
            
            return (
              <TableRow 
                key={consultation.id}
                className={cn(
                  "hover:bg-gray-50/50 transition-colors",
                  getRowColor(daysRemaining, consultation.decision)
                )}
              >
                <TableCell className="font-medium text-base py-4">
                  {consultation.company}
                </TableCell>
                <TableCell className="text-base py-4">
                  {consultation.project}
                </TableCell>
                <TableCell className="text-base py-4">
                  <div className="flex items-center gap-2">
                    {isOverdue && <AlertCircle className="h-4 w-4 text-red-600" />}
                    {!isOverdue && isUrgent && <Clock className="h-4 w-4 text-orange-500" />}
                    <span className={cn(
                      isOverdue && "text-red-600 font-semibold",
                      isUrgent && !isOverdue && "text-orange-600"
                    )}>
                      {format(consultation.deadline, 'MMM dd, yyyy')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-base py-4">
                  <span className={getUrgencyColor(daysRemaining)}>
                    {daysRemaining <= 0 
                      ? `Overdue by ${Math.abs(daysRemaining)} days`
                      : daysRemaining === 1 
                        ? '1 day'
                        : `${daysRemaining} days`
                    }
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <InlineDecisionEditor
                    currentDecision={consultation.decision}
                    onSave={(decision) => onDecisionUpdate(consultation.id, decision)}
                    autoSave={true}
                  />
                </TableCell>
                <TableCell className="py-4 text-center">
                  {renderEmailButton(consultation)}
                </TableCell>
              </TableRow>
            );
          })}
          {sortedConsultations.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No active consultations
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}