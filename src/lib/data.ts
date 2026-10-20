import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { League, TeamProfile, TeamSummary } from "@/lib/types";

const pasta = join(process.cwd(), "public", "dados");
async function ler<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(join(pasta, file), "utf8")) as T;
}
export const getLeague = () => ler<League>("liga.json");
export const getTeams = () => ler<TeamSummary[]>("index.json");

export async function getTeam(slug: string) {
  const teams = await getTeams();
  const sum = teams.find(t => t.slug === slug);
  if (!sum) return null;
  let detail: TeamProfile | null = null;
  try { detail = await ler<TeamProfile>(join("times", `${sum.slug}.json`)); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  return { sum, detail };
}
