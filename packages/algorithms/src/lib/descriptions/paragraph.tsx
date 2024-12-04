/**
 * A basic block of text in an algorithm description.
 */
export default function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="text-dimmed-foreground">{children}</p>;
}
