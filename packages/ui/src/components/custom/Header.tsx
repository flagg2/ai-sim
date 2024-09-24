import { ThemeToggle } from "./ThemeToggle";
import { BackButton } from "./BackButton"; // Import the BackButton component

type HeaderProps = {
  title: string;
};

export default function Header({ title = "K-Means Clustering" }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 shadow-sm">
      <BackButton /> {/* Add BackButton component */}
      <h1 className="text-2xl font-bold">{title}</h1> {/* Use title prop */}
      <ThemeToggle />
    </header>
  );
}
