import type { Locale } from "@/lib/locale";

const numberLocale = (locale: Locale) => locale === "en" ? "en-US" : "pt-BR";
export const pct = (fraction: number | null | undefined, digits = 1, locale: Locale = "pt-BR") =>
  fraction == null ? "—" : new Intl.NumberFormat(numberLocale(locale), { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(fraction);
export const num = (value: number, locale: Locale = "pt-BR") => new Intl.NumberFormat(numberLocale(locale)).format(value);
export const signedPp = (fraction: number | null | undefined, locale: Locale = "pt-BR") => fraction == null ? "—" : `${fraction >= 0 ? "+" : ""}${(fraction * 100).toLocaleString(numberLocale(locale), { maximumFractionDigits: 1, minimumFractionDigits: 1 })} ${locale === "en" ? "pp" : "p.p."}`;
export const mapName = (s: string) => s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
