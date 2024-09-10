import { getLocale } from "next-intl/server";

export async function getDateFormatter() {
  const locale = await getLocale();
  return (date: Date) => formatDate(date, locale === "en" ? "en" : "sk");
}

function formatDate(date: Date, language: "en" | "sk"): string {
  // Define month and day names for both languages
  const months: { [key: string]: string[] } = {
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    sk: [
      "Január",
      "Február",
      "Marec",
      "Apríl",
      "Máj",
      "Jún",
      "Júl",
      "August",
      "September",
      "Október",
      "November",
      "December",
    ],
  };

  const days: { [key: string]: string[] } = {
    en: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    sk: [
      "Nedeľa",
      "Pondelok",
      "Utorok",
      "Streda",
      "Štvrtok",
      "Piatok",
      "Sobota",
    ],
  };

  // Get the day, month, and year of the date
  const dayName = days[language]![date.getDay()];
  const day = date.getDate();
  const monthName = months[language]![date.getMonth()];
  const year = date.getFullYear();

  // Return formatted date string
  if (language === "en") {
    return `${monthName} ${day}, ${year}`;
  }
  return `${day}. ${monthName} ${year}`;
}
