import React, { useState, useEffect } from 'react';
import { ConsultationCalendar } from '@/components/calendar/ConsultationCalendar';
import { CalendarConsultation } from '@/components/calendar/CalendarCard';
import { NationDecision } from '@/components/dashboard/InlineDecisionEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InlineDecisionEditor } from '@/components/dashboard/InlineDecisionEditor';

export function ConsultationCalendarPage() {
  const [consultations, setConsultations] = useState<CalendarConsultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<CalendarConsultation | null>(null);
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  // Load mock data
  useEffect(() => {
    const mockData: CalendarConsultation[] = [
      {
        id: '1',
        company: 'Northern Energy Corp',
        project: 'Pipeline Extension',
        deadline: new Date('2025-09-08'),
        decision: 'pending',
      },
      {
        id: '2',
        company: 'Green Forest Industries',
        project: 'Forestry Initiative',
        deadline: new Date('2025-09-15'),
        decision: 'pending',
      },
      {
        id: '3',
        company: 'Rocky Mountain Mining',
        project: 'Copper Mine Expansion',
        deadline: new Date('2025-09-04'),
        decision: 'pending',
      },
      {
        id: '4',
        company: 'Wind Power Solutions',
        project: 'Wind Farm Development',
        deadline: new Date('2025-09-12'),
        decision: 'pending',
      },
      {
        id: '5',
        company: 'TransCanada Infrastructure',
        project: 'Highway Expansion',
        deadline: new Date('2025-09-20'),
        decision: 'endorse_no_concerns',
      },
      {
        id: '6',
        company: 'Solar Energy Partners',
        project: 'Solar Installation',
        deadline: new Date('2025-09-02'),
        decision: 'pending',
      },
      {
        id: '7',
        company: 'Blue Water Resources',
        project: 'Water Treatment Plant',
        deadline: new Date('2025-09-25'),
        decision: 'pending',
      },
      {
        id: '8',
        company: 'Pacific Timber Co',
        project: 'Sustainable Logging Project',
        deadline: new Date('2025-09-10'),
        decision: 'conditional_endorsement',
      },
      {
        id: '9',
        company: 'Metro Development Group',
        project: 'Urban Expansion Plan',
        deadline: new Date('2025-09-18'),
        decision: 'pending',
      },
      {
        id: '10',
        company: 'Natural Gas Solutions',
        project: 'Gas Line Installation',
        deadline: new Date('2025-09-22'),
        decision: 'pending',
      },
    ];

    // Add days remaining calculation
    const dataWithDays = mockData.map(item => ({
      ...item,
      daysRemaining: differenceInDays(item.deadline, new Date())
    }));

    setConsultations(dataWithDays);
  }, []);

  const handleDecisionUpdate = (id: string, decision: NationDecision) => {
    setConsultations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, decision } : c
      )
    );
    // Also update the selected consultation if it's the one being edited
    if (selectedConsultation?.id === id) {
      setSelectedConsultation({ ...selectedConsultation, decision });
    }
  };

  const handleConsultationClick = (consultation: CalendarConsultation) => {
    setSelectedConsultation(consultation);
  };

  const filteredConsultations = showOnlyPending 
    ? consultations.filter(c => !c.decision || c.decision === 'pending')
    : consultations;

  // Calculate stats
  const activeCount = consultations.filter(c => !c.decision || c.decision === 'pending').length;
  const completedCount = consultations.filter(c => c.decision && c.decision !== 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/nation">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Consultation Calendar
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View all consultation deadlines and decisions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={showOnlyPending ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyPending(!showOnlyPending)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showOnlyPending ? 'Show All' : 'Pending Only'}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
            <span className="text-sm font-medium text-blue-700">Active</span>
            <span className="text-sm font-bold text-blue-900">{activeCount}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
            <span className="text-sm font-medium text-green-700">Completed</span>
            <span className="text-sm font-bold text-green-900">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <ConsultationCalendar
        consultations={filteredConsultations}
        onConsultationClick={handleConsultationClick}
      />

      {/* Consultation Detail Dialog */}
      <Dialog open={!!selectedConsultation} onOpenChange={(open) => !open && setSelectedConsultation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedConsultation?.company}</DialogTitle>
            <DialogDescription>
              {selectedConsultation?.project}
            </DialogDescription>
          </DialogHeader>
          
          {selectedConsultation && (
            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                <p className="font-medium">
                  {selectedConsultation.deadline.toLocaleDateString('en-CA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Decision</p>
                <InlineDecisionEditor
                  value={selectedConsultation.decision}
                  onSave={(decision) => handleDecisionUpdate(selectedConsultation.id, decision)}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedConsultation(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}