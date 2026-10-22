
// Representa uma estatística de rounds, armazenando a quantidade
// de observações e a taxa de vitória, quando disponível.
export type RoundPair = { n: number; win: number | null };

// Define as informações resumidas de uma equipe.
// Esses dados são utilizados nos rankings, diretórios,
// cartões estatísticos e comparações entre equipes.
export type TeamSummary = {
  // Identificação da equipe, partidas disputadas e resultados gerais.
  slug: string; nome: string; partidas: number; vitorias: number;
  win_partida: number; campeonatos: string[]; rounds_pro: number; rounds_contra: number;

  // Indicadores de desempenho em rounds, ataque, defesa e pistola.
  win_rounds: number; atk: number; def: number; pistola: number;

  // Diferença entre o desempenho observado e o esperado pela economia,
  // além da lista de mapas disputados pela equipe.
  eco_delta: number; mapas: string[];

  // Quantidade de insights gerados em cada categoria.
  n_insights: { alerta: number; forca: number; info: number };
};

// Representa as estatísticas gerais de um mapa na liga,
// incluindo partidas e taxas de vitória no ataque e na defesa.
export type MapLeague = { mapa: string; partidas: number; atk: number; def: number };

// Define os indicadores associados às classes econômicas.
// Armazena a quantidade de observações, participação na amostra,
// taxa de vitória observada, resultado esperado e sua diferença.
export type EconomyStat = { n: number; share: number; win: number | null; esperado: number | null; delta: number | null };

// Estrutura que reúne os dados consolidados de toda a liga.
// É utilizada na página inicial, no dashboard e como referência
// para as análises comparativas e diagnósticos das equipes.
export type League = {

  // Quantidades gerais de partidas, equipes, jogadores e campeonatos.
  partidas: number; times: number; jogadores: number; campeonatos: string[];

  // Agrupa os principais indicadores estatísticos da liga.
  metricas: {

    // Total de registros de rounds, aproveitamento e eficiência econômica.
    rounds: number; win: number; eco_delta: number;

    // Estatísticas de vitórias nos lados atacante e defensor.
    atk: RoundPair; def: RoundPair;

    // Indicadores econômicos separados por tipo de compra.
    // Cada classe utiliza a estrutura definida em EconomyStat.
    economia: Record<"pistol" | "eco" | "semi" | "full", EconomyStat>;

    // Resultados de confrontos entre equipes com diferentes
    // condições econômicas, como full buy contra eco.
    full_vs_eco: RoundPair; eco_vs_full: RoundPair;

    // Avalia o resultado do round seguinte após vencer ou perder
    // a pistola, incluindo as classes econômicas registradas.
    apos_pistola_ganha: RoundPair; apos_pistola_perdida: RoundPair & { classes: Record<string, number> };

    // Estatísticas de abertura dos rounds, incluindo a frequência
    // de primeiras eliminações, vitórias associadas e tempo médio.
    abertura: { n: number; fk_rate: number; win_com_fk: number; win_sem_fk: number; tempo_fk_s: number };

    // Indicadores relacionados ao ataque e ao plant da spike.
    // Inclui frequência, tempo, distribuição por bombsite
    // e aproveitamento após a spike ser plantada.
    ataque: { plant_rate: number; plant_s: number; n_plants: number; sites: Record<string, number>; site_win: Record<string, number>; pos_plant_win: number };

    // Estatísticas relacionadas às tentativas e vitórias em retakes.
    defesa: { retake_n: number; retake_win: number };
  };

  // Taxa geral de mortes trocadas e estatísticas dos mapas da liga.
  trade_liga: number; mapas: MapLeague[];

  // Documenta os critérios utilizados pelo processamento dos dados,
  // incluindo a janela de trades, classes econômicas, papéis estimados,
  // cálculo esperado e limites mínimos de partidas.
  metodologia: { trade_ms: number; classes_economia: string; papeis: Record<string, number>; esperado: string; min_partidas_time: number; min_partidas_jogador: number };
};

// Estrutura que representa o perfil detalhado de uma equipe.
// Reúne as informações necessárias para apresentar estatísticas,
// jogadores, mapas, insights e histórico de partidas.
export type TeamProfile = {

  // Identificação utilizada para localizar o perfil da equipe.
  slug: string; nome: string;

  // Resumo do desempenho geral, incluindo resultados,
  // participação em campeonatos e placares acumulados.
  resumo: { partidas: number; vitorias: number; win_partida: number; campeonatos: string[]; rounds_pro: number; rounds_contra: number };

  // Indicadores estatísticos específicos da equipe.
  metricas: {

    // Quantidade de rounds, taxa de vitória e eficiência econômica.
    rounds: number; win: number; eco_delta: number;

    // Aproveitamento da equipe no ataque e na defesa.
    atk: RoundPair; def: RoundPair;

    // Resultados econômicos organizados por classe de compra.
    economia: Record<string, EconomyStat>;

    // Estatísticas das primeiras eliminações e sua relação
    // com os resultados dos rounds.
    abertura: { n: number; fk_rate: number; win_com_fk: number; win_sem_fk: number; tempo_fk_s: number };

    // Indicadores de plant da spike e desempenho ofensivo
    // após o plant, incluindo distribuição por bombsite.
    ataque: { plant_rate: number; pos_plant_win: number; n_plants: number; sites: Record<string, number> };
  };

  // Histórico de desempenho da equipe em cada mapa.
  // Inclui partidas disputadas, vitórias e aproveitamento
  // nos lados atacante e defensor.
  mapas: { mapa: string; partidas: number; win_partida: number | null; atk: number | null; def: number | null; vitorias: number }[];

  // Informações individuais dos jogadores identificados no histórico.
  // Inclui estatísticas de combate como ACS, ADR, KAST e K/D,
  // agentes utilizados e classificações comportamentais estimadas.
  jogadores: { puuid: string; nome: string; partidas: number; acs: number; adr: number; kast: number; kd: number | null; agentes: { agente: string; n: number }[]; papel_real: string; tags: string[] }[];

  // Insights gerados pelo processamento da equipe.
  // Cada observação possui uma classificação, área, título,
  // descrição e um campo opcional para análise de adversários.
  insights: { tipo: "alerta" | "forca" | "info"; area: string; titulo: string; texto: string; contra: string | null }[];

  // Registra o histórico de partidas da equipe, incluindo
  // data, adversário, mapa, resultado, placar e campeonato.
  serie: { data: string; adversario_nome: string; mapa: string; venceu: boolean; rounds_pro: number; rounds_contra: number; campeonato: string }[];
};
