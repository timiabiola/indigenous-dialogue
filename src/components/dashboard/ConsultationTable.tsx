import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge, calculateDecisionStatus } from './StatusBadge';
import { NationDecisionDropdown, NationDecision, getDecisionLabel } from './NationDecisionDropdown';
import { format } from 'date-fns';
import { MoreHorizontal, FileText, User, Calendar } from 'lucide-react';

export interface ConsultationRequest {
  id: string;
  proponent_company: string;
  project_name: string;
  project_type: string;
  consultation_level: 'level_1' | 'level_2' | 'level_3';
  status: 'action_needed' | 'on_track';
  priority: 'critical' | 'standard';
  response_deadline: Date;
  nation_decision: NationDecision | null;
  decision_date: Date | null;
  assigned_officer_id: string | null;
  assigned_officer_name?: string;
  consultation_fee: number;
  payment_status: 'not_required' | 'pending' | 'paid' | 'overdue';
  created_at: Date;
}

export type UserRole = 
  | 'nation_admin' 
  | 'consultation_officer' 
  | 'nation_leadership';

interface ConsultationTableProps {
  consultations: ConsultationRequest[];
  userRole: UserRole;
  onDecisionUpdate?: (id: string, decision: NationDecision) => void;
  onAssignOfficer?: (id: string, officerId: string) => void;
  onViewDetails?: (id: string) => void;
  showBulkActions?: boolean;
}

export function ConsultationTable({
  consultations,
  userRole,
  onDecisionUpdate,
  onAssignOfficer,
  onViewDetails,
  showBulkActions = false,
}: ConsultationTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const isReadOnly = userRole === 'nation_leadership';
  const canUpdateDecision = userRole === 'nation_admin' || userRole === 'consultation_officer';
  const canAssignOfficer = userRole === 'nation_admin';

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(consultations.map(c => c.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedRows(newSelection);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {showBulkActions && selectedRows.size > 0 && !isReadOnly && (
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedRows.size} consultation(s) selected
          </span>
          <Button size="sm" variant="outline">
            Bulk Update Decision
          </Button>
          {canAssignOfficer && (
            <Button size="sm" variant="outline">
              Assign Officer
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {showBulkActions && !isReadOnly && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === consultations.length && consultations.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead>Company</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Decision Status</TableHead>
              <TableHead>Nation's Decision</TableHead>
              {userRole === 'nation_admin' && (
                <>
                  <TableHead>Officer</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Payment</TableHead>
                </>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((consultation) => {
              const decisionStatus = calculateDecisionStatus(
                consultation.nation_decision,
                consultation.response_deadline
              );

              return (
                <TableRow key={consultation.id}>
                  {showBulkActions && !isReadOnly && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(consultation.id)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(consultation.id, checked as boolean)
                        }
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    {consultation.proponent_company}
                  </TableCell>
                  <TableCell>{consultation.project_name}</TableCell>
                  <TableCell className="capitalize">
                    {consultation.project_type.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium">
                      {consultation.consultation_level.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={consultation.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={consultation.priority} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(consultation.response_deadline, 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={decisionStatus} />
                  </TableCell>
                  <TableCell>
                    {canUpdateDecision && !consultation.nation_decision ? (
                      <NationDecisionDropdown
                        value={consultation.nation_decision}
                        onChange={(decision) => onDecisionUpdate?.(consultation.id, decision)}
                        className="w-[200px]"
                      />
                    ) : (
                      <span className="text-sm">
                        {getDecisionLabel(consultation.nation_decision)}
                      </span>
                    )}
                  </TableCell>
                  {userRole === 'nation_admin' && (
                    <>
                      <TableCell>
                        {consultation.assigned_officer_name || (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onAssignOfficer?.(consultation.id, '')}
                          >
                            <User className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(consultation.consultation_fee)}</TableCell>
                      <TableCell>
                        <StatusBadge 
                          status={consultation.payment_status === 'paid' ? 'completed' : 
                                 consultation.payment_status === 'overdue' ? 'overdue' : 'pending'} 
                        />
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onViewDetails?.(consultation.id)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {canUpdateDecision && !consultation.nation_decision && (
                          <DropdownMenuItem>
                            Make Decision
                          </DropdownMenuItem>
                        )}
                        {canAssignOfficer && !consultation.assigned_officer_id && (
                          <DropdownMenuItem>
                            Assign Officer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}