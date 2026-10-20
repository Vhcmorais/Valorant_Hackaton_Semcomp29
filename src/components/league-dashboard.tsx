"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, Cell, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, ArrowUpRight, ChevronDown, Info, Map, Search, ShieldCheck, Swords } from "lucide-react";
import type { League, TeamSummary } from "@/lib/types";
import { pct, mapName, num, signedPp } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import { text } from "@/lib/locale";

function RankedTeams({teams,locale}:{teams:TeamSummary[];locale:Locale}){
 const [search,setSearch]=useState("");
 const [min10,setMin10]=useState(true);
 const [order,setOrder]=useState("win_partida");
 const filtered=useMemo(()=>teams.filter(t=>(!min10 || t.partidas>=10)&&t.nome.toLowerCase().includes(search.toLowerCase().trim())).sort((a,b)=>{
  if(order==="eco_delta")return b.eco_delta-a.eco_delta;
  if(order==="partidas")return b.partidas-a.partidas;
  return b.win_partida-a.win_partida || b.partidas-a.partidas;
 }),[teams,search,min10,order]);
 return <div className="panel overflow-hidden">
  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#293942] p-5">
   <div><div className="eyebrow">01 / {text(locale,"Ranking","Rankings")}</div><h2 className="section-title mt-2">{text(locale,"Destaques entre equipes","Top teams")}</h2></div>
   <Link href="/equipes" className="flex items-center gap-1 text-xs font-bold text-[#70e4c3] hover:underline">{text(locale,"Ver todas","View all")} <ArrowRight size={15}/></Link>
  </div>
  <div className="flex flex-wrap items-center gap-3 p-5 pb-3">
   <label className="field flex min-w-[185px] flex-1 items-center gap-2 text-[#8da2ab]"><Search size={16}/><input aria-label={text(locale,"Buscar equipe","Search team")} placeholder={text(locale,"Buscar equipe...","Search teams...")} className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#6e858e]" value={search} onChange={e=>setSearch(e.target.value)}/></label>
   <label className="relative"><span className="sr-only">{text(locale,"Ordenar equipes","Sort teams")}</span><select className="field appearance-none pr-9 text-xs" value={order} onChange={e=>setOrder(e.target.value)}><option value="win_partida">{text(locale,"Maior taxa de vitória","Highest win rate")}</option><option value="eco_delta">{text(locale,"Melhor eficiência econômica","Best economy efficiency")}</option><option value="partidas">{text(locale,"Mais partidas","Most matches")}</option></select><ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-[#8da2ab]"/></label>
   <label className="flex cursor-pointer items-center gap-2 text-xs text-[#a8bbc3]"><input type="checkbox" checked={min10} onChange={e=>setMin10(e.target.checked)} className="accent-[#ff4655]"/>{text(locale,"Mínimo de 10 partidas","Minimum 10 matches")}</label>
  </div>
  <div className="scrollbar overflow-x-auto"><table className="w-full min-w-[640px] text-left text-xs"><thead><tr className="table-head"><th className="px-5 py-3">#</th><th className="py-3">{text(locale,"Equipe","Team")}</th><th className="py-3 text-right">{text(locale,"Partidas","Matches")}</th><th className="py-3 text-right">{text(locale,"Vitórias","Wins")}</th><th className="py-3 text-right">{text(locale,"Aproveitamento","Win rate")}</th><th className="px-5 py-3 text-right">{text(locale,"Economia vs. esperado","Economy vs. expected")}</th></tr></thead><tbody>
   {filtered.slice(0,8).map((t,i)=><tr className="table-row" key={t.slug}><td className="px-5 py-4 font-bold text-[#7f9ba5]">{String(i+1).padStart(2,"0")}</td><td className="py-4"><Link href={`/equipes/${t.slug}`} className="inline-flex items-center gap-2 font-bold text-[#eff6f5] hover:text-[#70e4c3]"><span className="grid size-7 shrink-0 place-items-center rounded bg-[#ff465520] text-[11px] font-black text-[#ff8991]">{t.nome[0]}</span>{t.nome}<ArrowUpRight size={12}/></Link></td><td className="py-4 text-right text-[#9db1b9]">{num(t.partidas,locale)}</td><td className="py-4 text-right text-[#9db1b9]">{num(t.vitorias,locale)}</td><td className="py-4 text-right font-bold text-[#f1f5f3]">{pct(t.win_partida,1,locale)}</td><td className={`px-5 py-4 text-right font-semibold ${t.eco_delta>=0?"text-[#79e2c4]":"text-[#ff9299]"}`}>{signedPp(t.eco_delta,locale)}</td></tr>)}
   {filtered.length===0&&<tr><td className="p-7 text-center text-[#a4b6be]" colSpan={6}>{text(locale,"Nenhuma equipe encontrada.","No teams found.")}</td></tr>}
  </tbody></table></div>
  <div className="border-t border-[#293942] px-5 py-3 text-[10px] leading-relaxed text-[#8a9ea6]">{text(locale,"A classificação considera somente as equipes com dados suficientes para aparecer no índice. Taxas observadas não significam previsões; amostras menores são mais instáveis.","Rankings include only teams with enough data to appear in the index. Observed rates are not predictions; smaller samples are less stable.")}</div>
 </div>
}
function MapStats({league,locale}:{league:League;locale:Locale}){
 const [all,setAll]=useState(false);
 const list=useMemo(()=>league.mapas.filter(m=>all||m.partidas>=10).sort((a,b)=>b.partidas-a.partidas),[league.mapas,all]);
 const chart=list.map(m=>({nome:mapName(m.mapa),jogos:m.partidas,ataque:Number((m.atk*100).toFixed(2)),defesa:Number((m.def*100).toFixed(2))}));
 return <div className="panel overflow-hidden p-5 sm:p-6">
   <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="eyebrow">02 / {text(locale,"Mapas","Map pool")}</div><h2 className="section-title mt-2">{text(locale,"Ataque × Defesa","Attack × Defense")}</h2><p className="mt-1 text-xs text-[#94a8b1]">{text(locale,"Distribuição de vitórias de rounds por lado e mapa","Round win distribution by side and map")}</p></div><Map size={21} className="text-[#70e4c3]"/></div>
   <div className="mt-5 flex items-center gap-5 text-[11px] text-[#b1c4c9]"><span><span className="mr-2 inline-block size-2.5 rounded-sm bg-[#ff5967]"/>{text(locale,"Ataque","Attack")}</span><span><span className="mr-2 inline-block size-2.5 rounded-sm bg-[#70dec0]"/>{text(locale,"Defesa","Defense")}</span></div>
   <div className="mt-3 h-[320px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart} margin={{top:5,right:12,left:-15,bottom:3}} barCategoryGap="30%"><CartesianGrid strokeDasharray="3 4" stroke="#263943" vertical={false}/><XAxis dataKey="nome" tickLine={false} axisLine={false} tick={{fontSize:10,fill:"#9caeb7"}}/><YAxis domain={[0,100]} tickFormatter={v=>`${v}%`} tickLine={false} axisLine={false} tick={{fontSize:10,fill:"#81959e"}}/><Tooltip cursor={{fill:"#ffffff08"}} contentStyle={{background:"#14232b",border:"1px solid #35505b",color:"#ecf3f4",borderRadius:8,fontSize:12}} formatter={(v)=>`${Number(v).toFixed(1)}%`}/><Bar dataKey="ataque" name={text(locale,"Ataque","Attack")} stackId="a" fill="#ff5967"/><Bar dataKey="defesa" name={text(locale,"Defesa","Defense")} stackId="a" fill="#70dec0" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div>
   <label className="mt-3 flex cursor-pointer items-center gap-2 text-[11px] text-[#a4b7c0]"><input type="checkbox" checked={all} onChange={e=>setAll(e.target.checked)} className="accent-[#ff4655]"/>{text(locale,"Mostrar mapas com menos de 10 partidas","Show maps with fewer than 10 matches")}</label>
   <p className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed text-[#8a9fa7]"><Info size={13} className="mt-0.5 shrink-0"/>{text(locale,"Os dados históricos são apresentados por mapa; não representam a força intrínseca de cada lado.","Historical data is shown by map; it does not represent the intrinsic strength of either side.")}</p>
 </div>
}
export function LeagueDashboard({league,teams,locale}:{league:League;teams:TeamSummary[];locale:Locale}){
 const eco=league.metricas.economia;
 return <>
   <div className="mt-9 grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_1fr]">
     <RankedTeams teams={teams} locale={locale}/><MapStats league={league} locale={locale}/>
   </div>
   <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
    <section className="panel p-5 sm:p-6"><div className="eyebrow">03 / {text(locale,"Economia","Economy")}</div><h2 className="section-title mt-2">{text(locale,"Eficiência por tipo de compra","Efficiency by buy type")}</h2><p className="mt-1 text-xs text-[#91a6ae]">{text(locale,"Vitórias observadas em rounds de cada classe","Observed wins in rounds of each class")}</p>
     <div className="mt-7 space-y-6">{(["pistol","eco","semi","full"] as const).map(e=><div key={e}><div className="mb-2 flex items-center justify-between gap-2"><span className="text-xs font-bold text-[#d7e2e3]">{text(locale,({pistol:"Pistola",eco:"Eco",semi:"Semi",full:"Full buy"})[e],({pistol:"Pistol",eco:"Eco",semi:"Half buy",full:"Full buy"})[e])}</span><span className="text-xs font-black">{pct(eco[e].win,1,locale)} <span className="ml-1 text-[10px] font-normal text-[#7e949e]">· {num(eco[e].n,locale)} {text(locale,"observações","observations")}</span></span></div><div className="h-2.5 rounded-full bg-[#273a43]"><div className="h-full rounded-full bg-gradient-to-r from-[#c9334b] to-[#ff6574]" style={{width:`${Math.max(0,Math.min(100,(eco[e].win??0)*100))}%`}}/></div></div>)}</div>
     <p className="mt-6 text-[10px] leading-relaxed text-[#869da6]">{text(locale,"Cada round aparece duas vezes no agregado da liga (uma por equipe). As classes são heurísticas calculadas pelo processamento.","Each round appears twice in the league aggregate (once per team). Classes are heuristics calculated during processing.")}</p>
    </section>
    <section className="panel p-5 sm:p-6"><div className="eyebrow">04 / {text(locale,"Insights de rounds","Round insights")}</div><h2 className="section-title mt-2">{text(locale,"Eventos que merecem atenção","Events worth noting")}</h2><p className="mt-1 text-xs text-[#91a6ae]">{text(locale,"Associações descritivas, sem inferência causal","Descriptive associations, not causal inferences")}</p>
      <div className="mt-6 space-y-3">
       <div className="rounded-xl border border-[#36524e] bg-[#6be3c10c] p-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#89e7ce]"><Swords size={15}/> {text(locale,"Primeira eliminação","First kill")}</div><div className="mt-2 flex items-baseline justify-between gap-2"><span className="text-2xl font-black text-[#e9f6f2]">{pct(league.metricas.abertura.win_com_fk,1,locale)}</span><span className="text-xs text-[#a1b9bd]">{text(locale,"vitória após first kill","win after first kill")}</span></div><p className="mt-2 text-xs text-[#a3bbbd]">{text(locale,"Sem conquistar a primeira eliminação:","Without getting the first kill:")} {pct(league.metricas.abertura.win_sem_fk,1,locale)} {text(locale,"de vitórias.","wins.")}</p></div>
       <div className="rounded-xl border border-[#4c3840] bg-[#ff46550b] p-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ff939b]"><ShieldCheck size={15}/> {text(locale,"Vantagem de equipamento","Loadout advantage")}</div><div className="mt-2 flex items-baseline justify-between gap-2"><span className="text-2xl font-black text-[#e9f6f2]">{pct(league.metricas.full_vs_eco.win,1,locale)}</span><span className="text-xs text-[#a1b9bd]">full buy {text(locale,"contra","vs.")} eco</span></div><p className="mt-2 text-xs text-[#a3bbbd]">{text(locale,"Amostra de","Sample of")} {num(league.metricas.full_vs_eco.n,locale)} {text(locale,"rounds por equipe.","team-rounds.")}</p></div>
       <div className="rounded-xl border border-[#293d49] bg-[#70e4c307] p-4"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8abbc8]"><Info size={15}/> {text(locale,"Spike plantada","Spike planted")}</div><div className="mt-2 flex items-baseline justify-between gap-2"><span className="text-2xl font-black text-[#e9f6f2]">{pct(league.metricas.ataque.pos_plant_win,1,locale)}</span><span className="text-xs text-[#a1b9bd]">{text(locale,"vitória atacante com plant","attacker win after plant")}</span></div><p className="mt-2 text-xs text-[#a3bbbd]">{text(locale,"Medida condicional entre os","Conditional measure across the")} {num(league.metricas.ataque.n_plants,locale)} {text(locale,"plants registrados.","recorded plants.")}</p></div>
      </div>
    </section>
   </div>
 </>;
}
