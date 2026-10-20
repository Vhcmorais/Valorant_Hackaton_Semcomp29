import "server-only";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/locale";

export async function getLocale(): Promise<Locale> {
  return (await cookies()).get("site-locale")?.value === "en" ? "en" : "pt-BR";
}
