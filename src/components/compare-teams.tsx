
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, ArrowLeftRight, ArrowUpRight, BarChart3, CheckCircle2,
  ChevronDown, Database, Info, Map as MapIcon, Swords, TrendingUp,
} from "lucide-react";
import {
  PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Tooltip,
} from "recharts";
import type { TeamProfile, TeamSummary } from "@/lib/types";
import type { Locale } from "@/lib/locale";
import { text } from "@/lib/locale";
import { mapName, num, pct, signedPp } from "@/lib/format";

// Define as métricas percentuais utilizadas nas comparações entre equipes.
type PercentKey = "win_partida" | "win_rounds" | "atk" | "def" | "pistola";

// Centraliza os nomes e as descrições dos indicadores nos dois idiomas.
const getIndicadores = (locale: Locale) => [
  { key: "win_partida" as const, titulo: text(locale, "Vitórias em partidas", "Match wins"), curto: text(locale, "Partidas", "Matches"), descricao: text(locale, "Partidas vencidas / partidas disputadas", "Matches won / matches played") },
  { key: "win_rounds" as const, titulo: text(locale, "Vitórias em rounds", "Round wins"), curto: text(locale, "Rounds", "Rounds"), descricao: text(locale, "Rounds vencidos / rounds disputados", "Rounds won / rounds played") },
  { key: "atk" as const, titulo: text(locale, "Desempenho no ataque", "Attack performance"), curto: text(locale, "Ataque", "Attack"), descricao: text(locale, "Proporção de rounds vencidos no lado atacante", "Share of rounds won on the attacking side") },
  { key: "def" as const, titulo: text(locale, "Desempenho na defesa", "Defense performance"), curto: text(locale, "Defesa", "Defense"), descricao: text(locale, "Proporção de rounds vencidos no lado defensor", "Share of rounds won on the defending side") },
  { key: "pistola" as const, titulo: text(locale, "Rounds de pistola", "Pistol rounds"), curto: text(locale, "Pistola", "Pistol"), descricao: text(locale, "Proporção de rounds de pistola vencidos", "Share of pistol rounds won") },
];

// Mantém cores fixas para distinguir visualmente as equipes A e B.
const corA = "#ff5968";
const corB = "#70e4c3";

// Reaproveita os tipos do perfil para comparar mapas presentes nas duas equipes.
type MapaEquipe = TeamProfile["mapas"][number];
type MapaComum = { mapa: string; a: MapaEquipe; b: MapaEquipe };

// Calcula a diferença absoluta entre duas taxas e a apresenta em pontos percentuais.
function diferenca(a: number, b: number, locale: Locale) {
  return `${Math.abs((a - b) * 100).toLocaleString(locale === "en" ? "en-US" : "pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${locale === "en" ? "pp" : "p.p."}`;
}

// Seletor de equipes; bloqueia a escolha daquela já definida no outro campo.
function SeletorEquipe({
  label, value, onChange, teams, blocked, locale,
}: {
  label: string;
  value: string;
  onChange: (slug: string) => void;
  teams: TeamSummary[];
  blocked: string;
  locale: Locale;
}) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[.15em] text-[#a6bac2]">{label}</span>
      <span className="relative block">
        <select
          className="field w-full appearance-none pr-10 text-sm font-bold"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`Selecionar ${label.toLowerCase()}`}
        >
          {teams.map((t) => <option key={t.slug} value={t.slug} disabled={t.slug === blocked}>{t.nome} · {num(t.partidas, locale)} {text(locale, "partidas", "matches")}</option>)}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-3 text-[#a6bac2]" />
      </span>
    </label>
  );
}

