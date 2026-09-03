import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'SecureMesh | Self-Defending Decentralized Identity Platform',
  description: 'SIH26125 Prototype',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <div className="bg-destructive text-destructive-foreground text-center text-xs font-bold py-1 z-50 shadow-md">
          SYNTHETIC DEMONSTRATION DATA — NOT REAL BEL INFORMATION
        </div>
        <div className="flex-1 flex flex-col">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
