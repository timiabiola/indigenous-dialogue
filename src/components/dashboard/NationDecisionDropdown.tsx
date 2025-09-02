import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type NationDecision = 
  | 'pending'
  | 'endorse_no_concerns' 
  | 'conditional_endorsement' 
  | 'unable_to_endorse';

interface NationDecisionDropdownProps {
  value: NationDecision | null;
  onChange: (decision: NationDecision) => void;
  disabled?: boolean;
  className?: string;
}

const decisionLabels: Record<NationDecision, string> = {
  pending: 'Pending Review',
  endorse_no_concerns: 'Endorse with No Concerns',
  conditional_endorsement: 'Conditional Endorsement',
  unable_to_endorse: 'Unable to Endorse',
};

export function NationDecisionDropdown({
  value,
  onChange,
  disabled = false,
  className,
}: NationDecisionDropdownProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(val) => onChange(val as NationDecision)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select decision..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">
          <span className="flex items-center">
            <span className="mr-2">🔵</span>
            {decisionLabels.pending}
          </span>
        </SelectItem>
        <SelectItem value="endorse_no_concerns">
          <span className="flex items-center">
            <span className="mr-2">✅</span>
            {decisionLabels.endorse_no_concerns}
          </span>
        </SelectItem>
        <SelectItem value="conditional_endorsement">
          <span className="flex items-center">
            <span className="mr-2">⚠️</span>
            {decisionLabels.conditional_endorsement}
          </span>
        </SelectItem>
        <SelectItem value="unable_to_endorse">
          <span className="flex items-center">
            <span className="mr-2">❌</span>
            {decisionLabels.unable_to_endorse}
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export function getDecisionLabel(decision: NationDecision | null): string {
  if (!decision) return 'No Decision';
  return decisionLabels[decision];
}