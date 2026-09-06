export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background grid-pattern flex flex-col">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <div className="h-4 w-4 bg-background rounded-sm animate-pulse-secure" />
          </div>
          <span className="text-xl font-bold tracking-tight glow-cyan">SecureMax</span>
        </div>
        <div className="text-sm font-mono text-muted-foreground">
          SIH26125 PROTOTYPE
        </div>
      </header>
      <main className="flex-1 flex flex-col justify-center">
        {children}
      </main>
    </div>
  );
}
