import type { LucideIcon } from "lucide-react";
export function StatCard({title,value,detail,Icon,tone="mint"}:{title:string;value:string;detail:string;Icon:LucideIcon;tone?:"mint"|"red"}){
 return <div className="panel relative overflow-hidden p-5 sm:p-6">
   <div className="absolute right-0 top-0 h-16 w-16 border-l border-b border-[#344751] opacity-40" style={{clipPath:"polygon(100% 0, 100% 100%, 0 0)"}}/>
   <div className="mb-6 flex items-center justify-between gap-2"><span className="text-[11px] font-bold uppercase tracking-[.13em] text-[#a1b3bb]">{title}</span><Icon size={18} className={tone==="red"?"text-[#ff7882]":"text-[#7bdac1]"}/></div>
   <div className="text-[clamp(28px,3vw,39px)] font-black leading-none tracking-tight">{value}</div>
   <div className="mt-3 text-[11px] text-[#92a5ad]">{detail}</div>
 </div>
}
