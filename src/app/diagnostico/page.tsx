
import type { Metadata } from "next";
import { Activity, ArrowRightLeft, ClipboardList, Target } from "lucide-react";
import Link from "next/link";
import { getTeams } from "@/lib/data";
import { DiagnosticPicker } from "@/components/diagnostic-picker";
import { getLocale } from "@/lib/locale-server";
import { text } from "@/lib/locale";

// Define os metadados da página de diagnóstico.
// O título e a descrição são apresentados conforme o idioma selecionado.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: "Valorant Observatory",
    description: text(locale,
      "Análise pós-partida com indicadores históricos, evidências e sugestões de revisão para equipes.",
      "Post-match analysis with historical metrics, evidence, and team review suggestions.",
    ),
  };
}

// Componente principal da página de diagnóstico.
// Carrega a lista de equipes e o idioma para montar a interface.
export default async function DiagnosticoPage() {

  // Busca as equipes disponíveis e a preferência de idioma em paralelo.
  const [times, locale] = await Promise.all([getTeams(), getLocale()]);

  return <>
    {/* Seção de apresentação da ferramenta de diagnóstico.
        Explica o objetivo da análise e como os dados históricos são utilizados. */}
    <section className="grid-hatch relative overflow-hidden rounded-xl border border-[#324650] bg-[#102029] px-6 py-10 sm:px-10 sm:py-14">
      <div className="absolute -right-16 top-[-90px] size-[250px] rotate-45 border-[36px] border-[#ff465516]" />
      <div className="relative z-10 max-w-3xl">
        <div className="eyebrow">Valorant Observatory / {text(locale, "Análise pós-partida", "Post-match analysis")}</div>
        <h1 className="mt-4 text-[clamp(32px,4.8vw,56px)] font-black uppercase leading-[1.06] tracking-[-.045em]">{text(locale, "Do número ao", "From numbers to")} <span className="text-[#ff5968]">{text(locale, "diagnóstico.", "diagnosis.")}</span></h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#adbec4]">{text(locale,
          "Identifique diferenças entre uma equipe e o histórico da liga, veja as evidências por trás de cada análise e encontre situações que valem uma revisão em treino.",
          "Spot differences between a team and the league's historical performance, review the evidence behind each analysis, and find situations worth revisiting in practice.",
        )}</p>
      </div>
    </section>

    {/* Apresenta os três pilares do diagnóstico:
        prioridades de melhoria, pontos fortes e plano de revisão. */}
    <section className="mt-6 grid gap-3 sm:grid-cols-3">

      {/* Destaca indicadores que estão abaixo das referências da liga,
          considerando uma quantidade mínima de dados para análise. */}
      <div className="panel p-5"><Target className="text-[#ff7581]" size={20}/><h2 className="mt-3 text-sm font-bold">{text(locale, "Prioridades", "Priorities")}</h2><p className="mt-2 text-xs leading-6 text-[#9bb0b9]">{text(locale, "Indicadores abaixo da referência, com amostra mínima para exibição.", "Metrics below the benchmark, with a minimum sample size for display.")}</p></div>

      {/* Apresenta métricas em que a equipe possui desempenho
          superior às médias históricas utilizadas como referência. */}
      <div className="panel p-5"><Activity className="text-[#70e4c3]" size={20}/><h2 className="mt-3 text-sm font-bold">{text(locale, "Pontos fortes", "Strengths")}</h2><p className="mt-2 text-xs leading-6 text-[#9bb0b9]">{text(locale, "Métricas acima do histórico geral da liga.", "Metrics above the league-wide historical average.")}</p></div>

      {/* Explica que as recomendações servem como apoio para revisão
          e treinamento, sem estabelecer relações de causa e efeito. */}
      <div className="panel p-5"><ClipboardList className="text-[#a7bfe7]" size={20}/><h2 className="mt-3 text-sm font-bold">{text(locale, "Plano de revisão", "Review plan")}</h2><p className="mt-2 text-xs leading-6 text-[#9bb0b9]">{text(locale, "Sugestões de investigação e treino, não afirmações sobre causas.", "Suggestions for investigation and practice, not claims about causes.")}</p></div>
    </section>

    {/* Exibe o seletor de equipes, permitindo escolher
        qual delas será analisada no diagnóstico individual. */}
    <DiagnosticPicker teams={times} locale={locale}/>

    {/* Disponibiliza um atalho para o comparador,
        caso o usuário queira analisar duas equipes lado a lado. */}
    <p className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[#91a8b1]"><ArrowRightLeft size={14}/> {text(locale, "Quer comparar duas equipes?", "Want to compare two teams?")} <Link className="font-bold text-[#80e5c9] hover:underline" href="/comparar">{text(locale, "Abrir comparador", "Open comparison")}</Link></p>
  </>;
}
