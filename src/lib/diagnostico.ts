
import type { League, TeamProfile, TeamSummary } from "@/lib/types";
import type { Locale } from "@/lib/locale";
import { text } from "@/lib/locale";

// Classifica cada resultado como ponto de atenção ou ponto forte da equipe.
export type TipoDiagnostico = "prioridade" | "ponto-forte";
// Define as informações de cada análise: evidência, sugestão, amostra e relevância.
export type DiagnosticoItem = {
  id: string;
  area: string;
  tipo: TipoDiagnostico;
  titulo: string;
  evidencia: string;
  acao: string;
  observacoes: number;
  diferencaPp: number;
  peso: number;
};
// Estrutura final enviada ao painel, com os resultados e o resumo da equipe.
export type Diagnostico = {
  itens: DiagnosticoItem[];
  totalPrioridades: number;
  totalFortalezas: number;
  resumo: { partidas: number; rounds: number; taxaVitoria: number; ecoDelta: number };
};

// Tipos auxiliares para acessar métricas que podem não existir em todos os perfis.
type Estatistica = { n: number; win: number | null };
type MetricasDetalhadas = TeamProfile["metricas"] & {
  full_vs_eco?: Estatistica;
  apos_pistola_ganha?: Estatistica;
  defesa?: { retake_n: number; retake_win: number | null };
};
type PerfilDetalhado = TeamProfile & {
  trades?: { mortes?: number; morte_trocada?: number | null };
};

// Formata proporções como porcentagens, respeitando o idioma selecionado.
const percentual = (n: number, locale: Locale) => `${(n * 100).toLocaleString(locale === "en" ? "en-US" : "pt-BR", {maximumFractionDigits:1,minimumFractionDigits:1})}%`;
// Formata a magnitude da diferença entre taxas em pontos percentuais.
const pontosPercentuais = (n: number, locale: Locale) => `${(Math.abs(n) * 100).toLocaleString(locale === "en" ? "en-US" : "pt-BR", {maximumFractionDigits:1,minimumFractionDigits:1})} ${locale === "en" ? "pp" : "p.p."}`;

/**
 * Análises DESCRITIVAS: nenhuma sugestão constitui previsão ou prova de causa.
 * Cada regra exige uma amostra mínima e contraste mínimo com o conjunto da liga.
 */
