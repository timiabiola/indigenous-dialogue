# Product Requirement Document (PRD)
## Indigenous Consultation Management Web Application

### **Project Overview**
A Next.js web application for managing Indigenous consultation processes between First Nations and industry proponents, featuring role-based dashboards and automated workflow management.

### **Tech Stack**
- **Frontend**: Next.js 14, Tailwind CSS, shadcn/ui components, Lucide React icons
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Authentication**: Supabase Auth with role-based access control
- **Deployment**: Vercel

---

## **User Roles & Access Levels**

### **1. Management Company (Tatâga Inc.)**
- **Admin Role**: Full system oversight and configuration
- **Overview Role**: Read-only analytics and reporting across all Nations

### **2. First Nations**
- **Nation Admin**: Full CRM access for their Nation's consultations
- **Consultation Officer**: Manage assigned consultations
- **Leadership (Chief/Council)**: Read-only dashboard view

### **3. Government & Stakeholders**
- **Government Observer**: Public transparency dashboard with consultation metrics
- **Stakeholder View**: Industry and regulatory oversight without financial data

### **4. Industry Proponents**
- **Company User**: Submit consultation requests and track status

---

## **Core Features by Role**

### **Management Company Dashboard**

#### **Admin View**
- **System Overview**
  - Total Nations onboarded
  - Total consultations processed
  - Revenue generated across all Nations
  - System health metrics
- **Nation Management**
  - Add/remove Nations
  - Configure Nation settings
  - Manage user accounts
- **Analytics & Reporting**
  - Cross-Nation consultation trends
  - Revenue analytics
  - Performance metrics
  - Export capabilities

#### **Overview Role**
- Read-only version of admin analytics
- Nation performance comparisons
- System-wide reporting

### **Government & Stakeholder Dashboard**

#### **Public Transparency View**
- **Consultation Timeline Metrics**
  - Average response times by Nation
  - Response time trends over time
  - Deadline compliance rates
  - Processing efficiency metrics
- **Decision Analytics**
  - Total decisions by type:
    - Endorse with no concerns
    - Conditional Endorsement
    - Unable to Endorse
  - Decision distribution charts
  - Outcome trends by project type
- **Company Activity Overview**
  - Most active companies by consultation volume
  - Company compliance ratings (response to Nation feedback)
  - Industry breakdown of consultation requests
- **Recent Activity Summary**
  - Latest consultation decisions (last 30 days)
  - Upcoming deadline summary
  - System activity trends
- **Performance Metrics**
  - Average days to decision
  - Peak consultation periods
  - Geographic distribution of projects
  - Consultation level distribution (Level 1, 2, 3)

**Note**: No financial data, payment information, or revenue metrics visible to this role.

### **First Nations Dashboard**

#### **Nation Admin View**
- **Consultation CRM**
  - View all incoming consultation requests
  - Response deadline tracking with visual indicators
  - **Nation's Decision** column with dropdown:
    - Endorse with no concerns
    - Conditional Endorsement
    - Unable to Endorse
  - **Decision Status** (auto-calculated field):
    - 🟢 **Completed** (Green) - Decision made
    - 🟡 **Due Soon** (Yellow) - Due in next 7 days
    - 🔴 **Overdue** (Red) - Due in 1 day or overdue
  - Assign consultations to officers
  - Bulk actions for decision making
- **Payment Management**
  - Track consultation fees
  - Payment status monitoring
  - Revenue reporting for their Nation
- **User Management**
  - Manage Nation staff accounts
  - Set access permissions
- **Settings**
  - Configure auto-response templates
  - Set consultation fee structures
  - Update Nation contact information

#### **Consultation Officer View**
- **My Consultations**
  - Assigned consultation requests
  - **Decision Status** indicators (🟢🟡🔴)
  - **Nation's Decision** dropdown for quick updates
  - Deadline countdown timers
  - Document upload/management
- **Response Management**
  - Draft and send responses
  - Track communication history
  - Set follow-up reminders

#### **Leadership View (Chief/Council)**
- **Executive Dashboard**
  - Current active consultations summary
  - **Decision Status** overview with color indicators
  - Upcoming deadlines (next 7 days)
  - Monthly consultation volume
  - Revenue summary
- **Historical Overview**
  - Past 3 years of consultation data
  - Decision outcome trends
  - Company interaction history

### **Industry Proponent Portal**
- **Submit Consultation Request**
  - Project details form
  - Document upload
  - Payment processing
- **Track Requests**
  - Status updates including Nation's Decision
  - Response timeline
  - Communication history

---

## **Key Features & Functionality**

### **1. Dashboard Components**
- **Status Cards**: Critical (🔴), Action Needed (🟡), Completed (🟢)
- **Decision Status Indicators**: Auto-calculated visual cues
- **Calendar View**: Deadline visualization with color coding
- **Quick Stats**: KPI cards with real-time data
- **Recent Activity**: Timeline of latest actions
- **Notification Center**: System alerts and reminders

### **2. Enhanced Consultation Management**
- **Request Intake**: Automated logging and acknowledgment
- **Decision Tracking**: Nation's Decision dropdown with three options
- **Decision Status**: Auto-calculated field based on deadline proximity:
  ```javascript
  // Decision Status Logic
  if (nationDecision !== null) return "🟢 Completed"
  if (daysUntilDeadline <= 1) return "🔴 Overdue"
  if (daysUntilDeadline <= 7) return "🟡 Due Soon"
  return "⚪ Pending"
  ```
