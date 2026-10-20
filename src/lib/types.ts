export type RoundPair = { n: number; win: number | null };
export type TeamSummary = {
  slug: string; nome: string; partidas: number; vitorias: number;
  win_partida: number; campeonatos: string[]; rounds_pro: number; rounds_contra: number;
  win_rounds: number; atk: number; def: number; pistola: number;
  eco_delta: number; mapas: string[];
  n_insights: { alerta: number; forca: number; info: number };
};
export type MapLeague = { mapa: string; partidas: number; atk: number; def: number };
export type EconomyStat = { n: number; share: number; win: number | null; esperado: number | null; delta: number | null };
export type League = {
  partidas: number; times: number; jogadores: number; campeonatos: string[];
  metricas: {
    rounds: number; win: number; eco_delta: number;
    atk: RoundPair; def: RoundPair;
    economia: Record<"pistol" | "eco" | "semi" | "full", EconomyStat>;
    full_vs_eco: RoundPair; eco_vs_full: RoundPair;
    apos_pistola_ganha: RoundPair; apos_pistola_perdida: RoundPair & { classes: Record<string, number> };
    abertura: { n: number; fk_rate: number; win_com_fk: number; win_sem_fk: number; tempo_fk_s: number };
    ataque: { plant_rate: number; plant_s: number; n_plants: number; sites: Record<string, number>; site_win: Record<string, number>; pos_plant_win: number };
    defesa: { retake_n: number; retake_win: number };
  };
  trade_liga: number; mapas: MapLeague[];
  metodologia: { trade_ms: number; classes_economia: string; papeis: Record<string, number>; esperado: string; min_partidas_time: number; min_partidas_jogador: number };
};
export type TeamProfile = {
  slug: string; nome: string;
  resumo: { partidas: number; vitorias: number; win_partida: number; campeonatos: string[]; rounds_pro: number; rounds_contra: number };
  metricas: {
    rounds: number; win: number; eco_delta: number;
    atk: RoundPair; def: RoundPair;
    economia: Record<string, EconomyStat>;
    abertura: { n: number; fk_rate: number; win_com_fk: number; win_sem_fk: number; tempo_fk_s: number };
    ataque: { plant_rate: number; pos_plant_win: number; n_plants: number; sites: Record<string, number> };
  };
  mapas: { mapa: string; partidas: number; win_partida: number | null; atk: number | null; def: number | null; vitorias: number }[];
  jogadores: { puuid: string; nome: string; partidas: number; acs: number; adr: number; kast: number; kd: number | null; agentes: { agente: string; n: number }[]; papel_real: string; tags: string[] }[];
  insights: { tipo: "alerta" | "forca" | "info"; area: string; titulo: string; texto: string; contra: string | null }[];
  serie: { data: string; adversario_nome: string; mapa: string; venceu: boolean; rounds_pro: number; rounds_contra: number; campeonato: string }[];
};
