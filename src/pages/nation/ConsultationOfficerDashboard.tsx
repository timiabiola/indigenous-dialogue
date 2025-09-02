import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConsultationTable, ConsultationRequest } from '@/components/dashboard/ConsultationTable';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { NationDecision } from '@/components/dashboard/NationDecisionDropdown';
import { calculateDecisionStatus } from '@/components/dashboard/StatusBadge';
import { 
  Search, 
  Filter, 
  FileText, 
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  MessageSquare,
  Paperclip,
  Send
} from 'lucide-react';

export function ConsultationOfficerDashboard() {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('assigned');
  const officerId = '101'; // This would come from auth context
  const officerName = 'Sarah Johnson';

  // Mock data - replace with actual Supabase queries
  useEffect(() => {
    const mockConsultations: ConsultationRequest[] = [
      {
        id: '1',
        proponent_company: 'Northern Energy Corp',
        project_name: 'Pipeline Extension Project',
        project_type: 'oil_gas',
        consultation_level: 'level_2',
        status: 'action_needed',
        priority: 'critical',
        response_deadline: new Date('2025-09-08'),
        nation_decision: 'pending',
        decision_date: null,
        assigned_officer_id: '101',
        assigned_officer_name: 'Sarah Johnson',
        consultation_fee: 5000,
        payment_status: 'paid',
        created_at: new Date('2025-08-25'),
      },
      {
        id: '4',
        proponent_company: 'Wind Power Solutions',
        project_name: 'Wind Farm Development',
        project_type: 'utilities',
        consultation_level: 'level_2',
        status: 'on_track',
        priority: 'standard',
        response_deadline: new Date('2025-09-12'),
        nation_decision: 'pending',
        decision_date: null,
        assigned_officer_id: '101',
        assigned_officer_name: 'Sarah Johnson',
        consultation_fee: 7500,
        payment_status: 'paid',
        created_at: new Date('2025-08-26'),
      },
      {
        id: '5',
        proponent_company: 'TransCanada Infrastructure',
        project_name: 'Highway Expansion',
        project_type: 'infrastructure',
        consultation_level: 'level_1',
        status: 'on_track',
        priority: 'standard',
        response_deadline: new Date('2025-09-18'),
        nation_decision: 'conditional_endorsement',
        decision_date: new Date('2025-09-01'),
        assigned_officer_id: '101',
        assigned_officer_name: 'Sarah Johnson',
        consultation_fee: 3500,
        payment_status: 'paid',
        created_at: new Date('2025-08-22'),
      },
    ];
    setConsultations(mockConsultations);
  }, []);

  const handleDecisionUpdate = (id: string, decision: NationDecision) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, nation_decision: decision, decision_date: new Date() }
          : c
      )
    );
  };

  const handleViewDetails = (id: string) => {
    console.log(`Viewing details for consultation ${id}`);
  };

  // Filter consultations assigned to this officer
  const myConsultations = consultations.filter(
    c => c.assigned_officer_id === officerId
  );

  // Calculate metrics for assigned consultations
  const totalAssigned = myConsultations.length;
  const actionNeeded = myConsultations.filter(c => c.status === 'action_needed').length;
  const completedDecisions = myConsultations.filter(c => c.nation_decision !== null && c.nation_decision !== 'pending').length;
  const dueSoon = myConsultations.filter(c => {
    const status = calculateDecisionStatus(c.nation_decision, c.response_deadline);
    return status === 'due_soon' || status === 'overdue';
  }).length;

  const filteredConsultations = myConsultations.filter(c =>
    c.proponent_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingDecisions = myConsultations.filter(c => !c.nation_decision || c.nation_decision === 'pending');
  const completedConsultations = myConsultations.filter(c => c.nation_decision && c.nation_decision !== 'pending');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultation Officer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {officerName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Clock className="mr-1 h-3 w-3" />
            {new Date().toLocaleDateString('en-CA', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="My Consultations"
          value={totalAssigned}
          description="Assigned to me"
          icon={<FileText className="h-4 w-4" />}
          color="blue"
        />
        <DashboardCard
          title="Action Needed"
          value={actionNeeded}
          description="Requires immediate attention"
          icon={<AlertCircle className="h-4 w-4" />}
          color="orange"
        />
        <DashboardCard
          title="Due Soon"
          value={dueSoon}
          description="Next 7 days"
          icon={<Clock className="h-4 w-4" />}
          color={dueSoon > 0 ? "red" : "green"}
        />
        <DashboardCard
          title="Completed"
          value={`${completedDecisions}/${totalAssigned}`}
          description={`${Math.round((completedDecisions / totalAssigned) * 100)}% completion rate`}
          icon={<CheckCircle className="h-4 w-4" />}
          color="green"
        />
      </div>

      {/* Deadline Alerts */}
      {dueSoon > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myConsultations
                .filter(c => {
                  const status = calculateDecisionStatus(c.nation_decision, c.response_deadline);
                  return status === 'due_soon' || status === 'overdue';
                })
                .map((c) => {
                  const daysLeft = Math.ceil(
                    (c.response_deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-white border">
                      <div>
                        <p className="font-medium">{c.project_name}</p>
                        <p className="text-sm text-muted-foreground">{c.proponent_company}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={daysLeft <= 1 ? "destructive" : "outline"}>
                          {daysLeft <= 0 ? 'Overdue' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.response_deadline.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assigned">
            Assigned ({totalAssigned})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Decision ({pendingDecisions.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedConsultations.length})
          </TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Assigned Consultations</CardTitle>
                  <CardDescription>
                    All consultations currently assigned to you
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search consultations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-[300px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ConsultationTable
                consultations={filteredConsultations}
                userRole="consultation_officer"
                onDecisionUpdate={handleDecisionUpdate}
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Decisions</CardTitle>
              <CardDescription>
                Consultations awaiting your decision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsultationTable
                consultations={pendingDecisions}
                userRole="consultation_officer"
                onDecisionUpdate={handleDecisionUpdate}
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Consultations</CardTitle>
              <CardDescription>
                Consultations with decisions made
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsultationTable
                consultations={completedConsultations}
                userRole="consultation_officer"
                onDecisionUpdate={handleDecisionUpdate}
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>
                  Communications related to your consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Northern Energy Corp</p>
                        <p className="text-sm text-muted-foreground">
                          Additional documents submitted for Pipeline Extension
                        </p>
                      </div>
                      <Badge variant="outline">
                        <Paperclip className="mr-1 h-3 w-3" />
                        2 files
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">System Notification</p>
                      <p className="text-sm text-muted-foreground">
                        Reminder: Wind Farm Development deadline in 3 days
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Response</CardTitle>
                <CardDescription>
                  Send a message or update to a consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation..." />
                    </SelectTrigger>
                    <SelectContent>
                      {myConsultations.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.project_name} - {c.proponent_company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Type your message..."
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="mr-2 h-4 w-4" />
                      Attach
                    </Button>
                    <Button size="sm" className="ml-auto">
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import additional components that were missing
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';