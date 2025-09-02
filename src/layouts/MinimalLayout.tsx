import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, User, LogOut, Settings, FileText, BarChart3, Users, DollarSign, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MinimalLayoutProps {
  nationName?: string;
  userName?: string;
}

export function MinimalLayout({ 
  nationName = 'First Nation',
  userName = 'User'
}: MinimalLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const hiddenMenuItems = [
    { label: 'Calendar View', href: '/nation/calendar', icon: Calendar },
    { label: 'Full Dashboard', href: '/nation/full/admin', icon: BarChart3 },
    { label: 'Detailed Reports', href: '/nation/full/reports', icon: FileText },
    { label: 'Payment Management', href: '/nation/full/payments', icon: DollarSign },
    { label: 'Team Management', href: '/nation/full/team', icon: Users },
    { label: 'Settings', href: '/nation/full/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Nation Name */}
            <div className="flex items-center gap-4">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Advanced Options</SheetTitle>
                    <SheetDescription>
                      Access additional features and settings
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="mt-6 space-y-2">
                    {hiddenMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Icon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>

              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {nationName}
                </h1>
                <p className="text-xs text-gray-500">Consultation Management</p>
              </div>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center gap-4">
              {/* Hidden menu for desktop */}
              <div className="hidden lg:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <Menu className="h-4 w-4 mr-2" />
                      More Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Advanced Features</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {hiddenMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link to={item.href}>
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {userName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}