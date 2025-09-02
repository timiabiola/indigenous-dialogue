# claude.md

## Project Overview
Indigenous Consultation Management Web Application - A comprehensive platform for managing consultation processes between First Nations, industry proponents, government stakeholders, and management companies.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons
- **Backend**: Supabase (PostgreSQL, Auth, Real-time subscriptions)
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Deployment**: Vercel

## User Roles & Permissions

### Role Hierarchy
```typescript
type UserRole = 
  | 'management_admin'      // Tatâga Inc. - Full system access
  | 'management_overview'   // Tatâga Inc. - Read-only analytics
  | 'nation_admin'         // First Nation - Full CRM access
  | 'consultation_officer' // First Nation - Assigned consultations
  | 'nation_leadership'    // Chief/Council - Read-only dashboard
  | 'government_observer'  // Government - Public transparency
  | 'stakeholder_view'     // Industry oversight - No financial data
  | 'company_user'         // Proponent - Submit/track requests
```

### Access Control Matrix
```typescript
const rolePermissions = {
  management_admin: ['read_all', 'write_all', 'manage_users', 'system_config'],
  management_overview: ['read_all_analytics', 'export_reports'],
  nation_admin: ['read_nation_data', 'write_nation_data', 'manage_nation_users'],
  consultation_officer: ['read_assigned', 'write_assigned', 'update_decisions'],
  nation_leadership: ['read_nation_summary', 'read_historical'],
  government_observer: ['read_public_metrics', 'read_decision_analytics'],
  stakeholder_view: ['read_public_metrics', 'read_company_data'],
  company_user: ['read_own_requests', 'submit_requests']
}
```

## Database Schema

### Core Tables
```sql
-- Nations
CREATE TABLE nations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  consultation_email TEXT, -- nakahâskwân email
  fee_structure JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nation_id UUID REFERENCES nations(id),
  role TEXT NOT NULL CHECK (role IN (
    'management_admin', 'management_overview', 'nation_admin', 
    'consultation_officer', 'nation_leadership', 'government_observer',
    'stakeholder_view', 'company_user'
  )),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT, -- For government/stakeholder users
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT CHECK (industry IN (
    'oil_gas', 'mining', 'forestry', 'infrastructure', 'utilities', 'other'
  )),
  contact_email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  standing TEXT DEFAULT 'good_standing' CHECK (standing IN (
    'good_standing', 'needs_attention'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation Requests
CREATE TABLE consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nation_id UUID NOT NULL REFERENCES nations(id),
  company_id UUID REFERENCES companies(id),
  proponent_company TEXT NOT NULL,
  contact_person TEXT,
  contact_email TEXT NOT NULL,
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN (
    'oil_gas', 'mining', 'forestry', 'infrastructure', 'utilities', 'other'
  )),
  project_location TEXT,
  consultation_level TEXT DEFAULT 'level_1' CHECK (consultation_level IN (
    'level_1', 'level_2', 'level_3'
  )),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'action_needed', 'on_track'
  )),
  priority TEXT DEFAULT 'standard' CHECK (priority IN (
    'critical', 'standard'
  )),
  response_deadline DATE NOT NULL,
  auto_response_sent BOOLEAN DEFAULT false,
  payment_status TEXT DEFAULT 'not_required' CHECK (payment_status IN (
    'not_required', 'pending', 'paid', 'overdue'
  )),
  consultation_fee DECIMAL(10,2),
  payment_date DATE,
  assigned_officer_id UUID REFERENCES user_profiles(id),
  nation_decision TEXT CHECK (nation_decision IN (
    'endorse_no_concerns', 'conditional_endorsement', 'unable_to_endorse'
  )),
  decision_date TIMESTAMP WITH TIME ZONE,
  decision_notes TEXT,
  final_outcome TEXT CHECK (final_outcome IN (
    'approved', 'approved_with_conditions', 'requires_more_info', 'rejected', 'withdrawn'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add computed column for decision status
ALTER TABLE consultation_requests 
ADD COLUMN decision_status TEXT GENERATED ALWAYS AS (
  CASE 
    WHEN nation_decision IS NOT NULL THEN 'completed'
    WHEN response_deadline - CURRENT_DATE <= 1 THEN 'overdue'
    WHEN response_deadline - CURRENT_DATE <= 7 THEN 'due_soon'
    ELSE 'pending'
  END
) STORED;

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultation_requests(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communications
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultation_requests(id),
  sender_id UUID REFERENCES user_profiles(id),
  recipient_email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  communication_type TEXT DEFAULT 'email' CHECK (communication_type IN (
    'email', 'note', 'auto_response', 'reminder'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Views for Analytics
```sql
-- Decision Analytics (for government dashboard)
CREATE VIEW decision_analytics AS
SELECT 
  n.name as nation_name,
  COUNT(*) as total_consultations,
  COUNT(CASE WHEN cr.nation_decision = 'endorse_no_concerns' THEN 1 END) as endorsed,
  COUNT(CASE WHEN cr.nation_decision = 'conditional_endorsement' THEN 1 END) as conditional,
  COUNT(CASE WHEN cr.nation_decision = 'unable_to_endorse' THEN 1 END) as unable_to_endorse,
  AVG(EXTRACT(days FROM (cr.decision_date - cr.created_at))) as avg_response_days,
  COUNT(CASE WHEN cr.decision_status = 'completed' THEN 1 END) as completed_on_time
