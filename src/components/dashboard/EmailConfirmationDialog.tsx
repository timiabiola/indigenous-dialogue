import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NationDecision } from './InlineDecisionEditor';
import { Mail, Building2, FileText, Calendar, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EmailConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultation: {
    id: string;
    company: string;
    project: string;
    decision: NationDecision | null;
    deadline: Date;
  } | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

const getDecisionDisplay = (decision: NationDecision | null) => {
  const decisionLabels = {
    pending: 'Pending Decision',
    endorse_no_concerns: 'Endorsed with No Concerns',
    conditional_endorsement: 'Conditional Endorsement',
    not_endorsed: 'Not Endorsed'
  };

  const decisionColors = {
    pending: 'bg-blue-100 text-blue-800 border-blue-200',
    endorse_no_concerns: 'bg-green-100 text-green-800 border-green-200',
    conditional_endorsement: 'bg-amber-100 text-amber-800 border-amber-200',
    not_endorsed: 'bg-red-100 text-red-800 border-red-200'
  };

  if (!decision) decision = 'pending';
  
  return {
    label: decisionLabels[decision],
    color: decisionColors[decision]
  };
};

export function EmailConfirmationDialog({
  open,
  onOpenChange,
  consultation,
  onConfirm,
  isLoading = false
}: EmailConfirmationDialogProps) {
  if (!consultation) return null;

  const decisionDisplay = getDecisionDisplay(consultation.decision);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {consultation.decision === 'conditional_endorsement' ? (
              <Edit3 className="h-5 w-5 text-amber-600" />
            ) : (
              <Mail className="h-5 w-5 text-blue-600" />
            )}
            <DialogTitle>
              {consultation.decision === 'conditional_endorsement' 
                ? 'Draft Reply Email' 
                : 'Send Decision Email'
              }
            </DialogTitle>
          </div>
          <DialogDescription>
            {consultation.decision === 'conditional_endorsement'
              ? 'This will create a draft reply where you can add specific conditions before sending.'
              : 'Confirm sending the consultation decision email with the details below.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">{consultation.company}</p>
                <p className="text-xs text-muted-foreground">Recipient</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">{consultation.project}</p>
                <p className="text-xs text-muted-foreground">Project</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {format(consultation.deadline, 'MMMM d, yyyy')}
                </p>
                <p className="text-xs text-muted-foreground">Deadline</p>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Decision:</span>
                <Badge variant="outline" className={decisionDisplay.color}>
                  {decisionDisplay.label}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "text-sm text-muted-foreground p-3 rounded-lg",
            consultation.decision === 'conditional_endorsement' 
              ? "bg-amber-50" 
              : "bg-blue-50"
          )}>
            <p className={cn(
              "font-medium mb-1",
              consultation.decision === 'conditional_endorsement' 
                ? "text-amber-900" 
                : "text-blue-900"
            )}>
              What happens next?
            </p>
            <p className={cn(
              consultation.decision === 'conditional_endorsement' 
                ? "text-amber-800" 
                : "text-blue-800"
            )}>
              {consultation.decision === 'conditional_endorsement'
                ? 'A draft email will be created where you can specify the conditions for endorsement before sending to the company.'
                : 'An email will be sent to the company with your decision and any relevant consultation details.'
              }
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {consultation.decision === 'conditional_endorsement' ? 'Creating Draft...' : 'Sending...'}
              </>
            ) : consultation.decision === 'conditional_endorsement' ? (
              <>
                <Edit3 className="h-4 w-4" />
                Create Draft
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}