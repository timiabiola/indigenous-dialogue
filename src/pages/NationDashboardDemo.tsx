import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Briefcase, 
  Crown, 
  ArrowRight, 
  Users, 
  FileText, 
  DollarSign,
  CheckCircle
} from 'lucide-react';

export function NationDashboardDemo() {
  const dashboards = [
    {
      role: 'Simplified Dashboard',
      path: '/nation',
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Simple, focused view for quick decision making',
      features: [
        'All active consultations in one view',
        'Inline decision making',
        'Visual urgency indicators',
        'Minimal interface',
        'Hidden advanced features',
        'Mobile-friendly design'
      ],
      user: 'Nation User',
      badge: 'Recommended'
    },
    {
      role: 'Nation Admin (Full)',
      path: '/nation/full/admin',
      icon: Shield,
      color: 'bg-blue-500',
      description: 'Full CRM access with complete consultation management',
      features: [
        'Manage all consultations',
        'Make decisions on requests',
        'Assign officers to consultations',
        'Track payments and revenue',
        'Manage team members',
        'Configure Nation settings'
      ],
      user: 'Admin User',
      badge: 'Full Access'
    },
    {
      role: 'Consultation Officer',
      path: '/nation/full/officer',
      icon: Briefcase,
      color: 'bg-purple-500',
      description: 'Manage assigned consultations and make decisions',
      features: [
        'View assigned consultations',
        'Update decision status',
        'Track deadlines',
        'Communicate with companies',
        'Upload documents',
        'View personal metrics'
      ],
      user: 'Sarah Johnson',
      badge: 'Limited Access'
    },
    {
      role: 'Nation Leadership',
      path: '/nation/full/leadership',
      icon: Crown,
      color: 'bg-indigo-500',
      description: 'Executive overview with read-only analytics',
      features: [
        'View executive summary',
        'Monitor key metrics',
        'Track decision outcomes',
        'Review historical data',
        'Access revenue reports',
        'View team performance'
      ],
      user: 'Chief Williams',
      badge: 'Read Only'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Indigenous Consultation Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nation Users Dashboard Demo - Choose a role to explore the dashboard features
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Decisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Month Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$28,500</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            return (
              <Card key={dashboard.path} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-3 rounded-lg ${dashboard.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline">{dashboard.badge}</Badge>
                  </div>
                  <CardTitle>{dashboard.role}</CardTitle>
                  <CardDescription>{dashboard.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-muted-foreground">Key Features:</p>
                    <ul className="space-y-1">
                      {dashboard.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-3">
                      Demo User: <span className="font-medium">{dashboard.user}</span>
                    </p>
                    <Link to={dashboard.path}>
                      <Button className="w-full">
                        View Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
            <CardDescription>
              Comprehensive consultation management with role-based access control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Consultation CRM</h3>
                  <p className="text-sm text-muted-foreground">
                    Track and manage all consultation requests with automated status updates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Team Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Assign officers, manage roles, and track team performance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Revenue Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor consultation fees, payment status, and revenue analytics
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicator Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
            <CardDescription>
              Visual indicators used throughout the dashboards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🟢</span>
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-xs text-muted-foreground">Decision made</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🟡</span>
                <div>
                  <p className="text-sm font-medium">Due Soon</p>
                  <p className="text-xs text-muted-foreground">7 days or less</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔴</span>
                <div>
                  <p className="text-sm font-medium">Overdue</p>
                  <p className="text-xs text-muted-foreground">Past deadline</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🟠</span>
                <div>
                  <p className="text-sm font-medium">Action Needed</p>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}