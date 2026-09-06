'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Activity, HardDrive, Key, List, LayoutDashboard, ShieldCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

// Mock hook for now until auth state is wired up
const useUser = () => ({ role: UserRole.ADMIN });

const navItems = [
  { name: 'SOC Dashboard', href: '/dashboard/soc', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.SECURITY_ANALYST] },
  { name: 'Sentinel Lab', href: '/security/sentinel', icon: Activity, roles: [UserRole.ADMIN, UserRole.SECURITY_ANALYST] },
  { name: 'Incident Center', href: '/security/incidents', icon: ShieldCheck, roles: [UserRole.ADMIN, UserRole.SECURITY_ANALYST] },
  { name: 'Audit Log', href: '/audit', icon: List, roles: [UserRole.ADMIN, UserRole.AUDITOR, UserRole.SECURITY_ANALYST] },
  { name: 'Digital Assets', href: '/assets', icon: HardDrive, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ENGINEER] },
  { name: 'Access Requests', href: '/access', icon: Key, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ENGINEER] },
];

interface SidebarProps {
  onNavigate?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ onNavigate, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useUser();

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className={cn("flex h-full flex-col bg-card/50 backdrop-blur-xl border-r border-white/5", !isMobile && "w-64")}>
      {!isMobile && (
        <div className="flex h-16 items-center px-6 border-b border-white/5">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <span className="text-lg font-bold tracking-widest text-foreground">SECURE<span className="text-primary">MESH</span></span>
        </div>
      )}
      
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="mb-4 px-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
          Command Center
        </div>
        <nav className="space-y-1">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'group flex items-center rounded-sm px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[inset_4px_0_0_0_hsl(var(--primary))]'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-4 w-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center space-x-3 rounded-md bg-white/5 p-3 tech-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary/20 text-primary border border-primary/30">
            {role.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">System Admin</span>
            <span className="text-[10px] text-primary font-mono tracking-wider">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
