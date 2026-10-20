"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { BarChart3, FileText, Users, Crosshair } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/locale";
import { text } from "@/lib/locale";
const pages = [{href:"/",pt:"Visão geral",en:"Overview", Icon:BarChart3},{href:"/equipes",pt:"Equipes",en:"Teams",Icon:Users},{href:"/metodologia",pt:"Metodologia",en:"Methodology",Icon:FileText}];
export function SiteHeader({locale}:{locale:Locale}){
  const path=usePathname();
  const router=useRouter();
  const [currentLocale,setCurrentLocale]=useState(locale);
  function changeLocale(next:Locale){
    setCurrentLocale(next);
    document.cookie=`site-locale=${next==="en"?"en":"pt-BR"}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }
  return <header className="glass sticky top-0 z-30">
    <div className="mx-auto flex min-h-[74px] max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 lg:px-8">
      <Link href="/" aria-label={text(currentLocale,"Página inicial","Home page")} className="flex items-center gap-3">
        <div className="grid size-10 place-items-center bg-[#ff4655] text-white" style={{clipPath:"polygon(0 0,100% 0,100% 72%,68% 100%,0 100%)"}}><Crosshair size={22} strokeWidth={2.8}/></div>
        <div><div className="text-[16px] font-black leading-none tracking-[.04em]">VALORANT<span className="text-[#ff4655]">.DATAS</span></div><div className="mt-1 text-[9px] font-bold tracking-[.25em] text-[#93a8b1]">POST GAME ANALYSIS</div></div>
      </Link>
      <nav aria-label={text(currentLocale,"Navegação principal","Main navigation")} className="flex items-center gap-1 overflow-x-auto">
        {pages.map(({href,pt,en,Icon})=>{
          const active=href==="/"?path==="/":path.startsWith(href);
          return <Link key={href} href={href} aria-current={active?"page":undefined} className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2.5 text-xs font-bold transition-colors sm:px-4 ${active?"bg-[#ff46551e] text-[#ff7780]":"text-[#9cafb8] hover:bg-white/5 hover:text-white"}`}><Icon size={15}/>{text(currentLocale,pt,en)}</Link>;
        })}
      </nav>
      <div className="flex items-center gap-3">
        <div role="group" aria-label={text(currentLocale,"Selecionar idioma","Select language")} className="flex items-center rounded-md border border-[#354851] p-1">
          {([{locale:"pt-BR",label:"PT"},{locale:"en",label:"EN"}] as const).map(option=><button key={option.locale} type="button" aria-pressed={currentLocale===option.locale} onClick={()=>changeLocale(option.locale)} className={`rounded px-2 py-1 text-[10px] font-black transition-colors ${currentLocale===option.locale?"bg-[#ff4655] text-white":"text-[#9cafb8] hover:text-white"}`}>{option.label}</button>)}
        </div>
        <div className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#9eb0b8] xl:flex"><span className="ring-dot"/>LIVE</div>
      </div>
    </div>
  </header>;
}
