'use client';

import React, { useEffect, useState } from 'react';
import { useDemoStore } from '@/stores/useDemoStore';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';

export function PresentationMode() {
  const { 
    presentationModeActive, 
    setPresentationMode, 
    presentationStage, 
    setPresentationStage,
    startSimulation,
    advanceAttackPath,
    createIncident,
    resolveIncident,
    resetDemo
  } = useDemoStore();

  const togglePresentation = () => {
    if (presentationModeActive) {
      resetDemo();
    } else {
      setPresentationMode(true);
    }
  };

  useEffect(() => {
    if (!presentationModeActive) return;

    let timeout: NodeJS.Timeout;

    switch (presentationStage) {
      case 0: // Start Normal
        timeout = setTimeout(() => setPresentationStage(1), 5000); // 5s in normal
        break;
      case 1: // Start Simulation
        startSimulation({
          type: 'token_replay',
          name: 'Token Replay Attempt',
          severity: 'HIGH',
          description: 'A previously valid token was captured and replayed from a different IP and session context.',
          blockedAt: 'DOMAIN2'
        });
        timeout = setTimeout(() => setPresentationStage(2), 2000);
        break;
      case 2: // Advance to Session
        advanceAttackPath('SESSION');
        timeout = setTimeout(() => setPresentationStage(3), 2000);
        break;
      case 3: // Advance to RBAC
        advanceAttackPath('RBAC');
        timeout = setTimeout(() => setPresentationStage(4), 2000);
        break;
      case 4: // Advance to Domain 1
        advanceAttackPath('DOMAIN1');
        timeout = setTimeout(() => setPresentationStage(5), 2000);
        break;
      case 5: // Advance to Domain 2 (Blocked)
        advanceAttackPath('DOMAIN2');
        timeout = setTimeout(() => setPresentationStage(6), 2000);
        break;
      case 6: // Blocked!
        advanceAttackPath('BLOCKED');
        timeout = setTimeout(() => setPresentationStage(7), 3000);
        break;
      case 7: // Incident created
        createIncident({
          threatId: 'demo-threat',
          title: 'Simulated Token Replay Blocked',
          severity: 'HIGH',
          status: 'OPEN',
          detectionLayer: 'Sentinel Engine',
          blockedLayer: 'Domain 2: Key Policy',
          affectedAsset: 'BEL-AVI-003',
          source: 'SANDBOX SIMULATION'
        });
        timeout = setTimeout(() => setPresentationStage(8), 5000);
        break;
      case 8: // Recovery
        const state = useDemoStore.getState();
        if (state.incidents.length > 0) {
          resolveIncident(state.incidents[0].id);
        }
        timeout = setTimeout(() => setPresentationStage(9), 4000);
        break;
      case 9:
        setPresentationMode(false);
        break;
    }

    return () => clearTimeout(timeout);
  }, [presentationModeActive, presentationStage, startSimulation, advanceAttackPath, createIncident, resolveIncident, setPresentationMode, setPresentationStage]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        onClick={togglePresentation} 
        variant={presentationModeActive ? "destructive" : "default"}
        className={`shadow-lg font-mono ${presentationModeActive ? 'animate-pulse' : ''}`}
      >
        {presentationModeActive ? (
          <><Square className="w-4 h-4 mr-2" /> STOP DEMO</>
        ) : (
          <><Play className="w-4 h-4 mr-2" /> PRESENTATION MODE</>
        )}
      </Button>
    </div>
  );
}