FROM consultation_requests cr
JOIN nations n ON cr.nation_id = n.id
WHERE cr.nation_decision IS NOT NULL
GROUP BY n.id, n.name;

-- Company Activity Summary
CREATE VIEW company_activity AS
SELECT 
  c.name as company_name,
  c.industry,
  COUNT(cr.id) as total_requests,
  COUNT(CASE WHEN cr.nation_decision = 'endorse_no_concerns' THEN 1 END) as endorsed_count,
  AVG(EXTRACT(days FROM (cr.decision_date - cr.created_at))) as avg_response_time
FROM companies c
LEFT JOIN consultation_requests cr ON c.id = cr.company_id
GROUP BY c.id, c.name, c.industry;
```

### Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE nations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Nations access policy
CREATE POLICY "Nations access" ON nations FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM user_profiles WHERE 
    role IN ('management_admin', 'management_overview') OR
    (role IN ('nation_admin', 'consultation_officer', 'nation_leadership') AND nation_id = nations.id)
  )
);

-- Consultation requests access policy
CREATE POLICY "Consultation requests access" ON consultation_requests FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM user_profiles WHERE 
    role IN ('management_admin', 'management_overview', 'government_observer', 'stakeholder_view') OR
    (role IN ('nation_admin', 'consultation_officer', 'nation_leadership') AND nation_id = consultation_requests.nation_id) OR
    (role = 'consultation_officer' AND id = consultation_requests.assigned_officer_id)
  )
);
```

## Component Architecture

### Layout Structure
```
app/
├── (auth)/
│   ├── login/
│   └── register/
├── (dashboard)/
│   ├── management/
│   │   ├── admin/
│   │   └── overview/
│   ├── nation/
│   │   ├── admin/
│   │   ├── officer/
│   │   └── leadership/
│   ├── government/
│   └── company/
├── api/
└── globals.css
```

### Key Components
```typescript
// Dashboard Cards
interface DashboardCard {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  color: 'green' | 'orange' | 'red' | 'blue';
}

// Consultation Table
interface ConsultationTableProps {
  consultations: ConsultationRequest[];
  userRole: UserRole;
  onDecisionUpdate?: (id: string, decision: NationDecision) => void;
  onAssignOfficer?: (id: string, officerId: string) => void;
}

// Decision Status Badge
interface DecisionStatusBadgeProps {
  status: 'completed' | 'due_soon' | 'overdue' | 'pending';
  deadline: Date;
}

// Nation Decision Dropdown
interface NationDecisionDropdownProps {
  value: NationDecision | null;
  onChange: (decision: NationDecision) => void;
  disabled?: boolean;
}
```

