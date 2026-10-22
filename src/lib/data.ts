
import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { League, TeamProfile, TeamSummary } from "@/lib/types";

// Define o diretório onde estão armazenados os arquivos JSON
// utilizados pela plataforma. O caminho parte da raiz do projeto.
const pasta = join(process.cwd(), "public", "dados");

// Função genérica responsável por ler e interpretar arquivos JSON.
// Recebe o caminho do arquivo e retorna seu conteúdo convertido
// para o tipo informado, facilitando a reutilização da leitura.
async function ler<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(join(pasta, file), "utf8")) as T;
}

// Carrega os dados gerais da liga, incluindo campeonatos,
// estatísticas consolidadas, mapas e indicadores históricos.
export const getLeague = () => ler<League>("liga.json");

// Carrega o índice de equipes com suas informações resumidas.
// Esses dados são utilizados nas listagens, rankings e comparações.
export const getTeams = () => ler<TeamSummary[]>("index.json");

// Busca as informações de uma equipe a partir de seu identificador (slug).
// Retorna os dados resumidos e, quando disponíveis, o perfil detalhado.
export async function getTeam(slug: string) {

  // Carrega o índice geral e procura a equipe correspondente ao slug.
  const teams = await getTeams();
  const sum = teams.find(t => t.slug === slug);

  // Caso a equipe não exista no índice, retorna null.
  if (!sum) return null;

  // Inicializa o perfil detalhado como indisponível.
  // Isso permite apresentar o resumo mesmo sem o JSON individual.
  let detail: TeamProfile | null = null;

  // Tenta carregar o arquivo específico da equipe,
  // localizado dentro da pasta public/dados/times.
  try { detail = await ler<TeamProfile>(join("times", `${sum.slug}.json`)); }

  // Trata a ausência do arquivo sem interromper a aplicação.
  // O erro ENOENT indica que o arquivo não foi encontrado.
  // Outros erros são propagados para permitir sua identificação.
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  // Retorna os dados resumidos e o perfil detalhado,
  // que será null caso o arquivo individual não esteja disponível.
  return { sum, detail };
}
