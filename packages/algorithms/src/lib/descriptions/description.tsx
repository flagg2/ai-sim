type Props = {
  children: React.ReactNode;
};

export default function Description({ children }: Props) {
  return <div className="space-y-4 text-dimmed-foreground">{children}</div>;
}
