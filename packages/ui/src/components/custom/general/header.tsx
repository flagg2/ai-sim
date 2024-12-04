import { ThemeToggle } from "./theme-toggle";
import { BackButton } from "./back-button";

type HeaderProps = {
  title: string;
};

export function Header({ title = "K-Means Clustering" }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 shadow-sm">
      <BackButton />
      <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
      <ThemeToggle />
    </header>
  );
}
