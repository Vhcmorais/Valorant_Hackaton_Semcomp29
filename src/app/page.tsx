
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crosshair, Database, Layers3, RadioTower, UsersRound } from "lucide-react";
import heroImage from "@/imgs/VALORANT_Jett_Dark.jpg";
import { LeagueDashboard } from "@/components/league-dashboard";
import { StatCard } from "@/components/stat-card";
import { getLeague, getTeams } from "@/lib/data";
import { num, pct } from "@/lib/format";
import { text } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

// Componente principal da página inicial do Valorant Observatory.
// Reúne a apresentação da plataforma e os principais indicadores
// estatísticos obtidos a partir dos dados históricos das partidas.
export default async function Home(){

 // Carrega simultaneamente os dados gerais da liga, a lista
 // de equipes e o idioma selecionado pelo usuário.
 const [league,teams,locale]=await Promise.all([getLeague(),getTeams(),getLocale()]);

 return <>

  {/* =========================================================
      SEÇÃO PRINCIPAL - HERO
      Apresenta a plataforma, sua proposta e os caminhos
      para explorar os dados e conhecer a metodologia.
      ========================================================= */}
  <section className="hero-shell relative isolate grid overflow-hidden px-6 py-9 sm:px-10 sm:py-12 md:grid-cols-[1.15fr_.85fr] md:items-center md:px-12 md:py-10 lg:min-h-[520px] lg:px-16">

   {/* Área de apresentação textual com identificação do evento,
       título principal, descrição e botões de navegação. */}
   <div className="hero-copy relative z-10">

    {/* Identificação do Hackathon e indicador visual de status. */}
    <div className="hero-kicker mb-6 inline-flex items-center gap-3 rounded-full px-4 py-2"><span className="ring-dot"/><span className="eyebrow !text-[#d0e5e6]">SEMCOMP 2026 · VALORANT HACKATON</span></div>

    {/* Título principal adaptado ao idioma selecionado. */}
    <h1 className="hero-title max-w-[760px] text-[clamp(42px,6vw,82px)] font-black uppercase leading-[.94] tracking-[-.065em]">{locale==="en"?<>Every round<br/>tells a <span className="hero-highlight">story.</span></>:<>Cada round<br/>conta <span className="hero-highlight">uma história.</span></>}</h1>

    {/* Descrição da proposta do projeto, destacando
        a transformação dos dados em análises pós-partida. */}
    <p className="mt-6 max-w-[540px] text-[14px] leading-7 text-[#adbec4] sm:text-[15px]">{text(locale,"Dados históricos de VALORANT transformados em insights, comparações e análises pós-partida. Entenda o que aconteceu e descubra padrões para melhorar seu desempenho.","Historical VALORANT data transformed into insights, comparisons, and post-match analysis. Understand what happened and uncover patterns to improve your performance.")}</p>

    {/* Botões que direcionam o usuário para a listagem
        de equipes e para a explicação da metodologia. */}
    <div className="mt-7 flex flex-wrap gap-3"><Link href="/equipes" className="btn-primary">{text(locale,"Explorar equipes","Explore teams")} <ArrowRight size={15}/></Link><Link href="/metodologia" className="btn-outline">{text(locale,"Como analisamos","How we analyze")}</Link></div>
   </div>

   {/* Área visual do hero, responsável por apresentar
       a imagem temática de VALORANT e seus elementos decorativos. */}
   <div className="hero-art-stage relative z-10 mx-auto mt-7 flex min-h-[250px] w-full max-w-[900px] items-center justify-center sm:min-h-[340px] md:mt-0 md:min-h-[390px]">

    {/* Elementos gráficos que criam iluminação e profundidade
        ao redor da imagem principal. */}
    <div className="hero-art-orbit absolute inset-[8%] rounded-[46%_54%_58%_42%/43%_42%_58%_57%]"/>
    <div className="hero-art-disc absolute inset-[15%] rounded-full"/>

    {/* Imagem principal, carregada com prioridade por estar
        em uma área de destaque logo no início da página. */}
    <Image src={heroImage} alt={text(locale,"Ilustração de VALORANT","VALORANT illustration")} priority className="hero-art relative z-10 h-auto w-[100%] max-w-[900px] object-contain"/>
   </div>

   {/* Identificação decorativa exibida em telas médias e maiores. */}
   <div className="absolute bottom-6 right-7 hidden text-[10px] font-black tracking-[.25em] text-[#68838b] md:block">INSIGHTS // 2026</div>
  </section>

  {/* =========================================================
      OBSERVATÓRIO DA LIGA
      Introduz a área estatística e identifica a quantidade
      de campeonatos presentes na base de dados.
      ========================================================= */}
  <div className="mt-8 flex flex-wrap items-center justify-between gap-2"><div><div className="eyebrow">{text(locale,"Observatório da liga","League observatory")}</div><h2 className="section-title mt-2">{text(locale,"Visão geral dos dados","Data overview")}</h2></div><div className="flex items-center gap-2 rounded-full border border-[#38535b] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#b1c3ca]"><RadioTower size={13} className="text-[#70e4c3]"/>{text(locale,"Base estática","Static dataset")} · {league.campeonatos.length} {text(locale,"campeonatos","tournaments")}</div></div>

  {/* =========================================================
      INDICADORES GERAIS
      Apresenta os principais números da base processada:
      partidas, equipes, jogadores e rounds registrados.
      ========================================================= */}
  <section aria-label="Indicadores principais" className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">

   {/* Quantidade total de partidas processadas a partir dos JSONs. */}
   <StatCard title={text(locale,"Partidas","Matches")} value={num(league.partidas,locale)} detail={text(locale,"Arquivos JSON processados","JSON files processed")} Icon={Crosshair} tone="red"/>

   {/* Total de equipes identificadas e quantidade que possui
       pelo menos cinco partidas para aparecer no índice. */}
   <StatCard title={text(locale,"Equipes","Teams")} value={num(league.times,locale)} detail={text(locale,`${teams.length} com 5+ partidas no índice`,`${teams.length} with 5+ matches in the index`)} Icon={UsersRound}/>

   {/* Quantidade de jogadores distintos encontrados na base. */}
   <StatCard title={text(locale,"Jogadores","Players")} value={num(league.jogadores,locale)} detail={text(locale,"Identidades distintas","Unique identities")} Icon={Database}/>

   {/* Quantidade de rounds efetivos.
       O total é dividido por dois porque cada round gera
       um registro para cada uma das duas equipes participantes. */}
   <StatCard title="Rounds" value={num(league.metricas.rounds/2,locale)} detail={text(locale,`${num(league.metricas.rounds,locale)} registros time-round`,`${num(league.metricas.rounds,locale)} team-round records`)} Icon={Layers3} tone="red"/>
  </section>

  {/* =========================================================
      INDICADORES DE DESEMPENHO
      Resume os percentuais históricos de vitória no ataque,
      na defesa e a frequência de trocas de eliminações.
      ========================================================= */}
  <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

   {/* Percentual de rounds vencidos pelas equipes no lado atacante. */}
   <div className="panel flex items-center justify-between gap-3 px-5 py-4"><div><div className="text-[11px] font-bold text-[#92aab3]">{text(locale,"Vitórias no ataque","Attack-side wins")}</div><div className="mt-1 text-2xl font-black">{pct(league.metricas.atk.win,1,locale)}</div></div><span className="rounded-lg bg-[#ff46551b] px-3 py-2 text-[11px] font-black text-[#ff939c]">ATK</span></div>

   {/* Percentual de rounds vencidos pelas equipes no lado defensor. */}
   <div className="panel flex items-center justify-between gap-3 px-5 py-4"><div><div className="text-[11px] font-bold text-[#92aab3]">{text(locale,"Vitórias na defesa","Defense-side wins")}</div><div className="mt-1 text-2xl font-black">{pct(league.metricas.def.win,1,locale)}</div></div><span className="rounded-lg bg-[#70e4c31b] px-3 py-2 text-[11px] font-black text-[#70e4c3]">DEF</span></div>

   {/* Frequência de mortes que foram trocadas por uma eliminação
       adversária dentro da janela de cinco segundos. */}
   <div className="panel flex items-center justify-between gap-3 px-5 py-4"><div><div className="text-[11px] font-bold text-[#92aab3]">{text(locale,"Trocas de eliminação em até 5 s","Kill trades within 5 s")}</div><div className="mt-1 text-2xl font-black">{pct(league.trade_liga,1,locale)}</div></div><span className="rounded-lg bg-[#a9c2d21b] px-3 py-2 text-[11px] font-black text-[#b6cedb]">TRD</span></div>
  </section>

  {/* =========================================================
      DASHBOARD DA LIGA
      Encaminha os dados gerais e as informações das equipes
      para o componente responsável pelos rankings, gráficos
      e demais visualizações estatísticas da plataforma.
      ========================================================= */}
  <LeagueDashboard league={league} teams={teams} locale={locale}/>
 </>;
}