## Color System & Status Indicators

### Two-Color System Implementation
```typescript
const statusColors = {
  // Primary status indicators
  action_needed: 'orange',  // 🟠 Response due ≤7 days
  on_track: 'green',       // 🟢 Timeline good
  
  // Priority indicators  
  critical: 'red',         // 🔴 Response due ≤1 day
  standard: 'orange',      // 🟠 Normal timeline
  
  // Decision status
  completed: 'green',      // 🟢 Decision made
  due_soon: 'yellow',      // 🟡 Due in 7 days
  overdue: 'red',         // 🔴 Past deadline
  pending: 'gray',        // ⚪ No decision yet
  
  // Company standing
  good_standing: 'green',  // 🟢 Compliant
  needs_attention: 'orange' // 🟠 Issues
} as const;
```

### Tailwind Classes
```typescript
const statusClasses = {
  green: 'bg-green-100 text-green-800 border-green-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200', 
  red: 'bg-red-100 text-red-800 border-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200'
} as const;
```

## API Routes Structure

### Authentication & Authorization
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient({ req: request });
  
  // Refresh session if expired
  await supabase.auth.getSession();
  
  // Role-based route protection
  const userRole = await getUserRole(supabase);
  const protectedRoutes = getProtectedRoutes(request.nextUrl.pathname);
  
  if (!hasAccess(userRole, protectedRoutes)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return response;
}
```

### API Endpoints
```typescript
// app/api/consultations/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = {
    nation_id: searchParams.get('nation_id'),
    status: searchParams.get('status'),
    priority: searchParams.get('priority'),
    assigned_officer: searchParams.get('officer')
  };
  
  // Apply role-based filtering
  const consultations = await getConsultations(filters, userRole);
  return NextResponse.json(consultations);
}

// app/api/consultations/[id]/decision/route.ts
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { nation_decision, decision_notes } = await request.json();
  
  const updated = await updateConsultationDecision(params.id, {
    nation_decision,
    decision_notes,
    decision_date: new Date()
  });
  
  return NextResponse.json(updated);
}
```

## Real-time Features

### Supabase Subscriptions
```typescript
// hooks/useRealtimeConsultations.ts
export function useRealtimeConsultations(nationId?: string) {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  
  useEffect(() => {
    const channel = supabase
      .channel('consultation_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'consultation_requests',
          filter: nationId ? `nation_id=eq.${nationId}` : undefined
        }, 
        (payload) => {
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  }, [nationId]);
  
  return consultations;
}
```

## Government Dashboard Specifications

### Public Metrics (No Financial Data)
```typescript
interface GovernmentDashboardData {
  consultationMetrics: {
    totalActive: number;
    averageResponseTime: number;
    complianceRate: number;
    monthlyVolume: number[];
  };
  decisionBreakdown: {
    endorsed: number;
    conditional: number;
    unableToEndorse: number;
  };
  companyActivity: {
    topCompanies: Array<{
      name: string;
      consultationCount: number;
      industry: string;
    }>;
    industryDistribution: Record<string, number>;
  };
  timelinePerformance: {
    onTimeDecisions: number;
    averageDaysToDecision: number;
    peakConsultationPeriods: string[];
  };
}
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Implement proper error boundaries
- Follow Next.js App Router conventions
- Use server components where possible
- Implement proper loading states

### Security Considerations
- All database queries use RLS
- Sensitive data (financial) filtered by role
- File uploads scanned and validated
- Audit logging for all critical actions
- Rate limiting on API endpoints

### Performance Optimization
- Use React Server Components for static content
- Implement proper caching strategies
- Optimize database queries with proper indexes
- Use Supabase Edge Functions for heavy computations
- Implement pagination for large datasets

### Testing Strategy
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user flows
- Role-based access testing
- Performance testing for dashboard loads

This documentation provides the foundation for building a comprehensive Indigenous consultation management system with proper role-based access, real-time updates, and government transparency features.