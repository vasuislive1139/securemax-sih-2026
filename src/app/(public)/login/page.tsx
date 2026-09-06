'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldCheck, ShieldAlert, Key } from 'lucide-react';

type AuthState = 'IDLE' | 'CONNECTING' | 'WAITING_FOR_SIGNATURE' | 'VERIFYING' | 'AUTHENTICATED' | 'FAILED';

export default function LoginPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [authState, setAuthState] = useState<AuthState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');
  useEffect(() => {
    if (isConnected && address && (authState === 'IDLE' || authState === 'CONNECTING')) {
      handleAuthentication(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, authState]);

  const handleConnect = async () => {
    setErrorMessage('');
    setAuthState('CONNECTING');
    try {
      const connector = connectors.find(c => c.id === 'injected' || c.id === 'metaMask') || connectors[0];
      if (!connector) throw new Error('No wallet connector available');
      connect({ connector });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect wallet');
      setAuthState('FAILED');
    }
  };

  const handleAuthentication = async (walletAddress: string) => {
    try {
      // 1. Get Challenge
      setAuthState('WAITING_FOR_SIGNATURE');
      const challengeRes = await fetch(`/api/auth/challenge?address=${walletAddress}`);
      if (!challengeRes.ok) {
        throw new Error((await challengeRes.json()).error || 'Failed to get challenge');
      }
      const { message } = await challengeRes.json();

      // 2. Sign Message
      const signature = await signMessageAsync({ message });

      // 3. Verify Signature & Login
      setAuthState('VERIFYING');
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress, signature, message }),
      });

      if (!loginRes.ok) {
        throw new Error((await loginRes.json()).error || 'Authentication failed');
      }

      const { user } = await loginRes.json();
      setAuthState('AUTHENTICATED');

      // 4. Redirect
      setTimeout(() => {
        if (user.role === 'ADMIN') router.push('/dashboard/admin');
        else if (user.role === 'AUDITOR') router.push('/dashboard/auditor');
        else router.push('/dashboard/user');
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Authentication failed');
      setAuthState('FAILED');
      disconnect();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-white/10 glass-panel">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">SecureMax Login</CardTitle>
          <CardDescription>Authenticate using your Web3 Wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center pb-8">

          {authState === 'IDLE' && (
            <Button onClick={handleConnect} className="w-full max-w-[250px] bg-primary hover:bg-primary/90 text-primary-foreground">
              Connect MetaMask
            </Button>
          )}

          {authState === 'CONNECTING' && (
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
              <p>Connecting wallet...</p>
            </div>
          )}

          {authState === 'WAITING_FOR_SIGNATURE' && (
            <div className="flex flex-col items-center text-amber-400">
              <ShieldCheck className="w-8 h-8 mb-2 animate-pulse" />
              <p>Please sign the message in MetaMask</p>
            </div>
          )}

          {authState === 'VERIFYING' && (
            <div className="flex flex-col items-center text-cyan-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Verifying cryptographic signature...</p>
            </div>
          )}

          {authState === 'AUTHENTICATED' && (
            <div className="flex flex-col items-center text-emerald-400">
              <ShieldCheck className="w-8 h-8 mb-2" />
              <p>Authentication Successful</p>
            </div>
          )}

          {authState === 'FAILED' && (
            <div className="flex flex-col items-center text-destructive text-center space-y-4">
              <ShieldAlert className="w-8 h-8" />
              <p>{errorMessage}</p>
              <Button variant="outline" onClick={() => {
                disconnect();
                setAuthState('IDLE');
              }} className="w-full max-w-[250px]">
                Try Again
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
