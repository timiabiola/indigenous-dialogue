import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConsultationTable, ConsultationRequest } from '@/components/dashboard/ConsultationTable';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { NationDecision } from '@/components/dashboard/NationDecisionDropdown';
import { calculateDecisionStatus } from '@/components/dashboard/StatusBadge';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Users, 
  FileText, 
  DollarSign, 
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';

export function NationAdminDashboard() {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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
        id: '2',
        proponent_company: 'Green Forest Industries',
        project_name: 'Sustainable Forestry Initiative',
        project_type: 'forestry',
        consultation_level: 'level_1',
        status: 'on_track',
        priority: 'standard',
        response_deadline: new Date('2025-09-15'),
        nation_decision: 'pending',
        decision_date: null,
        assigned_officer_id: null,
        consultation_fee: 3000,
        payment_status: 'pending',
        created_at: new Date('2025-08-28'),
      },
      {
        id: '3',
        proponent_company: 'Rocky Mountain Mining',
        project_name: 'Copper Mine Expansion',
        project_type: 'mining',
        consultation_level: 'level_3',
        status: 'on_track',
        priority: 'standard',
        response_deadline: new Date('2025-09-20'),
        nation_decision: 'endorse_no_concerns',
        decision_date: new Date('2025-08-30'),
        assigned_officer_id: '102',
        assigned_officer_name: 'Michael Bear',
        consultation_fee: 10000,
        payment_status: 'paid',
        created_at: new Date('2025-08-20'),
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

  const handleAssignOfficer = (id: string, officerId: string) => {
    console.log(`Assigning officer ${officerId} to consultation ${id}`);
  };

  const handleViewDetails = (id: string) => {
    console.log(`Viewing details for consultation ${id}`);
  };

  // Calculate dashboard metrics
  const totalConsultations = consultations.length;
  const actionNeeded = consultations.filter(c => c.status === 'action_needed').length;
  const completedDecisions = consultations.filter(c => c.nation_decision !== null && c.nation_decision !== 'pending').length;
  const overdueConsultations = consultations.filter(c => {
    const status = calculateDecisionStatus(c.nation_decision, c.response_deadline);
    return status === 'overdue';
  }).length;
  const totalRevenue = consultations
    .filter(c => c.payment_status === 'paid')
    .reduce((sum, c) => sum + c.consultation_fee, 0);
  const pendingPayments = consultations
    .filter(c => c.payment_status === 'pending')
    .reduce((sum, c) => sum + c.consultation_fee, 0);

  const filteredConsultations = consultations.filter(c =>
    c.proponent_company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nation Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage consultations, decisions, and team members
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Consultation
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Consultations"
          value={totalConsultations}
          description="All time"
          icon={<FileText className="h-4 w-4" />}
          color="blue"
        />
        <DashboardCard
          title="Action Needed"
          value={actionNeeded}
          description="Requires attention"
          icon={<AlertCircle className="h-4 w-4" />}
          color="orange"
          change={actionNeeded > 0 ? 15 : 0}
          trend={actionNeeded > 0 ? "up" : "neutral"}
        />
        <DashboardCard
          title="Overdue"
          value={overdueConsultations}
          description="Past deadline"
          icon={<Clock className="h-4 w-4" />}
          color="red"
        />
        <DashboardCard
          title="Completed"
          value={completedDecisions}
          description={`${Math.round((completedDecisions / totalConsultations) * 100)}% completion rate`}
          icon={<CheckCircle className="h-4 w-4" />}
          color="green"
          change={12}
          trend="up"
        />
      </div>

      {/* Revenue Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          description="From paid consultations"
          icon={<DollarSign className="h-4 w-4" />}
          color="green"
          change={25}
          trend="up"
        />
        <DashboardCard
          title="Pending Payments"
          value={`$${pendingPayments.toLocaleString()}`}
          description="Awaiting payment"
          icon={<TrendingUp className="h-4 w-4" />}
          color="orange"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Consultations</CardTitle>
              <CardDescription>
                Latest consultation requests requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsultationTable
                consultations={consultations.slice(0, 5)}
                userRole="nation_admin"
                onDecisionUpdate={handleDecisionUpdate}
                onAssignOfficer={handleAssignOfficer}
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Decision Distribution</CardTitle>
                <CardDescription>Breakdown of decisions made</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Endorsed with No Concerns</span>
                    <span className="font-bold">
                      {consultations.filter(c => c.nation_decision === 'endorse_no_concerns').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conditional Endorsement</span>
                    <span className="font-bold">
                      {consultations.filter(c => c.nation_decision === 'conditional_endorsement').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unable to Endorse</span>
                    <span className="font-bold">
                      {consultations.filter(c => c.nation_decision === 'unable_to_endorse').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {consultations
                    .filter(c => {
                      const status = calculateDecisionStatus(c.nation_decision, c.response_deadline);
                      return status === 'due_soon' || status === 'overdue';
                    })
                    .slice(0, 3)
                    .map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                        <div>
                          <p className="text-sm font-medium">{c.project_name}</p>
                          <p className="text-xs text-muted-foreground">{c.proponent_company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">
                            {c.response_deadline.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Consultations</CardTitle>
                  <CardDescription>
                    Manage and track all consultation requests
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
                userRole="nation_admin"
                onDecisionUpdate={handleDecisionUpdate}
                onAssignOfficer={handleAssignOfficer}
                onViewDetails={handleViewDetails}
                showBulkActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>
                Track consultation fees and payment status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Payment management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage Nation staff and consultation officers
                  </CardDescription>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Team management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}