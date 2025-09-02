import React, { useState, useEffect } from 'react';
import { SimplifiedConsultationTable, SimplifiedConsultation } from '@/components/dashboard/SimplifiedConsultationTable';
import { NationDecision } from '@/components/dashboard/InlineDecisionEditor';
import { EmailConfirmationDialog } from '@/components/dashboard/EmailConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Search, Filter, CheckCircle, AlertCircle, Clock, Calendar } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { sendDecisionEmail } from '@/lib/api/email';

export function SimplifiedNationDashboard() {
  const [consultations, setConsultations] = useState<SimplifiedConsultation[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<SimplifiedConsultation | null>(null);
  const [emailLoadingId, setEmailLoadingId] = useState<string>();
  const { toast } = useToast();

  // Load mock data
  useEffect(() => {
    const mockData: SimplifiedConsultation[] = [
      {
        id: '1',
        company: 'Northern Energy Corp',
        project: 'Pipeline Extension',
        deadline: new Date('2025-09-08'),
        decision: 'pending',
        emailSent: false,
      },
      {
        id: '2',
        company: 'Green Forest Industries',
        project: 'Forestry Initiative',
        deadline: new Date('2025-09-15'),
        decision: 'pending',
        emailSent: false,
      },
      {
        id: '3',
        company: 'Rocky Mountain Mining',
        project: 'Copper Mine Expansion',
        deadline: new Date('2025-09-04'),
        decision: 'pending',
        emailSent: false,
      },
      {
        id: '4',
        company: 'Wind Power Solutions',
        project: 'Wind Farm Development',
        deadline: new Date('2025-09-12'),
        decision: 'pending',
        emailSent: false,
      },
      {
        id: '5',
        company: 'TransCanada Infrastructure',
        project: 'Highway Expansion',
        deadline: new Date('2025-09-20'),
        decision: 'endorse_no_concerns',
        emailSent: false,
      },
      {
        id: '6',
        company: 'Solar Energy Partners',
        project: 'Solar Installation',
        deadline: new Date('2025-09-02'),
        decision: 'pending',
        emailSent: false,
      },
      {
        id: '7',
        company: 'Blue Water Resources',
        project: 'Water Treatment Plant',
        deadline: new Date('2025-09-25'),
        decision: 'pending',
        emailSent: false,
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
  };

  const handleSendEmail = (consultation: SimplifiedConsultation) => {
    setSelectedConsultation(consultation);
    setEmailDialogOpen(true);
  };

  const handleEmailConfirm = async () => {
    if (!selectedConsultation) return;
    
    setEmailLoadingId(selectedConsultation.id);
    
    try {
      const response = await sendDecisionEmail({
        id: selectedConsultation.id,
        company: selectedConsultation.company,
        project: selectedConsultation.project,
        decision: selectedConsultation.decision,
        deadline: selectedConsultation.deadline,
      });

      if (response.success) {
        setConsultations(prev =>
          prev.map(c =>
            c.id === selectedConsultation.id 
              ? { ...c, emailSent: true, emailSentAt: new Date() }
              : c
          )
        );
        
        const isConditional = selectedConsultation.decision === 'conditional_endorsement';
        toast({
          title: isConditional ? "Draft created successfully" : "Email sent successfully",
          description: isConditional 
            ? `Draft reply created for ${selectedConsultation.company}` 
            : `Decision email sent to ${selectedConsultation.company}`,
        });
      } else {
        toast({
          title: "Failed to send email",
          description: response.error || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setEmailLoadingId(undefined);
      setEmailDialogOpen(false);
      setSelectedConsultation(null);
    }
  };

  // Filter consultations
  const filteredConsultations = consultations.filter(c => {
    // Filter by email sent status (hide consultations where email has been sent)
    if (!showEmailSent && c.emailSent) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        c.company.toLowerCase().includes(query) ||
        c.project.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Calculate stats - now based on email sent status instead of decision
  const activeCount = consultations.filter(c => !c.emailSent).length;
  const overdueCount = consultations.filter(c => 
    !c.emailSent && differenceInDays(c.deadline, new Date()) <= 0
  ).length;
  const urgentCount = consultations.filter(c => 
    !c.emailSent && differenceInDays(c.deadline, new Date()) > 0 && differenceInDays(c.deadline, new Date()) <= 7
  ).length;
  const emailSentCount = consultations.filter(c => c.emailSent).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Simple Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Active Consultations
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Review and make decisions on consultation requests
        </p>
      </div>

      {/* Status Summary - Simple Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span className="text-sm font-medium text-gray-700">Active</span>
          <span className="text-sm font-bold text-gray-900">{activeCount}</span>
        </div>
        
        {overdueCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">Overdue</span>
            <span className="text-sm font-bold text-red-900">{overdueCount}</span>
          </div>
        )}
        
        {urgentCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-full border border-yellow-200">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Due Soon</span>
            <span className="text-sm font-bold text-yellow-900">{urgentCount}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700">Email Sent</span>
          <span className="text-sm font-bold text-green-900">{emailSentCount}</span>
        </div>
      </div>

      {/* Optional Controls - Hidden by default */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {showSearch ? 'Hide Search' : 'Search'}
          </Button>
          
          {/* Show Email Sent Toggle */}
          <Button
            variant={showEmailSent ? "default" : "outline"}
            size="sm"
            onClick={() => setShowEmailSent(!showEmailSent)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showEmailSent ? 'All' : 'Active Only'}
          </Button>
        </div>
        
        {/* Calendar View Button */}
        <Link to="/nation/calendar">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </Button>
        </Link>
      </div>

      {/* Search Bar - Only show when toggled */}
      {showSearch && (
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by company or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SimplifiedConsultationTable
          consultations={filteredConsultations}
          onDecisionUpdate={handleDecisionUpdate}
          onSendEmail={handleSendEmail}
          emailLoadingId={emailLoadingId}
        />
      </div>

      {/* Simple Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        {activeCount === 0 ? (
          <span className="text-green-600 font-medium">
            ✓ All consultation emails have been sent
          </span>
        ) : (
          <span>
            {activeCount} consultation{activeCount !== 1 ? 's' : ''} remaining
          </span>
        )}
      </div>

      {/* Email Confirmation Dialog */}
      <EmailConfirmationDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        consultation={selectedConsultation}
        onConfirm={handleEmailConfirm}
        isLoading={!!emailLoadingId}
      />
    </div>
  );
}