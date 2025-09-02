import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NationDecision = 
  | 'pending'
  | 'endorse_no_concerns' 
  | 'conditional_endorsement' 
  | 'not_endorsed';

interface InlineDecisionEditorProps {
  currentDecision: NationDecision | null;
  onSave: (decision: NationDecision) => void;
  autoSave?: boolean;
  className?: string;
}

export function InlineDecisionEditor({
  currentDecision,
  onSave,
  autoSave = true,
  className
}: InlineDecisionEditorProps) {
  const [selectedDecision, setSelectedDecision] = useState<NationDecision | null>(currentDecision);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDecisionChange = async (value: string) => {
    const newDecision = value as NationDecision;
    setSelectedDecision(newDecision);
    setHasChanges(true);

    if (autoSave) {
      setIsSaving(true);
      await onSave(newDecision);
      setTimeout(() => {
        setIsSaving(false);
        setHasChanges(false);
      }, 500);
    }
  };

  const handleSave = async () => {
    if (selectedDecision && hasChanges) {
      setIsSaving(true);
      await onSave(selectedDecision);
      setTimeout(() => {
        setIsSaving(false);
        setHasChanges(false);
      }, 500);
    }
  };

  const getDecisionColor = (decision: NationDecision | null) => {
    if (!decision) return '';
    switch (decision) {
      case 'pending':
        return 'text-blue-600';
      case 'endorse_no_concerns':
        return 'text-green-600';
      case 'conditional_endorsement':
        return 'text-yellow-600';
      case 'not_endorsed':
        return 'text-red-600';
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        value={selectedDecision || undefined}
        onValueChange={handleDecisionChange}
      >
        <SelectTrigger 
          className={cn(
            "w-[220px]",
            getDecisionColor(selectedDecision),
            isSaving && "opacity-50"
          )}
        >
          <SelectValue placeholder="Make decision..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">
            <span className="flex items-center gap-2">
              <span className="text-blue-600">●</span>
              Pending
            </span>
          </SelectItem>
          <SelectItem value="endorse_no_concerns">
            <span className="flex items-center gap-2">
              <span className="text-green-600">●</span>
              Endorse
            </span>
          </SelectItem>
          <SelectItem value="conditional_endorsement">
            <span className="flex items-center gap-2">
              <span className="text-yellow-600">●</span>
              Conditional
            </span>
          </SelectItem>
          <SelectItem value="not_endorsed">
            <span className="flex items-center gap-2">
              <span className="text-red-600">●</span>
              Not Endorsed
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      {!autoSave && hasChanges && (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedDecision(currentDecision);
              setHasChanges(false);
            }}
            disabled={isSaving}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )}

      {isSaving && (
        <span className="text-xs text-muted-foreground">Saving...</span>
      )}
    </div>
  );
}