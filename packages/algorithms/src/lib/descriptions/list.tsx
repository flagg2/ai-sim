type Props = {
  children: React.ReactNode;
};

export default function List({ children }: Props) {
  return <ul className="space-y-2 list-disc list-inside">{children}</ul>;
}

export function ListItem({ children }: { children: React.ReactNode }) {
  return <li className="text-dimmed-foreground">{children}</li>;
}
