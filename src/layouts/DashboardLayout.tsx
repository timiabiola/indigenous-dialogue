import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  FileText,
  Users,
  DollarSign,
  Settings,
  BarChart3,
  Calendar,
  Bell,
  LogOut,
  User,
  ChevronLeft,
  Menu,
  Shield,
  Briefcase,
  Crown
} from 'lucide-react';

export type UserRole = 
  | 'nation_admin' 
  | 'consultation_officer' 
  | 'nation_leadership';

interface DashboardLayoutProps {
  userRole: UserRole;
  userName?: string;
  nationName?: string;
}

export function DashboardLayout({ 
  userRole = 'nation_admin', 
  userName = 'User',
  nationName = 'First Nation'
}: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        title: 'Dashboard',
        href: '/nation/dashboard',
        icon: Home,
        roles: ['nation_admin', 'consultation_officer', 'nation_leadership'],
      },
      {
        title: 'Consultations',
        href: '/nation/consultations',
        icon: FileText,
        roles: ['nation_admin', 'consultation_officer'],
      },
      {
        title: 'Calendar',
        href: '/nation/calendar',
        icon: Calendar,
        roles: ['nation_admin', 'consultation_officer', 'nation_leadership'],
      },
      {
        title: 'Reports',
        href: '/nation/reports',
        icon: BarChart3,
        roles: ['nation_admin', 'nation_leadership'],
      },
    ];

    const adminItems = [
      {
        title: 'Payments',
        href: '/nation/payments',
        icon: DollarSign,
        roles: ['nation_admin'],
      },
      {
        title: 'Team',
        href: '/nation/team',
        icon: Users,
        roles: ['nation_admin'],
      },
      {
        title: 'Settings',
        href: '/nation/settings',
        icon: Settings,
        roles: ['nation_admin'],
      },
    ];

    const allItems = [...baseItems, ...adminItems];
    return allItems.filter(item => item.roles.includes(userRole));
  };

  const navigationItems = getNavigationItems();

  const getRoleIcon = () => {
    switch (userRole) {
      case 'nation_admin':
        return <Shield className="h-4 w-4" />;
      case 'consultation_officer':
        return <Briefcase className="h-4 w-4" />;
      case 'nation_leadership':
        return <Crown className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'nation_admin':
        return 'Nation Admin';
      case 'consultation_officer':
        return 'Consultation Officer';
      case 'nation_leadership':
        return 'Leadership';
      default:
        return 'User';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r bg-background transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{nationName}</span>
              <span className="text-xs text-muted-foreground">Consultation Portal</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-secondary/50",
                    sidebarCollapsed && "justify-center"
                  )}
                  title={sidebarCollapsed ? item.title : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User Menu */}
        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex flex-col items-start text-xs">
                    <span className="font-medium">{userName}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      {getRoleIcon()}
                      {getRoleLabel()}
                    </span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              {userRole === 'nation_leadership' ? 'Executive Dashboard' : 
               userRole === 'consultation_officer' ? 'Officer Dashboard' : 
               'Admin Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}