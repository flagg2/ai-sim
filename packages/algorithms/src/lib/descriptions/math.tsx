import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

type Props = {
  children: (string | number)[] | string | number;
  block?: boolean;
  className?: string;
};

/**
 * A mathematical expression in an algorithm description, supports LaTeX.
 */
export default function Expression({
  children,
  block = false,
  className,
}: Props) {
  const parseChildren = (input: Props["children"]): string => {
    if (Array.isArray(input)) {
      return input.join(" ");
    }
    return String(input);
  };

  const expression = parseChildren(children);

  if (block) {
    return <BlockMath>{expression}</BlockMath>;
  }

  return (
    <span className={`text-secondary-foreground ${className}`}>
      <InlineMath>{expression}</InlineMath>
    </span>
  );
}
