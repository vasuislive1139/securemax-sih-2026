'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield } from 'lucide-react';
import { TechnicalBriefing } from './TechnicalBriefing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function TechnicalBriefingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="glass-panel border-primary/50 mb-8 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Shield className="w-24 h-24 text-primary" />
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-mono text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> HOW SECUREMAX WORKS
          </CardTitle>
          <CardDescription className="text-zinc-300">
            Explore the security architecture, authorization flow, cryptographic controls and enforcement pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setIsOpen(true)}
            className="bg-primary/90 text-black hover:bg-primary font-bold shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all font-mono"
          >
            OPEN TECHNICAL EXPLORER
          </Button>
        </CardContent>
      </Card>
      
      {isOpen && <TechnicalBriefing onClose={() => setIsOpen(false)} />}
    </>
  );
}
