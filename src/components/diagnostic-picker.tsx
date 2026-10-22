
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, UsersRound } from "lucide-react";
import type { TeamSummary } from "@/lib/types";
import type { Locale } from "@/lib/locale";
import { text } from "@/lib/locale";

// Componente responsável pela seleção da equipe que será analisada.
// Permite pesquisar os participantes disponíveis e acessar seus diagnósticos.
export function DiagnosticPicker({ teams, locale }: { teams: TeamSummary[]; locale: Locale }) {

  // Armazena o texto digitado pelo usuário no campo de pesquisa.
  const [pesquisa, setPesquisa] = useState("");

  // Filtra as equipes pelo nome, ignorando diferenças entre maiúsculas
  // e minúsculas. Os resultados são ordenados pela quantidade de partidas
  // e, em caso de empate, pelo nome da equipe.
  const filtradas = useMemo(() =>
    teams.filter(t => t.nome.toLocaleLowerCase("pt-BR").includes(pesquisa.toLocaleLowerCase("pt-BR").trim()))
      .sort((a,b) => b.partidas - a.partidas || a.nome.localeCompare(b.nome)),
    [pesquisa, teams]);

  // Renderiza o painel de seleção com pesquisa e listagem de equipes.
  return <section className="panel mt-8 overflow-hidden">

    {/* Cabeçalho da seção, apresentando sua finalidade
        e a quantidade total de equipes disponíveis para análise. */}
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2b3e46] px-5 py-5 sm:px-7">
      <div>
        <div className="eyebrow">{text(locale, "Equipe analisada", "Team to analyze")}</div>
        <h2 className="section-title mt-2">{text(locale, "Escolha uma equipe", "Choose a team")}</h2>
      </div>
      <span className="pill"><UsersRound size={13} className="mr-2" />{teams.length} {text(locale, "equipes com perfil", "teams with profiles")}</span>
    </div>

    {/* Campo de pesquisa controlado pelo estado pesquisa.
        A lista é atualizada automaticamente conforme o usuário digita. */}
    <div className="px-5 pb-3 pt-5 sm:px-7">
      <label className="field flex items-center gap-2">
        <Search size={17} className="shrink-0 text-[#8ca4ad]"/>
        <span className="sr-only">{text(locale, "Buscar equipe", "Search teams")}</span>
        <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#6f858f]" value={pesquisa}
          onChange={e=>setPesquisa(e.target.value)} placeholder={text(locale, "Buscar equipe pelo nome...", "Search teams by name...")} />
      </label>
    </div>

    {/* Apresenta as equipes encontradas em uma grade responsiva.
        Cada cartão funciona como um link para o diagnóstico individual. */}
    <div className="grid gap-2 px-5 pb-6 sm:grid-cols-2 sm:px-7 lg:grid-cols-3">
      {filtradas.map(t => <Link key={t.slug} href={`/diagnostico/${t.slug}`}
        className="group flex items-center gap-3 rounded-xl border border-[#2b414c] bg-[#101e26] p-3.5 transition-colors hover:border-[#70e4c3] hover:bg-[#192c34]">

        {/* Utiliza a primeira letra do nome como identificação visual da equipe. */}
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#ff46551a] text-sm font-black text-[#ff8590]">{t.nome.charAt(0)}</span>

        {/* Exibe o nome, a quantidade de partidas disputadas
            e o percentual histórico de vitórias da equipe. */}
        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{t.nome}</span><span className="mt-1 block text-[11px] text-[#98afb6]">{t.partidas} {text(locale, "partidas", "matches")} · {(t.win_partida*100).toFixed(0)}% {text(locale, "de vitórias", "wins")}</span></span>

        {/* Ícone que indica a possibilidade de acessar o perfil de diagnóstico. */}
        <ArrowUpRight size={16} className="shrink-0 text-[#6f9e9e] group-hover:text-[#70e4c3]"/>
      </Link>)}

      {/* Mensagem exibida quando nenhuma equipe corresponde à pesquisa. */}
      {!filtradas.length && <p className="py-6 text-sm text-[#9eb0b9]">{text(locale, "Nenhuma equipe corresponde à pesquisa.", "No teams match your search.")}</p>}
    </div>
  </section>;
}
