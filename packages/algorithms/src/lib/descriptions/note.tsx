export default function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm italic text-muted-foreground border-l-4 border-primary/20 pl-4">
      {children}
    </p>
  );
}