// Exibe o resumo de uma equipe, incluindo partidas, vitórias e campeonatos.
function CartaoEquipe({ team, tint, letter, locale }: { team: TeamSummary; tint: string; letter: string; locale: Locale }) {
  return (
    <div className="panel relative flex min-w-0 flex-col gap-5 overflow-hidden p-5 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: tint }} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-lg text-lg font-black text-[#0d1a21]" style={{ backgroundColor: tint }}>{letter}</div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#95aeb5]">{text(locale, "Equipe", "Team")} {letter}</p>
            <h2 className="mt-1 break-words text-xl font-black leading-tight sm:text-2xl">{team.nome}</h2>
          </div>
        </div>
        <Link href={`/equipes/${team.slug}`} aria-label={`${text(locale, "Abrir perfil de", "Open profile for")} ${team.nome}`} className="shrink-0 rounded-md p-2 text-[#b5c7cc] hover:bg-white/5 hover:text-white"><ArrowUpRight size={18} /></Link>
      </div>
      <div className="grid grid-cols-3 gap-3 border-t border-[#29404a] pt-4">
        <div><div className="text-[10px] text-[#96aab4]">{text(locale, "Partidas", "Matches")}</div><div className="mt-1 text-xl font-black">{num(team.partidas, locale)}</div></div>
        <div><div className="text-[10px] text-[#96aab4]">{text(locale, "Vitórias", "Wins")}</div><div className="mt-1 text-xl font-black">{num(team.vitorias, locale)}</div></div>
        <div><div className="text-[10px] text-[#96aab4]">{text(locale, "Taxa", "Rate")}</div><div className="mt-1 text-xl font-black" style={{ color: tint }}>{pct(team.win_partida, 1, locale)}</div></div>
      </div>
      <p className="text-[11px] leading-5 text-[#92aab3]">{team.campeonatos.join(" · ")}</p>
    </div>
  );
}

// Mostra duas taxas lado a lado, acompanhadas de barras proporcionais.
function ComparacaoLinha({ a, b, titulo, descricao, locale }: { a: number; b: number; titulo: string; descricao: string; locale: Locale }) {
  const same = Math.abs(a - b) < 0.00005;
  return (
    <div className="border-b border-[#273a44] py-5 last:border-b-0">
      <div className="mb-3 text-center">
        <div className="text-xs font-black text-[#e6f0ef]">{titulo}</div>
        <div className="mt-1 text-[10px] text-[#8da5ad]">{descricao}</div>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm font-black sm:gap-5">
        <div className="text-right" style={{ color: corA }}>{pct(a)}</div>
        <span className="text-[10px] font-semibold text-[#78939c]">{same ? text(locale, "igual", "equal") : diferenca(a, b, locale)}</span>
        <div style={{ color: corB }}>{pct(b)}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex h-2 justify-end overflow-hidden rounded-full bg-[#253740]">
          <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, a * 100))}%`, backgroundColor: corA }} />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#253740]">
          <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, b * 100))}%`, backgroundColor: corB }} />
        </div>
      </div>
    </div>
  );
}

