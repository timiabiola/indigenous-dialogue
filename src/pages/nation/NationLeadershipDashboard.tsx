import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ConsultationTable, ConsultationRequest } from '@/components/dashboard/ConsultationTable';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { calculateDecisionStatus } from '@/components/dashboard/StatusBadge';
import { 
  FileText, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Building2,
  TreePine,
  Mountain,
  Zap,
  Construction
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export function NationLeadershipDashboard() {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('quarter');

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
      // Add more historical data
      {
        id: '4',
        proponent_company: 'Wind Power Solutions',
        project_name: 'Wind Farm Development',
        project_type: 'utilities',
        consultation_level: 'level_2',
        status: 'on_track',
        priority: 'standard',
        response_deadline: new Date('2025-08-12'),
        nation_decision: 'conditional_endorsement',
        decision_date: new Date('2025-08-10'),
        assigned_officer_id: '101',
        consultation_fee: 7500,
        payment_status: 'paid',
        created_at: new Date('2025-07-26'),
      },
      {
        id: '5',
        proponent_company: 'TransCanada Infrastructure',
        project_name: 'Highway Expansion',
        project_type: 'infrastructure',
        consultation_level: 'level_1',
        status: 'on_track',
        priority: 'standard',
        response_deadline: new Date('2025-07-18'),
        nation_decision: 'endorse_no_concerns',
        decision_date: new Date('2025-07-15'),
        assigned_officer_id: '101',
        consultation_fee: 3500,
        payment_status: 'paid',
        created_at: new Date('2025-06-22'),
      },
    ];
    setConsultations(mockConsultations);
  }, []);

  // Calculate executive metrics
  const totalConsultations = consultations.length;
  const activeConsultations = consultations.filter(c => !c.nation_decision || c.nation_decision === 'pending').length;
  const completedConsultations = consultations.filter(c => c.nation_decision && c.nation_decision !== 'pending').length;
  const totalRevenue = consultations
    .filter(c => c.payment_status === 'paid')
    .reduce((sum, c) => sum + c.consultation_fee, 0);
  
  // Calculate decision distribution (excluding pending)
  const decisionDistribution = {
    endorsed: consultations.filter(c => c.nation_decision === 'endorse_no_concerns').length,
    conditional: consultations.filter(c => c.nation_decision === 'conditional_endorsement').length,
    unable: consultations.filter(c => c.nation_decision === 'unable_to_endorse').length,
    pending: consultations.filter(c => c.nation_decision === 'pending').length,
  };

  // Calculate project type distribution
  const projectTypes = {
    oil_gas: consultations.filter(c => c.project_type === 'oil_gas').length,
    mining: consultations.filter(c => c.project_type === 'mining').length,
    forestry: consultations.filter(c => c.project_type === 'forestry').length,
    infrastructure: consultations.filter(c => c.project_type === 'infrastructure').length,
    utilities: consultations.filter(c => c.project_type === 'utilities').length,
    other: consultations.filter(c => c.project_type === 'other').length,
  };

  // Get upcoming deadlines
  const upcomingDeadlines = consultations
    .filter(c => {
      const status = calculateDecisionStatus(c.nation_decision, c.response_deadline);
      return status === 'due_soon' || status === 'overdue';
    })
    .slice(0, 5);

  // Calculate monthly volume trend (mock data)
  const monthlyVolume = [
    { month: 'Jun', count: 8 },
    { month: 'Jul', count: 12 },
    { month: 'Aug', count: 15 },
    { month: 'Sep', count: 10 },
  ];

  const projectTypeIcons = {
    oil_gas: <Building2 className="h-4 w-4" />,
    mining: <Mountain className="h-4 w-4" />,
    forestry: <TreePine className="h-4 w-4" />,
    infrastructure: <Construction className="h-4 w-4" />,
    utilities: <Zap className="h-4 w-4" />,
    other: <Activity className="h-4 w-4" />,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground">
            Nation Leadership Overview - Read Only
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Consultations"
          value={activeConsultations}
          description="Currently in progress"
          icon={<FileText className="h-4 w-4" />}
          color="blue"
        />
        <DashboardCard
          title="Completed This Period"
          value={completedConsultations}
          description={`${Math.round((completedConsultations / totalConsultations) * 100)}% completion rate`}
          icon={<Activity className="h-4 w-4" />}
          color="green"
          change={15}
          trend="up"
        />
        <DashboardCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          description="Year to date"
          icon={<DollarSign className="h-4 w-4" />}
          color="green"
          change={28}
          trend="up"
        />
        <DashboardCard
          title="Avg Response Time"
          value="8.5 days"
          description="Down from 12 days"
          icon={<Calendar className="h-4 w-4" />}
          color="orange"
          change={29}
          trend="down"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Decision Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Decision Outcomes</CardTitle>
            <CardDescription>Distribution of decisions made</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Endorsed with No Concerns</span>
                  <span className="text-sm text-muted-foreground">
                    {decisionDistribution.endorsed} ({Math.round((decisionDistribution.endorsed / completedConsultations) * 100)}%)
                  </span>
                </div>
                <Progress value={(decisionDistribution.endorsed / completedConsultations) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Conditional Endorsement</span>
                  <span className="text-sm text-muted-foreground">
                    {decisionDistribution.conditional} ({Math.round((decisionDistribution.conditional / completedConsultations) * 100)}%)
                  </span>
                </div>
                <Progress value={(decisionDistribution.conditional / completedConsultations) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Unable to Endorse</span>
                  <span className="text-sm text-muted-foreground">
                    {decisionDistribution.unable} ({Math.round((decisionDistribution.unable / completedConsultations) * 100)}%)
                  </span>
                </div>
                <Progress value={(decisionDistribution.unable / completedConsultations) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Types */}
        <Card>
          <CardHeader>
            <CardTitle>Project Types</CardTitle>
            <CardDescription>Consultations by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(projectTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                  <div className="flex items-center gap-2">
                    {projectTypeIcons[type as keyof typeof projectTypeIcons]}
                    <span className="text-sm font-medium capitalize">
                      {type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-sm font-bold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation Volume Trend</CardTitle>
          <CardDescription>Monthly consultation requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end justify-around gap-2">
            {monthlyVolume.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary rounded-t" 
                     style={{ height: `${(month.count / 15) * 100}%` }}>
                </div>
                <span className="text-xs font-medium">{month.count}</span>
                <span className="text-xs text-muted-foreground">{month.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Consultations requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((c) => {
                  const daysLeft = Math.ceil(
                    (c.response_deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="text-sm font-medium">{c.project_name}</p>
                        <p className="text-xs text-muted-foreground">{c.proponent_company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(c.response_deadline, 'MMM dd')}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No urgent deadlines
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Active Companies</CardTitle>
            <CardDescription>Most frequent consultation requesters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(consultations.map(c => c.proponent_company)))
                .map(company => ({
                  name: company,
                  count: consultations.filter(c => c.proponent_company === company).length
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((company) => (
                  <div key={company.name} className="flex items-center justify-between">
                    <span className="text-sm">{company.name}</span>
                    <span className="text-sm font-bold">{company.count} requests</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Overview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Consultations</CardTitle>
          <CardDescription>
            Overview of recent consultation activity (Read-only view)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConsultationTable
            consultations={consultations.slice(0, 10)}
            userRole="nation_leadership"
            showBulkActions={false}
          />
        </CardContent>
      </Card>

      {/* Historical Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">3-Year Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Consultations</span>
                <span className="font-medium">347</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-medium">$1.2M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Response Time</span>
                <span className="font-medium">10.2 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">On-time Rate</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Endorsement Rate</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Efficiency Score</span>
                <span className="font-medium">8.7/10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Officers</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg per Officer</span>
                <span className="font-medium">12/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Utilization</span>
                <span className="font-medium">87%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}