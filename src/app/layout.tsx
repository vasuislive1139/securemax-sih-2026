import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'SecureMax | Self-Defending Decentralized Identity Platform',
  description: 'SIH26125 Prototype',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-[100dvh] bg-background font-sans antialiased flex flex-col">
        <div className="w-full h-7 bg-zinc-950 border-b border-amber-500/20 flex items-center justify-center z-50">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-amber-500/80">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
            SYNTHETIC DEMONSTRATION DATA — NOT REAL BEL INFORMATION
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
