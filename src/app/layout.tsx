import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { text } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";
import "./globals.css";
export const metadata: Metadata = {
 title:"Valorant.Datas", description:"Análise histórica de partidas, equipes e padrões competitivos com dados autorizados do hackathon."
};
export default async function RootLayout({ children }:Readonly<{children:React.ReactNode}>){
 const locale = await getLocale();
 return <html lang={locale}><body><SiteHeader locale={locale}/><main className="mx-auto min-h-[calc(100vh-150px)] max-w-7xl px-5 py-8 lg:px-8 lg:py-10">{children}</main><footer className="border-t border-[#273740] px-5 py-7 text-center text-xs text-[#8ba0aa]">TACTICAL.GG · {text(locale,"Análise histórica pós-partida","Historical post-match analysis")} · Hackathon SEMCOMP 2026 · {text(locale,"Projeto independente, sem afiliação com a Riot Games","Independent project, not affiliated with Riot Games")}</footer></body></html>
}