export function gerarDiagnostico(sum: TeamSummary, detail: TeamProfile, liga: League, locale: Locale = "pt-BR"): Diagnostico {
  // Separa as métricas da equipe e os valores de referência da liga.
  const itens: DiagnosticoItem[] = [];
  const m = detail.metricas as MetricasDetalhadas;
  const completo = detail as PerfilDetalhado;
  const lm = liga.metricas;

  // Aplica uma mesma regra de avaliação a diferentes indicadores históricos.
  function comparar({id, area, descricao, time, referencia, n, minimo, limiar, acaoFraca, acaoForte}: {
    id: string; area: string; descricao: string;
    time: number | null | undefined; referencia: number | null | undefined;
    n: number | null | undefined; minimo: number; limiar: number;
    acaoFraca: string; acaoForte: string;
  }) {
    // Ignora dados ausentes, inválidos ou com menos observações que o mínimo exigido.
    if (typeof time !== "number" || !Number.isFinite(time) ||
        typeof referencia !== "number" || !Number.isFinite(referencia) ||
        typeof n !== "number" || !Number.isFinite(n) || n < minimo) return;
    // Calcula o desvio da equipe em relação ao histórico geral da liga.
    const diferenca = time - referencia;
    // Só registra diferenças que ultrapassam o limiar definido para a métrica.
    if (Math.abs(diferenca) < limiar) return;
    const fraco = diferenca < 0;
    // Cria o diagnóstico e calcula seu peso com base no desvio e na amostra.
    itens.push({
      id, area, tipo: fraco ? "prioridade" : "ponto-forte",
      titulo: `${descricao}: ${text(locale, fraco ? "abaixo" : "acima", fraco ? "below" : "above")} ${text(locale, "da referência", "benchmark")}`,
      evidencia: `${percentual(time, locale)} ${text(locale, "da equipe vs.", "team vs.")} ${percentual(referencia, locale)} ${text(locale, "da liga · diferença de", "league · difference of")} ${pontosPercentuais(diferenca, locale)} · ${n.toLocaleString(locale === "en" ? "en-US" : "pt-BR")} ${text(locale, "observações.", "observations.")}`,
      acao: fraco ? acaoFraca : acaoForte,
      observacoes: n, diferencaPp: diferenca * 100,
      peso: Math.abs(diferenca) * Math.sqrt(n),
    });
  }

  // Ataque: exige pelo menos 30 rounds e diferença mínima de 7 pontos percentuais.
  comparar({
    id: "ataque", area: text(locale, "Lado", "Side"), descricao: text(locale, "Vitórias no ataque", "Attack-side wins"),
    time: m.atk.win, referencia: lm.atk.win, n: m.atk.n, minimo: 30, limiar: 0.07,
    acaoFraca: text(locale, "Revisar gravações de rounds ofensivos e mapear em quais situações as execuções deixam de gerar vantagem. Testar uma mudança de cada vez nos treinos.", "Review attacking-round footage and identify situations where executions fail to create an advantage. Test one change at a time in practice."),
    acaoForte: text(locale, "Registrar os padrões de ataque que funcionaram e verificar se continuam eficazes contra adversários e mapas diferentes.", "Document successful attacking patterns and check whether they remain effective against different opponents and on different maps."),
  });
  // Defesa: usa os mesmos critérios de amostra e diferença do ataque.
  comparar({
    id: "defesa", area: text(locale, "Lado", "Side"), descricao: text(locale, "Vitórias na defesa", "Defense-side wins"),
    time: m.def.win, referencia: lm.def.win, n: m.def.n, minimo: 30, limiar: 0.07,
    acaoFraca: text(locale, "Revisar posicionamentos iniciais, rotações e decisões após perder espaço. Selecionar rounds específicos para análise coletiva.", "Review opening positions, rotations, and decisions after losing map control. Select specific rounds for team review."),
    acaoForte: text(locale, "Documentar as configurações defensivas que funcionam e testar sua estabilidade em mapas e confrontos distintos.", "Document effective defensive setups and test how consistently they work across maps and matchups."),
  });
  // Pistola: considera amostras de 8 ou mais rounds e desvio de pelo menos 12 p.p.
  comparar({
    id: "pistola", area: text(locale, "Economia", "Economy"), descricao: text(locale, "Rounds de pistola", "Pistol rounds"),
    time: m.economia?.pistol?.win, referencia: lm.economia.pistol.win,
    n: m.economia?.pistol?.n, minimo: 8, limiar: 0.12,
    acaoFraca: text(locale, "Revisar planos de pistola, distribuição de habilidades e decisões de troca nas aberturas das metades.", "Review pistol-round plans, ability allocation, and trade decisions at the start of each half."),
    acaoForte: text(locale, "Preservar o protocolo de pistola que vem apresentando bons resultados e documentar suas principais variantes.", "Keep the pistol-round protocol that has been producing good results and document its main variations."),
  });
  // Conversão: avalia o round seguinte à vitória na pistola.
  comparar({
    id: "apos-pistola", area: text(locale, "Economia", "Economy"), descricao: text(locale, "Conversão após vencer a pistola", "Conversion after winning the pistol round"),
    time: m.apos_pistola_ganha?.win, referencia: lm.apos_pistola_ganha.win,
    n: m.apos_pistola_ganha?.n, minimo: 8, limiar: 0.12,
    acaoFraca: text(locale, "Revisar as decisões de compra e execução do round seguinte à pistola vencida, comparando os casos convertidos e perdidos.", "Review buy and execution decisions in the round after winning the pistol, comparing converted rounds with losses."),
    acaoForte: text(locale, "Registrar as compras e execuções mais usadas depois de vencer a pistola para preservar esse padrão de conversão.", "Document the most common buys and executions after winning the pistol round to preserve this conversion pattern."),
  });
  // Anti-eco: compara resultados em rounds com full buy contra compra econômica.
  comparar({
    id: "anti-eco", area: text(locale, "Economia", "Economy"), descricao: text(locale, "Full buy contra eco", "Full buy against an eco"),
    time: m.full_vs_eco?.win, referencia: lm.full_vs_eco.win,
    n: m.full_vs_eco?.n, minimo: 12, limiar: 0.08,
    acaoFraca: text(locale, "Rever os rounds de vantagem de armamento, especialmente abordagens isoladas e perdas de equipamento evitáveis.", "Review rounds with a weapon advantage, especially isolated approaches and avoidable equipment losses."),
    acaoForte: text(locale, "Manter os protocolos de rounds com superioridade de compra e conferir se não dependem de poucos confrontos.", "Maintain protocols for rounds with a buy advantage and check that they are not based on only a few matchups."),
  });
  // Abertura: compara a frequência de primeiras eliminações entre equipe e liga.
  comparar({
    id: "first-kill", area: text(locale, "Abertura", "Opening"), descricao: text(locale, "Primeira eliminação", "Opening kill"),
    time: m.abertura?.fk_rate, referencia: lm.abertura.fk_rate,
    n: m.abertura?.n, minimo: 50, limiar: 0.06,
    acaoFraca: text(locale, "Revisar duelos iniciais, suporte de habilidades e possibilidade de troca rápida. A estatística não identifica, sozinha, o motivo da diferença.", "Review opening duels, ability support, and opportunities for quick trades. This statistic alone cannot identify the reason for the difference."),
    acaoForte: text(locale, "Analisar como a equipe conquista aberturas e preservar as condições de suporte que aparecem nos rounds bem-sucedidos.", "Analyze how the team secures opening kills and preserve the supporting conditions seen in successful rounds."),
  });
  // Pós-plant: avalia o aproveitamento ofensivo após a spike ser plantada.
  comparar({
    id: "pos-plant", area: "Spike", descricao: text(locale, "Vitórias com spike plantada", "Wins after planting the spike"),
    time: m.ataque?.pos_plant_win, referencia: lm.ataque.pos_plant_win,
    n: m.ataque?.n_plants, minimo: 20, limiar: 0.10,
    acaoFraca: text(locale, "Selecionar rounds ofensivos com plant e revisar posicionamento, comunicação, utilização de habilidades e cobertura da spike.", "Select attacking rounds with a spike plant and review positioning, communication, ability usage, and spike coverage."),
    acaoForte: text(locale, "Catalogar as configurações de pós-plant mais frequentes e verificar sua eficácia por mapa e adversário.", "Catalog the most common post-plant setups and check their effectiveness by map and opponent."),
  });
  // Trocas: analisa a proporção de mortes respondidas em até cinco segundos.
  comparar({
    id: "trade", area: text(locale, "Coletivo", "Team play"), descricao: text(locale, "Mortes trocadas em até 5 segundos", "Deaths traded within 5 seconds"),
    time: completo.trades?.morte_trocada, referencia: liga.trade_liga,
    n: completo.trades?.mortes, minimo: 80, limiar: 0.06,
    acaoFraca: text(locale, "Revisar rounds com mortes não trocadas e observar distâncias entre aliados, oportunidades de cobertura e comunicação.", "Review rounds with untraded deaths and look at teammate spacing, opportunities for cover, and communication."),
    acaoForte: text(locale, "Usar os rounds com trocas rápidas como exemplos de sincronização e avaliar se o padrão se mantém em outros mapas.", "Use rounds with quick trades as examples of coordination and assess whether the pattern holds on other maps."),
  });

  // eco_delta é taxa real menos taxa esperada com base em classe de compra, oponente e lado.
  // Destaca resultados econômicos com pelo menos 80 rounds e desvio de 4,5 p.p.
  if (Number.isFinite(m.eco_delta) && m.rounds >= 80 && Math.abs(m.eco_delta) >= 0.045) {
    const ruim = m.eco_delta < 0;
    itens.push({
      id: "economia-ajustada", area: text(locale, "Economia", "Economy"), tipo: ruim ? "prioridade" : "ponto-forte",
      titulo: text(locale, `Resultado ajustado à economia ${ruim ? "abaixo" : "acima"} do esperado`, `Economy-adjusted result ${ruim ? "below" : "above"} expected`),
      evidencia: `${text(locale, "Diferença de", "Difference of")} ${pontosPercentuais(m.eco_delta, locale)} ${text(locale, ruim ? "abaixo" : "acima", ruim ? "below" : "above")} ${text(locale, "da taxa esperada segundo classe de compra, classe adversária e lado ·", "the expected rate based on buy class, opponent buy class, and side ·")} ${m.rounds.toLocaleString(locale === "en" ? "en-US" : "pt-BR")} ${text(locale, "rounds da equipe.", "team rounds.")}`,
      acao: ruim
        ? text(locale, "Rever amostras de rounds com cada classe de compra. Investigar decisões e execuções sem presumir que a economia explique toda a diferença.", "Review round samples for each buy class. Investigate decisions and executions without assuming the economy explains the entire difference.")
        : text(locale, "Verificar quais decisões se repetem nos rounds com bom desempenho ajustado e se o resultado persiste em diferentes adversários.", "Check which decisions recur in rounds with strong economy-adjusted performance and whether the result persists against different opponents."),
      observacoes: m.rounds, diferencaPp: m.eco_delta * 100,
      peso: Math.abs(m.eco_delta) * Math.sqrt(m.rounds),
    });
  }

  // O próprio agregador produz insights adicionais; esta função não substitui sua metodologia.
  // Exibe primeiro as diferenças de maior peso; em empate, ordena pelo identificador.
  itens.sort((a, b) => b.peso - a.peso || a.id.localeCompare(b.id));
  // Retorna os diagnósticos e os totais usados pelos cartões de resumo.
  return {
    itens,
    totalPrioridades: itens.filter(x => x.tipo === "prioridade").length,
    totalFortalezas: itens.filter(x => x.tipo === "ponto-forte").length,
    resumo: { partidas: sum.partidas, rounds: m.rounds, taxaVitoria: sum.win_partida, ecoDelta: m.eco_delta },
  };
}
