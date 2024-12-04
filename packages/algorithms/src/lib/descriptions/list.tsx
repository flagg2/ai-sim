type Props = {
  children: React.ReactNode;
};

/**
 * A list of items in an algorithm description. Children should be `ListItem` components.
 */
export default function List({ children }: Props) {
  return <ul className="space-y-2 list-disc list-inside">{children}</ul>;
}

/**
 * A list item in an algorithm description.
 */
export function ListItem({ children }: { children: React.ReactNode }) {
  return <li className="text-dimmed-foreground">{children}</li>;
}
