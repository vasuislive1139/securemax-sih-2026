'use client';

import * as React from 'react';
import { Sidebar } from './Sidebar';
import { Menu, LogOut, Bell, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border shadow-2xl flex flex-col transition-transform">
            <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
               <div className="flex items-center">
                 <ShieldCheck className="h-6 w-6 text-primary mr-2" />
                 <span className="text-lg font-bold glow-cyan">SecureMesh</span>
               </div>
               <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                 <X className="h-5 w-5 text-muted-foreground" />
               </Button>
            </div>
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} isMobile />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar Inline for Simplicity & State Sharing */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-black/40 px-4 sm:px-6 backdrop-blur-xl">
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="mr-2 text-muted-foreground hover:text-primary">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
            {/* Mobile Title */}
            <span className="text-sm font-bold tracking-widest text-primary lg:hidden">SECUREMESH</span>
          </div>
          
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="hidden md:flex items-center space-x-6 text-xs font-mono font-medium">
              <div className="flex items-center text-cyan-400">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                CHAIN-1 ACTIVE
              </div>
              <div className="flex items-center text-primary">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                CHAIN-2 ACTIVE
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
                <span className="sr-only">Notifications</span>
              </Button>
              <div className="h-4 w-px bg-white/10 mx-1 sm:mx-2"></div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive text-xs sm:text-sm px-2 sm:px-3">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-background/50 relative">
          {/* Subtle radial gradient overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
