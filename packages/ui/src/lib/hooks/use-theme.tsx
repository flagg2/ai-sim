import { useTheme as useNextTheme } from "next-themes";

export default function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();

  let actualTheme = theme;
  if (actualTheme === "system" || !actualTheme) {
    actualTheme = systemTheme ?? "light";
  }

  return { theme: actualTheme as "light" | "dark", setTheme };
}
