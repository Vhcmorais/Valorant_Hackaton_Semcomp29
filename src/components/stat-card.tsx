
import type { LucideIcon } from "lucide-react";

// Componente reutilizável para apresentar indicadores estatísticos.
// Recebe o título, o valor, uma descrição complementar e um ícone.
// A propriedade tone permite alternar a cor do ícone entre verde e vermelho.
export function StatCard({title,value,detail,Icon,tone="mint"}:{title:string;value:string;detail:string;Icon:LucideIcon;tone?:"mint"|"red"}){

 // Renderiza o cartão com os dados recebidos pelas propriedades.
 return <div className="panel relative overflow-hidden p-5 sm:p-6">

   {/* Elemento decorativo posicionado no canto superior direito,
       utilizando bordas e um recorte geométrico. */}
   <div className="absolute right-0 top-0 h-16 w-16 border-l border-b border-[#344751] opacity-40" style={{clipPath:"polygon(100% 0, 100% 100%, 0 0)"}}/>

   {/* Cabeçalho do cartão com o título do indicador e seu ícone.
       A cor do ícone é definida pela propriedade tone. */}
   <div className="mb-6 flex items-center justify-between gap-2"><span className="text-[11px] font-bold uppercase tracking-[.13em] text-[#a1b3bb]">{title}</span><Icon size={18} className={tone==="red"?"text-[#ff7882]":"text-[#7bdac1]"}/></div>

   {/* Valor principal do indicador, com tamanho de fonte responsivo
       para se adaptar a diferentes dimensões de tela. */}
   <div className="text-[clamp(28px,3vw,39px)] font-black leading-none tracking-tight">{value}</div>

   {/* Descrição complementar que contextualiza o valor apresentado. */}
   <div className="mt-3 text-[11px] text-[#92a5ad]">{detail}</div>
 </div>
}
