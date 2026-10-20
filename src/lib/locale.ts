export type Locale = "pt-BR" | "en";

export function text(locale: Locale, portuguese: string, english: string): string {
  return locale === "en" ? english : portuguese;
}
