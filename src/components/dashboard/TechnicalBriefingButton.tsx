'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { TechnicalBriefing } from './TechnicalBriefing';

export function TechnicalBriefingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="bg-primary/10 text-primary border-primary/50 hover:bg-primary/20 hover:text-primary transition-all shadow-[0_0_15px_rgba(0,255,255,0.15)]"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        HOW SECUREMAX WORKS
      </Button>
      {isOpen && <TechnicalBriefing onClose={() => setIsOpen(false)} />}
    </>
  );
}