// Compara cinco indicadores históricos em uma mesma escala percentual.
function PainelRadar({ a, b, locale }: { a: TeamSummary; b: TeamSummary; locale: Locale }) {

  // Converte as proporções para percentuais usados nos eixos do radar.
  const chart = getIndicadores(locale).map((item) => ({
    indicador: item.curto,
    ["timeA"]: Number((a[item.key] * 100).toFixed(2)),
    ["timeB"]: Number((b[item.key] * 100).toFixed(2)),
  }));
  return (
    <section className="panel min-w-0 p-5 sm:p-6">
      <div className="eyebrow">01 / {text(locale, "Perfil de desempenho", "Performance profile")}</div>
      <h2 className="section-title mt-2">{text(locale, "Comparação visual", "Visual comparison")}</h2>
      <p className="mt-2 text-xs leading-6 text-[#9eb2ba]">{text(locale, "Cinco taxas históricas em uma escala comum de 0 a 100%. Quanto maior o eixo, maior a taxa observada.", "Five historical rates on a shared 0–100% scale. A larger axis indicates a higher observed rate.")}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-bold">
        <span className="inline-flex items-center gap-2" style={{ color: corA }}><span className="size-2.5 rounded-sm" style={{ backgroundColor: corA }} />{a.nome}</span>
        <span className="inline-flex items-center gap-2" style={{ color: corB }}><span className="size-2.5 rounded-sm" style={{ backgroundColor: corB }} />{b.nome}</span>
      </div>
      <div className="mt-3 h-[300px] w-full sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chart} outerRadius="69%">
            <PolarGrid stroke="#34505a" />
            <PolarAngleAxis dataKey="indicador" tick={{ fill: "#b3c9cb", fontSize: 11, fontWeight: 600 }} />
            <PolarRadiusAxis domain={[0, 100]} tickCount={5} tick={{ fill: "#78949c", fontSize: 9 }} angle={90} axisLine={false} />
            <Radar name={a.nome} dataKey="timeA" stroke={corA} strokeWidth={2} fill={corA} fillOpacity={0.18} />
            <Radar name={b.nome} dataKey="timeB" stroke={corB} strokeWidth={2} fill={corB} fillOpacity={0.16} />
            <Tooltip
              contentStyle={{ background: "#12232b", border: "1px solid #36515c", color: "#edf5f4", borderRadius: 9, fontSize: 12 }}
              formatter={(value) => `${Number(value).toLocaleString(locale === "en" ? "en-US" : "pt-BR", { maximumFractionDigits: 1 })}%`}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-[10px] leading-5 text-[#8da5ad]"><Info size={12} className="mr-1 inline-block" />{text(locale, "Os valores não foram ajustados pela força dos adversários. O radar é descritivo, não uma previsão de confronto.", "Values are not adjusted for opponent strength. The radar is descriptive, not a matchup prediction.")}</p>
    </section>
  );
}

// Identifica as maiores diferenças observadas e monta comentários descritivos.
function AnaliseDescritiva({ a, b, locale }: { a: TeamSummary; b: TeamSummary; locale: Locale }) {
  const destaques: { titulo: string; texto: string }[] = [];
  const candidates: { key: PercentKey; nome: string }[] = [
    { key: "win_partida", nome: text(locale, "taxa de vitórias em partidas", "match win rate") },
    { key: "atk", nome: text(locale, "taxa de vitórias no ataque", "attack win rate") },
    { key: "def", nome: text(locale, "taxa de vitórias na defesa", "defense win rate") },
    { key: "pistola", nome: text(locale, "taxa de vitórias nos rounds de pistola", "pistol-round win rate") },
  ];

  // Ordena os indicadores por diferença absoluta para destacar os mais distintos.
  const sorted = candidates.map((item) => ({ ...item, delta: a[item.key] - b[item.key] }))
    .sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
  for (const c of sorted.slice(0, 3)) {
    if (Math.abs(c.delta) < 0.001) continue;
    const better = c.delta > 0 ? a : b;
    destaques.push({
      titulo: `${text(locale, "Destaque", "Standout")}: ${better.nome}`,
      texto: locale === "en"
        ? `${better.nome} leads by ${diferenca(a[c.key], b[c.key], locale)} in ${c.nome}, based on the matches available for each team.`
        : `${better.nome} registra ${diferenca(a[c.key], b[c.key], locale)} a mais na ${c.nome}, considerando as partidas disponíveis de cada equipe.`,
    });
  }

  // Acrescenta a comparação do desempenho ajustado às condições econômicas.
  const economia = a.eco_delta - b.eco_delta;
  if (Math.abs(economia) >= 0.01) {
    const melhor = economia > 0 ? a : b;
    destaques.push({
      titulo: text(locale, "Eficiência econômica ajustada", "Economy-adjusted efficiency"),
      texto: `${melhor.nome} ${text(locale, "tem um desvio de vitórias", "has a win-rate deviation")} ${diferenca(a.eco_delta, b.eco_delta, locale)} ${text(locale, "maior em relação à expectativa baseada nas classes de compra e no lado dos rounds.", "higher than expected based on buy classes and round side.")}`,
    });
  }
  return (
    <section className="panel p-5 sm:p-6">
      <div className="eyebrow">03 / {text(locale, "Interpretação", "Interpretation")}</div>
      <h2 className="section-title mt-2">{text(locale, "Leitura comparativa", "Comparative analysis")}</h2>
      <p className="mt-2 text-xs leading-6 text-[#a1b8bf]">{text(locale, "Diferenças calculadas a partir dos indicadores consolidados pelo seu processamento.", "Differences calculated from the metrics consolidated by your data processing.")}</p>
      <div className="mt-5 space-y-3">
        {destaques.map((d, i) => (
          <div key={i} className="rounded-xl border border-[#30444c] bg-[#1a2a32] p-4">
            <div className="flex items-start gap-3"><TrendingUp className="mt-0.5 shrink-0 text-[#72e2c4]" size={17} />
              <div><h3 className="text-sm font-bold">{d.titulo}</h3><p className="mt-1.5 text-xs leading-6 text-[#b0c0c5]">{d.texto}</p></div>
            </div>
          </div>
        ))}
        {!destaques.length && <p className="text-sm text-[#a0b7bf]">{text(locale, "As equipes têm resultados semelhantes nos indicadores selecionados.", "The teams have similar results across the selected metrics.")}</p>}
      </div>
      <div className="mt-5 flex gap-3 rounded-lg border border-[#5f4b37] bg-[#d6a55b0a] p-4 text-xs leading-6 text-[#d4c6ae]">
        <AlertCircle size={17} className="mt-0.5 shrink-0" />
        <p>{text(locale, "As equipes podem ter enfrentado adversários, mapas e quantidades de partidas diferentes. As diferenças não indicam quem venceria um confronto direto.", "The teams may have faced different opponents, maps, and numbers of matches. These differences do not indicate who would win a head-to-head matchup.")}</p>
      </div>
    </section>
  );
}

// Exibe o histórico de mapas em comum, com opção de incluir amostras pequenas.
function ComparacaoMapas({
  a, b, detailA, detailB, loading, locale,
}: {
  a: TeamSummary;
  b: TeamSummary;
  detailA: TeamProfile | null;
  detailB: TeamProfile | null;
  loading: boolean;
  locale: Locale;
}) {
  const [incluirPequenas, setIncluirPequenas] = useState(false);

  // Encontra mapas presentes em ambos os perfis e aplica o filtro de amostragem.
  const common: MapaComum[] = useMemo(() => {
    if (!detailA?.mapas || !detailB?.mapas) return [];
    const bm = new Map(detailB.mapas.map((m) => [m.mapa, m]));
    return detailA.mapas.filter((m) => bm.has(m.mapa))
      .map((m) => ({ mapa: m.mapa, a: m, b: bm.get(m.mapa)! }))
      .filter((m) => incluirPequenas || (m.a.partidas >= 3 && m.b.partidas >= 3))
      .sort((x, y) => (y.a.partidas + y.b.partidas) - (x.a.partidas + x.b.partidas));
  }, [detailA, detailB, incluirPequenas]);

  return (
    <section className="panel mt-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="eyebrow">04 / {text(locale, "Mapas", "Maps")}</div><h2 className="section-title mt-2">{text(locale, "Desempenho em mapas compartilhados", "Performance on shared maps")}</h2>
          <p className="mt-2 text-xs leading-6 text-[#98aeb5]">{text(locale, "Taxa de vitória em partidas por mapa, com a quantidade de jogos usada em cada cálculo.", "Match win rate by map, with the number of games used in each calculation.")}</p></div>
        <MapIcon size={22} className="text-[#71e3c4]" />
      </div>
      {loading ? <p className="mt-6 text-sm text-[#acbdc3]" role="status">{text(locale, "Carregando perfis detalhados...", "Loading detailed profiles...")}</p>
      : !detailA || !detailB ? <div className="mt-5 flex gap-3 rounded-xl border border-[#675339] p-4 text-xs leading-6 text-[#d2bea0]"><Database size={19} className="shrink-0"/><p>{text(locale, "Para comparar mapas, mantenha os arquivos", "To compare maps, make sure the files")} <code>public/dados/times/{a.slug}.json</code> {text(locale, "e", "and")} <code>public/dados/times/{b.slug}.json</code> {text(locale, "disponíveis. O comparador de indicadores gerais já funciona apenas com o", "are available. The general metrics comparison works with only")} <code>index.json</code>.</p></div>
      : <>
        <label className="mt-5 flex cursor-pointer items-center gap-2 text-xs text-[#bdccd0]"><input type="checkbox" checked={incluirPequenas} onChange={(e) => setIncluirPequenas(e.target.checked)} className="accent-[#ff4655]"/>{text(locale, "Exibir também mapas com menos de 3 partidas por equipe", "Also show maps with fewer than 3 matches per team")}</label>
        <div className="mt-5 space-y-4">
          {common.map((m) => (
            <div key={m.mapa} className="rounded-xl border border-[#31444c] p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-black">{mapName(m.mapa)}</h3>{(m.a.partidas < 3 || m.b.partidas < 3) && <span className="text-[10px] font-bold text-[#eac493]">{text(locale, "Amostra pequena", "Small sample")}</span>}</div>
              <div className="grid gap-4 sm:grid-cols-2">
                {([{ nome: a.nome, value: m.a, tint: corA }, { nome: b.nome, value: m.b, tint: corB }] as const).map((t) => (
                  <div key={t.nome}>
                    <div className="flex items-end justify-between gap-3 text-xs"><span className="truncate text-[#a6bbc1]" title={t.nome}>{t.nome}</span><strong style={{ color: t.tint }}>{pct(t.value.win_partida)}</strong></div>
                    <div className="mt-2 h-2 rounded-full bg-[#273943]"><div className="h-full rounded-full" style={{ width: `${Math.max(0, (t.value.win_partida ?? 0) * 100)}%`, background: t.tint }}/></div>
                    <p className="mt-1.5 text-[10px] text-[#8da3ac]">{num(t.value.vitorias, locale)} {text(locale, "vitórias em", "wins in")} {num(t.value.partidas, locale)} {text(locale, "partidas", "matches")}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {common.length === 0 && <div className="rounded-lg border border-[#31444c] p-4 text-sm text-[#a8bac2]">{text(locale, "Nenhum mapa compartilhado atende ao filtro de amostra. Ative a opção acima para incluir mapas com menos de 3 partidas.", "No shared maps meet the sample-size filter. Enable the option above to include maps with fewer than 3 matches.")}</div>}
        </div>
      </>}
    </section>
  );
}

// Componente principal: controla a seleção, carrega os perfis e organiza os painéis.
export function CompareTeams({ teams, locale }: { teams: TeamSummary[]; locale: Locale }) {
  const indicadores = getIndicadores(locale);

  // Ordena a lista sem modificar o array recebido por propriedades.
  const sortedTeams = useMemo(() => [...teams].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")), [teams]);

  // Armazena as equipes selecionadas e os perfis completos carregados pelo navegador.
  const [slugA, setSlugA] = useState(teams[0]?.slug ?? "");
  const [slugB, setSlugB] = useState(teams.find((t) => t.slug !== teams[0]?.slug)?.slug ?? "");
  const [detailA, setDetailA] = useState<TeamProfile | null>(null);
  const [detailB, setDetailB] = useState<TeamProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const a = teams.find((t) => t.slug === slugA);
  const b = teams.find((t) => t.slug === slugB);

  // Recarrega os perfis sempre que uma das equipes selecionadas mudar.
  useEffect(() => {
    if (!slugA || !slugB) return;
    let cancelled = false;
    setDetailA(null);
    setDetailB(null);
    setLoading(true);

    // Os arquivos detalhados são lidos localmente; falhas retornam um perfil vazio.
    const load = async (slug: string): Promise<TeamProfile | null> => {
      try {
        const response = await fetch(`/dados/times/${encodeURIComponent(slug)}.json`);
        return response.ok ? (await response.json()) as TeamProfile : null;
      } catch {
        return null;
      }
    };

    // Atualiza ambos os perfis juntos e evita alterações após a limpeza do efeito.
    Promise.all([load(slugA), load(slugB)]).then(([aa, bb]) => {
      if (!cancelled) { setDetailA(aa); setDetailB(bb); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [slugA, slugB]);

  // Sem duas equipes válidas, apresenta uma orientação para atualizar o índice.
  if (!a || !b) return <div className="panel p-6 text-sm text-[#b3c4c9]">{text(locale, "Não há duas equipes disponíveis no índice. Execute o agregador e atualize", "Fewer than two teams are available in the index. Run the aggregator and update")} <code>public/dados/index.json</code>.</div>;

  return (
    <div>

      {/* Apresentação da funcionalidade e de suas limitações. */}
      <div className="mb-7"><div className="eyebrow flex items-center gap-2"><Swords size={15} /> {text(locale, "Inteligência pós-partida", "Post-match intelligence")}</div>
        <h1 className="mt-3 text-[clamp(30px,4.8vw,52px)] font-black uppercase leading-[1.08] tracking-[-.055em]">{text(locale, "Comparador", "Team")} <span className="text-[#ff5968]">{text(locale, "de equipes.", "comparison.")}</span></h1>
        <p className="mt-4 max-w-[750px] text-sm leading-7 text-[#a3b9c0]">{text(locale, "Compare equipes com base nas quatro competições da base oficial. Visualize diferenças de desempenho, métricas de economia e histórico em mapas — sem previsões ou dados em tempo real.", "Compare teams using data from the four competitions in the official dataset. Explore performance differences, economy metrics, and map history — with no predictions or real-time data.")}</p>
      </div>

      {/* Seleção e inversão das equipes que serão comparadas. */}
      <div className="panel mb-5 flex flex-col items-stretch gap-3 p-4 sm:flex-row sm:items-end sm:p-5">
        <SeletorEquipe label={text(locale, "Equipe A", "Team A")} value={slugA} onChange={setSlugA} blocked={slugB} teams={sortedTeams} locale={locale} />
        <button type="button" className="flex h-[42px] shrink-0 items-center justify-center gap-2 self-center rounded-lg border border-[#42616c] px-4 text-xs font-bold text-[#d1e4e5] hover:bg-white/5 sm:self-auto" onClick={() => { setSlugA(slugB); setSlugB(slugA); }} aria-label={text(locale, "Inverter equipes", "Swap teams")}><ArrowLeftRight size={17} /><span className="sm:hidden">{text(locale, "Inverter", "Swap")}</span></button>
        <SeletorEquipe label={text(locale, "Equipe B", "Team B")} value={slugB} onChange={setSlugB} blocked={slugA} teams={sortedTeams} locale={locale} />
      </div>

      {/* Cartões de resumo e painéis com os indicadores principais. */}
      <div className="grid gap-4 lg:grid-cols-2"><CartaoEquipe team={a} tint={corA} letter="A" locale={locale} /><CartaoEquipe team={b} tint={corB} letter="B" locale={locale} /></div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PainelRadar a={a} b={b} locale={locale} />
        <section className="panel p-5 sm:p-6"><div className="eyebrow">02 / {text(locale, "Indicadores", "Metrics")}</div><h2 className="section-title mt-2">{text(locale, "Lado a lado", "Side by side")}</h2>
          <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-[.1em]"><span style={{ color: corA }}>{a.nome}</span><span style={{ color: corB }} className="text-right">{b.nome}</span></div>
          <div className="mt-3">{indicadores.map((item) => <ComparacaoLinha key={item.key} a={a[item.key]} b={b[item.key]} titulo={item.titulo} descricao={item.descricao} locale={locale}/>)}</div>
          <div className="mt-2 rounded-lg border border-[#304750] bg-[#162831] p-4">
            <p className="text-[11px] font-black text-[#c5d8d9]">{text(locale, "Eficiência econômica vs. esperado", "Economy efficiency vs. expected")}</p>
            <p className="mt-1 text-[10px] leading-5 text-[#879fa8]">{text(locale, "Diferença em pontos percentuais entre vitórias observadas e esperadas com base no tipo de compra, compra adversária e lado.", "Difference in percentage points between observed and expected wins, based on buy type, opponent buy, and side.")}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm font-black"><span style={{ color: corA }}>{signedPp(a.eco_delta, locale)}</span><span className="text-[10px] font-normal text-[#92aab1]">{text(locale, "Diferença:", "Difference:")} {diferenca(a.eco_delta, b.eco_delta, locale)}</span><span style={{ color: corB }}>{signedPp(b.eco_delta, locale)}</span></div>
          </div>
        </section>
      </div>

      {/* Diagnóstico das diferenças e histórico de desempenho por mapa. */}
      <div className="mt-5"><AnaliseDescritiva a={a} b={b} locale={locale} /></div>
      <ComparacaoMapas a={a} b={b} detailA={detailA} detailB={detailB} loading={loading} locale={locale} />

      {/* Aviso sobre a origem local dos dados e a natureza descritiva da análise. */}
      <div className="mt-5 flex flex-wrap items-start gap-3 rounded-xl border border-[#34464f] p-4 text-xs leading-6 text-[#9bb0b9]"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#70e4c3]" />{text(locale, "O comparador utiliza somente os JSONs locais do projeto. Os resultados são descritivos e não representam recomendações durante a partida nem garantia de vitória.", "The comparison uses only the project's local JSON files. Results are descriptive and are not in-game recommendations or a guarantee of victory.")}</div>
    </div>
  );
}
