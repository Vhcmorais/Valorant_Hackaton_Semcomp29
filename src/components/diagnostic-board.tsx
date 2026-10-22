
"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BookOpenText, CheckCircle2, ChevronDown, ClipboardCheck, Info, SearchCheck } from "lucide-react";
import type { DiagnosticoItem, Diagnostico } from "@/lib/diagnostico";
import type { TeamProfile } from "@/lib/types";
import type { Locale } from "@/lib/locale";
import { text } from "@/lib/locale";
import { insightArea, insightText, insightTitle } from "@/lib/insight-locale";
import { num, pct, signedPp } from "@/lib/format";

// Define os filtros disponíveis para visualizar os resultados do diagnóstico.
type Filtro = "tudo" | "prioridade" | "ponto-forte";

// Associa cada filtro ao seu nome de exibição, respeitando o idioma selecionado.
const nomes: Record<Filtro, (locale: Locale) => string> = {
  tudo: locale => text(locale, "Todos", "All"),
  prioridade: locale => text(locale, "Pontos de atenção", "Areas to improve"),
  "ponto-forte": locale => text(locale, "Pontos fortes", "Strengths"),
};

// Componente responsável por apresentar individualmente cada resultado
// do diagnóstico, diferenciando pontos de atenção e pontos fortes.
function Item({ item, indice, locale }: { item: DiagnosticoItem; indice: number; locale: Locale }) {

  // Identifica se o indicador representa uma prioridade de melhoria.
  // Essa informação também determina as cores e o ícone do cartão.
  const problema = item.tipo === "prioridade";

  return <article className={`overflow-hidden rounded-xl border p-5 ${problema ? "border-[#503841] bg-[#ff465509]" : "border-[#2e504c] bg-[#70e4c307]"}`}>

    {/* Cabeçalho do indicador, contendo sua classificação,
        área de análise e diferença percentual observada. */}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`grid size-10 place-items-center rounded-lg ${problema ? "bg-[#ff465522] text-[#ff8794]" : "bg-[#70e4c31c] text-[#70e4c3]"}`}>
          {problema ? <AlertTriangle size={18}/> : <CheckCircle2 size={18}/>}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9cabb3]">{item.area} · {problema ? text(locale, "Ponto de atenção", "Area to improve") : text(locale, "Ponto forte", "Strength")} #{indice + 1}</p>
          <h3 className="mt-1 text-base font-extrabold leading-6 text-[#f0f5f4]">{item.titulo}</h3>
        </div>
      </div>
      <div className={`rounded-lg border px-3 py-2 text-xs font-black tabular-nums ${problema ? "border-[#6b3c47] text-[#ff8b98]" : "border-[#39675d] text-[#84e6ca]"}`}>{signedPp(item.diferencaPp/100)}</div>
    </div>

    {/* Apresenta as evidências utilizadas na análise e uma sugestão
        de revisão que pode orientar a investigação da equipe. */}
    <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr]">

      {/* Evidências estatísticas e quantidade de registros
          considerados na identificação do indicador. */}
      <div className="rounded-lg border border-[#2e434c] bg-[#08172090] p-4">
        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[#97c7dc]"><SearchCheck size={15}/> {text(locale, "Evidências", "Evidence")}</p>
        <p className="mt-2 text-xs leading-6 text-[#cad6d8]">{item.evidencia}</p>
        <p className="mt-2 text-[10px] text-[#849ca6]">{text(locale, "Amostra:", "Sample:")} {num(item.observacoes, locale)} {text(locale, "registros da equipe", "team records")}</p>
      </div>

      {/* Sugestão de revisão gerada a partir do resultado encontrado.
          A proposta é orientar análises e treinos, sem afirmar causas. */}
      <div className="rounded-lg border border-[#2e434c] bg-[#08172090] p-4">
        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide text-[#9be4ce]"><ClipboardCheck size={15}/> {text(locale, "Sugestão de revisão", "Review suggestion")}</p>
        <p className="mt-2 text-xs leading-6 text-[#cad6d8]">{item.acao}</p>
      </div>
    </div>
  </article>;
}

// Componente principal do painel de diagnóstico.
// Organiza o resumo estatístico, os resultados identificados
// e os insights produzidos pelo processamento original.
export function DiagnosticBoard({diagnostico, insights, locale}: {
  diagnostico: Diagnostico;
  insights: TeamProfile["insights"];
  locale: Locale;
}) {

  // Armazena o filtro escolhido pelo usuário.
  const [filtro,setFiltro] = useState<Filtro>("tudo");

  // Seleciona apenas os indicadores correspondentes ao filtro ativo.
  // O resultado é recalculado somente quando os dados ou o filtro mudam.
  const filtrados = useMemo(() => diagnostico.itens.filter(i => filtro === "tudo" || i.tipo === filtro),[diagnostico.itens,filtro]);

  // Organiza os resultados para apresentar primeiro os pontos de atenção
  // e depois os pontos fortes identificados no desempenho da equipe.
  const ordenados = useMemo(() => [
    ...filtrados.filter(i=>i.tipo === "prioridade"), ...filtrados.filter(i=>i.tipo === "ponto-forte")
  ],[filtrados]);

  return <>

    {/* =========================================================
        RESUMO DO DIAGNÓSTICO
        Apresenta os principais números da equipe e a quantidade
        de pontos de atenção e pontos fortes identificados.
        ========================================================= */}
    <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label={text(locale, "Resumo do diagnóstico", "Diagnostic summary")}>

      {/* Quantidade de partidas consideradas no histórico da equipe. */}
      <div className="panel p-5"><p className="text-xs text-[#91a9b2]">{text(locale, "Partidas", "Matches")}</p><p className="mt-2 text-3xl font-black">{num(diagnostico.resumo.partidas, locale)}</p></div>

      {/* Taxa histórica de vitórias em partidas. */}
      <div className="panel p-5"><p className="text-xs text-[#91a9b2]">{text(locale, "Vitórias em partidas", "Match win rate")}</p><p className="mt-2 text-3xl font-black">{pct(diagnostico.resumo.taxaVitoria, 1, locale)}</p></div>

      {/* Total de indicadores classificados como prioridades de melhoria. */}
      <div className="panel p-5"><p className="text-xs text-[#91a9b2]">{text(locale, "Pontos de atenção", "Areas to improve")}</p><p className="mt-2 text-3xl font-black text-[#ff8b98]">{diagnostico.totalPrioridades}</p></div>

      {/* Total de indicadores classificados como pontos fortes. */}
      <div className="panel p-5"><p className="text-xs text-[#91a9b2]">{text(locale, "Pontos fortes", "Strengths")}</p><p className="mt-2 text-3xl font-black text-[#8de9ce]">{diagnostico.totalFortalezas}</p></div>
    </section>

    {/* =========================================================
        ANÁLISE DOS INDICADORES
        Permite visualizar os resultados do diagnóstico
        e filtrar os pontos fortes ou as prioridades.
        ========================================================= */}
    <section className="mt-8" id="analises">
      <div className="flex flex-wrap items-end justify-between gap-3">

        {/* Título e observação sobre a natureza descritiva
            das comparações realizadas com o histórico da liga. */}
        <div><div className="eyebrow">{text(locale, "Diagnóstico estatístico", "Statistical diagnostics")}</div><h2 className="section-title mt-2">{text(locale, "O que merece atenção", "What needs attention")}</h2><p className="mt-2 text-xs leading-6 text-[#9bafb8]">{text(locale, "Comparações descritivas com a liga inteira. Diferenças não comprovam causas nem preveem resultados futuros.", "Descriptive comparisons with the entire league. Differences do not prove causes or predict future results.")}</p></div>

        {/* Campo de seleção que atualiza o filtro dos diagnósticos
            sem precisar recarregar a página. */}
        <div className="relative"><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3 text-[#a7b9c0]"/><select aria-label={text(locale, "Filtrar diagnósticos", "Filter diagnostics")} className="field appearance-none pr-10 text-xs" value={filtro} onChange={e=>setFiltro(e.target.value as Filtro)}>{(Object.keys(nomes) as Filtro[]).map(k=><option key={k} value={k}>{nomes[k](locale)}</option>)}</select></div>
      </div>

      {/* Renderiza os indicadores filtrados utilizando o componente Item.
          Caso nenhum resultado atenda aos critérios, exibe uma orientação. */}
      <div className="mt-5 space-y-3">{ordenados.map((item,i)=><Item item={item} indice={i} locale={locale} key={item.id}/>)}
        {ordenados.length === 0 && <div className="panel flex items-start gap-3 p-6"><Info size={20} className="shrink-0 text-[#70e4c3]"/><div><p className="font-bold">{text(locale, "Nenhum desvio relevante neste filtro", "No relevant deviations for this filter")}</p><p className="mt-2 text-xs leading-6 text-[#a2b6bf]">{text(locale, "Os critérios mínimos de amostra e diferença não foram atingidos. Isso não significa desempenho perfeito ou ausência de aspectos a melhorar.", "The minimum sample-size and difference thresholds were not met. This does not imply perfect performance or that there is nothing to improve.")}</p></div></div>}
      </div>
    </section>

    {/* =========================================================
        INSIGHTS DO PROCESSAMENTO ORIGINAL
        Apresenta as observações geradas pelo agregar.py,
        mantendo esses resultados separados do diagnóstico atual.
        ========================================================= */}
    <section className="panel mt-8 overflow-hidden" aria-label={text(locale, "Insights do processamento original", "Insights from the original processing")}>

      {/* Utiliza details para permitir expandir ou recolher
          a lista de insights sem precisar gerenciar um estado adicional. */}
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-3"><BookOpenText size={19} className="text-[#8fe1cb]"/><div><p className="eyebrow">{text(locale, "Análise existente", "Existing analysis")}</p><h2 className="mt-1 text-base font-extrabold">{text(locale, "Insights gerados pelo agregar.py", "Insights generated by agregar.py")} ({insights.length})</h2></div></div>
          <ChevronDown size={18} className="shrink-0 text-[#a3b6be] transition-transform group-open:rotate-180"/>
        </summary>

        {/* Percorre os insights recebidos e apresenta suas informações.
            Os nomes das áreas, títulos e textos são adaptados ao idioma
            selecionado pelas funções de tradução correspondentes. */}
        <div className="grid gap-3 border-t border-[#30404a] p-5 sm:grid-cols-2 sm:p-6">
          {insights.map((ins,i)=><div key={`${ins.area}-${ins.titulo}-${i}`} className="rounded-xl border border-[#2e444f] bg-[#0b1a22] p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#87d8c5]">{insightArea(ins.area, locale)} · {ins.tipo === "alerta" ? text(locale, "Atenção", "Alert") : ins.tipo === "forca" ? text(locale, "Ponto forte", "Strength") : text(locale, "Informação", "Information")}</p>
            <h3 className="mt-2 text-sm font-bold">{insightTitle(ins.titulo, locale)}</h3>
            <p className="mt-2 text-xs leading-6 text-[#a9bbc2]">{insightText(ins.texto, locale)}</p>
          </div>)}

          {/* Mensagem apresentada quando o processamento original
              não produziu insights adicionais para a equipe. */}
          {insights.length===0 && <p className="text-xs text-[#a2b5bd]">{text(locale, "O agregador não ativou insights adicionais para esta equipe.", "The aggregator did not generate additional insights for this team.")}</p>}
        </div>

        {/* Esclarece que os insights são preservados do processamento
            original e que informações voltadas à análise de adversários
            não são apresentadas como recomendações de treino. */}
        <p className="px-5 pb-5 text-[11px] leading-5 text-[#93a8af]">{text(locale, "As observações acima são preservadas do processamento original. Não exibimos o campo “contra”, destinado à análise de um adversário; ele não é uma recomendação de treino para esta equipe.", "The observations above are preserved from the original processing. We do not display the “against” field, which is intended for opponent analysis; it is not a practice recommendation for this team.")}</p>
      </details>
    </section>
  </>;
}
