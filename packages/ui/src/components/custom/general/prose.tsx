import useTheme from "../../../lib/hooks/use-theme";
import { cn } from "../../../lib/utils";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { theme } = useTheme();
  return (
    <div
      className={cn(
        "prose prose-p:mt-0 prose-strong:text-secondary-foreground text-secondary-foreground ",
        className,
        theme === "dark" && "text-dimmed-foreground",
      )}
    >
      {children}
    </div>
  );
}
