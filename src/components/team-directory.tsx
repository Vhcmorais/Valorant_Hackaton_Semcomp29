
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import type { TeamSummary } from "@/lib/types";
import { pct, signedPp, num } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import { text } from "@/lib/locale";

// Componente responsável pelo diretório de equipes da plataforma.
// Permite pesquisar, filtrar e ordenar as equipes disponíveis,
// além de acessar os perfis individuais com suas estatísticas.
export function TeamDirectory({teams,locale}:{teams:TeamSummary[];locale:Locale}){

 // Armazena o texto digitado pelo usuário para pesquisar equipes pelo nome.
 const [query,setQuery]=useState("");

 // Controla o campeonato selecionado para filtrar as equipes participantes.
 const [competition,setCompetition]=useState("all");

 // Define o critério utilizado para ordenar as equipes no diretório.
 const [sort,setSort]=useState("partidas");

 // Obtém todos os campeonatos presentes nos dados das equipes.
 // O Set remove os nomes repetidos e a lista é organizada alfabeticamente.
 const competitions=Array.from(new Set(teams.flatMap(t=>t.campeonatos))).sort();

 // Filtra as equipes pelo nome e pela participação no campeonato selecionado.
 // Em seguida, organiza os resultados por partidas, taxa de vitória ou
 // eficiência econômica, conforme a preferência do usuário.
 // O useMemo evita refazer o processamento sem mudanças nas dependências.
 const result=useMemo(()=>teams.filter(t=>t.nome.toLowerCase().includes(query.toLowerCase().trim())&&(competition==="all"||t.campeonatos.includes(competition))).sort((a,b)=>sort==="win"?b.win_partida-a.win_partida||b.partidas-a.partidas:sort==="eco"?b.eco_delta-a.eco_delta:b.partidas-a.partidas),[teams,query,competition,sort]);

 return <>

 {/* =========================================================
     PESQUISA E FILTROS
     Reúne os controles utilizados para localizar equipes,
     selecionar campeonatos e definir a ordem dos resultados.
     ========================================================= */}
 <div className="panel mt-7 flex flex-wrap gap-3 p-4"><label className="field flex min-w-[180px] flex-1 items-center gap-2 text-[#91aab3]"><Search size={17}/><input aria-label={text(locale,"Nome da equipe","Team name")} className="w-full bg-transparent text-sm text-white outline-none" placeholder={text(locale,"Pesquisar pelo nome...","Search by name...")} value={query} onChange={e=>setQuery(e.target.value)}/></label><label className="flex items-center gap-2 text-[#a8c0c7]"><SlidersHorizontal size={17}/><span className="sr-only">{text(locale,"Campeonato","Tournament")}</span><select className="field max-w-[225px] text-xs" value={competition} onChange={e=>setCompetition(e.target.value)}><option value="all">{text(locale,"Todos os campeonatos","All tournaments")}</option>{competitions.map(c=><option key={c} value={c}>{c}</option>)}</select></label><label className="sr-only" htmlFor="sort">{text(locale,"Ordenar por","Sort by")}</label><select id="sort" className="field text-xs" value={sort} onChange={e=>setSort(e.target.value)}><option value="partidas">{text(locale,"Mais partidas","Most matches")}</option><option value="win">{text(locale,"Maior taxa de vitória","Highest win rate")}</option><option value="eco">{text(locale,"Maior eco delta","Highest eco delta")}</option></select></div>

 {/* Exibe a quantidade de equipes encontradas após a aplicação dos filtros.
     Também esclarece que o filtro de campeonato considera a participação,
     enquanto as estatísticas representam todo o histórico da equipe. */}
 <p className="mt-4 text-xs text-[#95aeb6]">{text(locale,`${result.length} equipe(s) encontradas. Filtro de campeonato indica participação; as métricas abaixo consideram todo o histórico da equipe.`,`${result.length} team(s) found. The tournament filter indicates participation; metrics below cover each team's full history.`)}</p>

 {/* =========================================================
     LISTAGEM DE EQUIPES
     Apresenta os resultados em cartões responsivos.
     Cada cartão permite navegar até o perfil detalhado da equipe
     e consultar seus principais indicadores de desempenho.
     ========================================================= */}

 {/* Os cartões mostram o nome da equipe, a quantidade de partidas,
     o número de vitórias, o aproveitamento histórico e o eco delta.
     Também apresentam a quantidade de mapas e insights registrados.
     O link utiliza o slug para abrir o perfil correspondente. */}
 <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{result.map(t=><Link href={`/equipes/${t.slug}`} key={t.slug} className="panel group p-5 transition duration-200 hover:-translate-y-1 hover:border-[#7b515a]"><div className="flex items-start justify-between"><div className="grid size-11 place-items-center rounded-lg bg-[#ff46551c] text-xl font-black text-[#ff7681]">{t.nome[0]}</div><ArrowUpRight size={18} className="text-[#849ca6] transition group-hover:text-[#ff6976]"/></div><h2 className="mt-5 text-lg font-black tracking-tight group-hover:text-[#ff8690]">{t.nome}</h2><p className="mt-2 text-xs text-[#90a6ae]">{num(t.partidas,locale)} {text(locale,"partidas","matches")} · {num(t.vitorias,locale)} {text(locale,"vitórias","wins")}</p><div className="mt-5 flex justify-between gap-4 border-t border-[#2c3d46] pt-4"><div><p className="text-[10px] text-[#91a6ae]">{text(locale,"Aproveitamento","Win rate")}</p><p className="mt-1 text-xl font-black">{pct(t.win_partida,1,locale)}</p></div><div className="text-right"><p className="text-[10px] text-[#91a6ae]">Eco delta</p><p className={`mt-1 text-base font-black ${t.eco_delta>=0?"text-[#76ddbf]":"text-[#ff929a]"}`}>{signedPp(t.eco_delta,locale)}</p></div></div><p className="mt-3 text-[10px] text-[#7f9ca7]">{num(t.mapas.length,locale)} {text(locale,"mapas","maps")} · {num(t.n_insights.alerta+t.n_insights.forca+t.n_insights.info,locale)} {text(locale,"insights registrados","insights recorded")}</p></Link>)}

 {/* Mensagem exibida quando nenhuma equipe corresponde
     aos critérios de pesquisa e filtragem selecionados. */}
 {result.length===0&&<div className="panel col-span-full p-10 text-center text-[#9cb1b8]">{text(locale,"Nenhuma equipe corresponde aos filtros escolhidos.","No teams match the selected filters.")}</div>}</section>
 </>;
}
