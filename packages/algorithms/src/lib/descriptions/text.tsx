type Props = {
  children: React.ReactNode;
};

/**
 * Wrapper component for algoroithm descriptions
 */

export default function Text({ children }: Props) {
  return <div className="space-y-4 text-dimmed-foreground">{children}</div>;
}
