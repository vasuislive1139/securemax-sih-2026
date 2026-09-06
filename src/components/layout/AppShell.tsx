'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Activity, HardDrive, Key, List, LayoutDashboard, ShieldCheck, LogOut, Hexagon } from 'lucide-react';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'SOC', href: '/dashboard/soc', roles: [UserRole.ADMIN, UserRole.SECURITY_ANALYST] },
  { name: 'SENTINEL', href: '/security/sentinel', roles: [UserRole.ADMIN, UserRole.SECURITY_ANALYST] },
  { name: 'INCIDENTS', href: '/security/incidents', roles: [UserRole.ADMIN, UserRole.SECURITY_ANALYST] },
  { name: 'AUDIT', href: '/audit', roles: [UserRole.ADMIN, UserRole.AUDITOR, UserRole.SECURITY_ANALYST] },
  { name: 'ASSETS', href: '/assets', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ENGINEER] },
  { name: 'INFRASTRUCTURE', href: '/infrastructure', roles: [UserRole.ADMIN] },
  { name: 'ADMIN', href: '/dashboard/admin', roles: [UserRole.ADMIN] },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = React.useState<UserRole>(UserRole.ENGINEER);

  React.useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data?.session?.role) {
          setRole(data.session.role);
        }
      })
      .catch(console.error);
  }, []);

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-[#0a0a0c] px-6">
        
        {/* LEFT: Logo & Env */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Hexagon className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="text-lg font-bold tracking-widest text-zinc-100">SECURE<span className="text-cyan-400">MAX</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-2 border-l border-zinc-800 pl-6 text-[10px] font-mono tracking-widest text-zinc-400">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
            SECURITY OPERATIONS
          </div>
        </div>
        
        {/* CENTER: Navigation */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 px-6">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-4 py-1.5 text-xs font-mono tracking-widest transition-colors rounded-sm',
                  isActive 
                    ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Status & Logout */}
        <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-zinc-500">NETWORK</span>
            <span className="text-cyan-400">SEPOLIA</span>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-zinc-500">SESSION</span>
            <span className="text-emerald-400">{role}</span>
          </div>
          <div className="h-6 w-px bg-zinc-800"></div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 text-[10px] font-mono tracking-widest h-8 px-3">
              <LogOut className="h-3.5 w-3.5 mr-2" />
              DISCONNECT
            </Button>
          </Link>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 bg-zinc-950 relative">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-transparent to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