- **Bulk Actions**: Select multiple requests for batch decision making
- **Document Management**: Secure file upload and storage
- **Communication Log**: Complete audit trail of all interactions

### **3. Government/Stakeholder Analytics**
- **Timeline Performance**
  - Average response time by Nation
  - Seasonal consultation patterns
  - Deadline compliance rates
- **Decision Breakdown**
  - Pie charts of decision types
  - Trends over time
  - Success rates by project type
- **Company Insights**
  - Top consulting companies by volume
  - Industry distribution
  - Compliance tracking
- **System Health**
  - Processing efficiency
  - Peak usage periods
  - Geographic heat maps

### **4. Automation Features**
- **Auto-Response**: Immediate acknowledgment emails
- **Decision Status Updates**: Real-time calculation based on deadlines
- **Deadline Alerts**: 7-day (yellow) and 1-day (red) notifications
- **Decision Notifications**: Alerts when decisions are made
- **Status Updates**: Real-time notifications to relevant users

---

## **Database Schema Updates (Supabase)**

### **Enhanced Tables**
```sql
-- Consultation Requests (Updated)
consultation_requests (
  id, nation_id, proponent_company, contact_email, project_name,
  project_type, status, priority, response_deadline, payment_status,
  consultation_fee, assigned_officer_id, 
  -- New fields
  nation_decision, -- 'endorse_no_concerns' | 'conditional_endorsement' | 'unable_to_endorse' | null
  decision_date, -- timestamp when decision was made
  decision_status, -- computed field: 'completed' | 'due_soon' | 'overdue' | 'pending'
  final_outcome, created_at, updated_at
)

-- Government Users (New table)
government_users (
  id, organization, role, full_name, email, 
  access_level, -- 'observer' | 'stakeholder'
  active, created_at
)

-- Decision Analytics View (Database View)
CREATE VIEW decision_analytics AS
SELECT 
  nation_id,
  COUNT(*) as total_consultations,
  COUNT(CASE WHEN nation_decision = 'endorse_no_concerns' THEN 1 END) as endorsed,
  COUNT(CASE WHEN nation_decision = 'conditional_endorsement' THEN 1 END) as conditional,
  COUNT(CASE WHEN nation_decision = 'unable_to_endorse' THEN 1 END) as unable_to_endorse,
  AVG(EXTRACT(days FROM (decision_date - created_at))) as avg_response_days
FROM consultation_requests 
WHERE nation_decision IS NOT NULL
GROUP BY nation_id;
```

### **Row Level Security (RLS) Updates**
- Government/Stakeholder users can read consultation data but no financial information
- Decision status automatically calculated via database functions
- Real-time subscriptions for decision status changes

---

## **UI/UX Requirements Updates**

### **New Components**
- **Decision Status Badge**: Color-coded indicator (🟢🟡🔴)
- **Nation's Decision Dropdown**: Three-option selector with clear labels
- **Government Dashboard**: Public-facing analytics without financial data
- **Decision Timeline**: Visual representation of decision-making process

### **Enhanced Navigation Structure**
```
Government/Stakeholder:
├── Public Dashboard
├── Consultation Metrics
├── Decision Analytics
├── Company Overview
├── Timeline Performance
└── Recent Activity

First Nations (Updated):
├── Dashboard
├── Consultations (with Decision Status column)
├── Decision Management
├── Calendar
├── Reports
├── Settings
└── Team Management
```

---

## **Updated User Stories**

### **Government Observer**
- "As a government observer, I want to see consultation response times across all Nations so I can assess system efficiency"
- "As a government observer, I want to view decision outcomes without seeing financial details so I can maintain transparency while respecting commercial privacy"
- "As a government observer, I want to track which companies are most active so I can understand industry engagement patterns"

### **Nation Admin (Updated)**
- "As a Nation admin, I want to see decision status indicators so I can quickly identify which consultations need immediate attention"
- "As a Nation admin, I want to make decisions using a simple dropdown so the process is standardized and trackable"
- "As a Nation admin, I want the system to automatically show me overdue decisions so nothing falls through the cracks"

### **Consultation Officer (Updated)**
- "As a consultation officer, I want to update the Nation's decision directly from my consultation list so I can work efficiently"
- "As a consultation officer, I want to see color-coded decision status so I can prioritize my workload visually"

---

## **Success Metrics (Updated)**
- **Decision Timeliness**: 90% of decisions made within deadline
- **Government Transparency**: Public dashboard accessed by 50+ stakeholders monthly
- **Decision Quality**: Clear categorization of all consultation outcomes
- **System Efficiency**: Average decision time reduced by 35%
- **Stakeholder Engagement**: Government users actively monitoring system metrics

---

## **Development Phases (Updated)**

### **Phase 1: MVP (8 weeks)**
- User authentication with government role
- Basic consultation CRM with decision status
- Nation's Decision dropdown functionality
- Management company overview dashboard

### **Phase 2: Enhanced Features (6 weeks)**
- Government/Stakeholder public dashboard
- Decision analytics and reporting
- Auto-calculated decision status indicators
- Advanced filtering and search

### **Phase 3: Analytics & Optimization (4 weeks)**
- Comprehensive public reporting
- Performance analytics for government users
- Export functionality (non-financial data)
- Mobile optimization

### **Phase 4: Advanced Features (6 weeks)**
- Real-time decision tracking
- Advanced government analytics
- Integration capabilities
- Enhanced transparency features