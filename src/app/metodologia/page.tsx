
import { getLeague } from "@/lib/data";
import { pct } from "@/lib/format";
import { text } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

// Componente responsável pela página de metodologia do projeto.
// Apresenta a origem dos dados, os critérios utilizados nos cálculos
// estatísticos e as limitações das análises realizadas.
export default async function MethodPage(){const [league,locale]=await Promise.all([getLeague(),getLocale()]);return <>

 {/* Introdução da página de metodologia.
     Explica a origem dos dados e apresenta o fluxo de processamento
     responsável por transformar os JSONs em indicadores estatísticos. */}
 <div className="eyebrow">{text(locale,"Transparência / Método","Transparency / Methodology")}</div><h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">{text(locale,"Os dados por trás","The data behind")} <span className="text-[#ff5968]">{text(locale,"da análise.","the analysis.")}</span></h1><p className="mt-4 max-w-3xl text-sm leading-7 text-[#a5b9c0]">{text(locale,"O projeto utiliza exclusivamente os JSONs disponibilizados para o hackathon. Os indicadores são descritivos e produzidos localmente pelo pipeline","The project exclusively uses JSON files provided for the hackathon. Indicators are descriptive and produced locally by the pipeline")} <code className="text-white">processar.py → agregar.py</code>{text(locale,". Não há coleta de dados em tempo real.",". No real-time data is collected.")}</p>

 {/* Organiza as principais informações metodológicas em uma grade,
     permitindo compreender como os indicadores foram construídos. */}
 <div className="mt-8 grid gap-4 md:grid-cols-2">

  {/* Unidade de análise:
      apresenta a quantidade de partidas e rounds registrados.
      Como cada round possui uma observação para cada equipe,
      o total de rounds efetivos corresponde à metade dos registros.
      Isso também explica a taxa global de vitória de 50%. */}
  <div className="panel p-6"><div className="eyebrow">{text(locale,"01 / Unidade de análise","01 / Unit of analysis")}</div><h2 className="mt-2 text-xl font-black">{text(locale,"Rounds e observações","Rounds and observations")}</h2><p className="mt-3 text-sm leading-7 text-[#a2b9c0]">{text(locale,`São ${league.partidas} partidas e ${league.metricas.rounds/2} rounds efetivos. Cada round gera duas linhas no CSV `,`There are ${league.partidas} matches and ${league.metricas.rounds/2} actual rounds. Each round generates two rows in the CSV `)}<code>rounds_time.csv</code>{text(locale,`, uma por equipe. Por isso a taxa global de vitória por time-round é ${pct(league.metricas.win,1,locale)} por construção.`,`, one per team. Therefore, the overall win rate per team-round is ${pct(league.metricas.win,1,locale)} by construction.`)}</p></div>

  {/* Benchmark econômico:
      explica como o desempenho esperado é calculado utilizando
      as classes econômicas das equipes, dos adversários e o lado jogado.
      Quando a amostra é pequena, utiliza um agrupamento mais amplo
      para estabelecer a referência estatística. */}
  <div className="panel p-6"><div className="eyebrow">{text(locale,"02 / Benchmark","02 / Benchmark")}</div><h2 className="mt-2 text-xl font-black">{text(locale,"Vitória ajustada à economia","Economy-adjusted wins")}</h2><p className="mt-3 text-sm leading-7 text-[#a2b9c0]">{text(locale,"O resultado esperado é calculado pela frequência de vitórias em grupos de classe econômica própria, classe adversária e lado. Com menos de 40 observações por grupo, usa-se o agrupamento por classes econômicas.","Expected results are calculated from win frequency across groups of own economy class, opponent class, and side. Groups with fewer than 40 observations are combined by economy class.")}</p></div>

  {/* Classificação econômica:
      apresenta as regras utilizadas para identificar os tipos de compra.
      Essas classes são determinadas pelo valor médio dos equipamentos
      da equipe e não representam necessariamente seus gastos reais. */}
  <div className="panel p-6"><div className="eyebrow">{text(locale,"03 / Heurísticas","03 / Heuristics")}</div><h2 className="mt-2 text-xl font-black">{text(locale,"Classes econômicas","Economy classes")}</h2><p className="mt-3 text-sm leading-7 text-[#a2b9c0]">{locale==="en"?league.metodologia.classes_economia.replace("medio","average"):league.metodologia.classes_economia}. {text(locale,"Valores são calculados a partir do loadout médio de cada equipe, não de gastos efetivos em todas as situações.","Values are calculated from each team's average loadout, not actual spending in every situation.")}</p></div>

  {/* Análise comportamental:
      documenta a janela de tempo utilizada para identificar trades.
      Também esclarece que os papéis dos jogadores são estimados
      a partir de padrões estatísticos, sem representar funções oficiais. */}
  <div className="panel p-6"><div className="eyebrow">{text(locale,"04 / Comportamento","04 / Behavior")}</div><h2 className="mt-2 text-xl font-black">{text(locale,"Trades e papéis estimados","Trades and estimated roles")}</h2><p className="mt-3 text-sm leading-7 text-[#a2b9c0]">{text(locale,`Uma troca considera uma eliminação em até ${league.metodologia.trade_ms/1000} segundos. Perfis Entry, Lurker e Suporte são hipóteses baseadas em indicadores e z-scores, não identificações oficiais de funções.`,`A trade is counted when a kill occurs within ${league.metodologia.trade_ms/1000} seconds. Entry, Lurker, and Support profiles are hypotheses based on indicators and z-scores, not official role classifications.`)}</p></div>
 </div>

 {/* Limitações da análise:
     reforça que os resultados representam tendências históricas
     e que diferenças estatísticas não comprovam relações de causa.
     Também esclarece que os filtros da interface não modificam
     os indicadores agregados utilizados como referência. */}
 <div className="panel mt-5 p-6"><div className="eyebrow">{text(locale,"05 / Limitações","05 / Limitations")}</div><h2 className="mt-2 text-xl font-black">{text(locale,"Interpretação responsável","Responsible interpretation")}</h2><p className="mt-3 text-sm leading-7 text-[#a2b9c0]">{text(locale,"Correlações não demonstram causalidade. Diferenças com poucas observações podem ser ruído. Taxas de vitória variam com oponentes, contexto e composição. Nesta versão inicial, as métricas são históricas de toda a liga, e os filtros do diretório não recalculam os agregados. Os nomes e métricas dependem do tratamento originalmente fornecido.","Correlation does not imply causation. Differences based on few observations may be noise. Win rates vary with opponents, context, and team composition. In this initial version, metrics cover the entire league history, and directory filters do not recalculate aggregates. Names and metrics depend on the original data processing.")}</p></div>
 </>}
