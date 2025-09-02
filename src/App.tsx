import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { MinimalLayout } from "./layouts/MinimalLayout";
import { SimplifiedNationDashboard } from "./pages/nation/SimplifiedNationDashboard";
import { ConsultationCalendarPage } from "./pages/nation/ConsultationCalendar";
import { NationAdminDashboard } from "./pages/nation/NationAdminDashboard";
import { ConsultationOfficerDashboard } from "./pages/nation/ConsultationOfficerDashboard";
import { NationLeadershipDashboard } from "./pages/nation/NationLeadershipDashboard";
import { NationDashboardDemo } from "./pages/NationDashboardDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/nation-demo" element={<NationDashboardDemo />} />
          
          {/* SIMPLIFIED NATION DASHBOARD - DEFAULT */}
          <Route path="/nation" element={<MinimalLayout nationName="Sample Nation" userName="Nation User" />}>
            <Route index element={<SimplifiedNationDashboard />} />
            <Route path="dashboard" element={<SimplifiedNationDashboard />} />
            <Route path="calendar" element={<ConsultationCalendarPage />} />
          </Route>
          
          {/* FULL FEATURE DASHBOARDS - Hidden under /nation/full */}
          {/* Nation Admin Routes */}
          <Route path="/nation/full" element={<DashboardLayout userRole="nation_admin" userName="Admin User" nationName="Sample Nation" />}>
            <Route path="admin" element={<NationAdminDashboard />} />
            <Route path="admin/consultations" element={<NationAdminDashboard />} />
          </Route>
          
          {/* Consultation Officer Routes */}
          <Route path="/nation/full" element={<DashboardLayout userRole="consultation_officer" userName="Sarah Johnson" nationName="Sample Nation" />}>
            <Route path="officer" element={<ConsultationOfficerDashboard />} />
          </Route>
          
          {/* Nation Leadership Routes */}
          <Route path="/nation/full" element={<DashboardLayout userRole="nation_leadership" userName="Chief Williams" nationName="Sample Nation" />}>
            <Route path="leadership" element={<NationLeadershipDashboard />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
