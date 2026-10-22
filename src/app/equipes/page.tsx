
import { getTeams } from "@/lib/data";
import { TeamDirectory } from "@/components/team-directory";
import { text } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

// Componente responsável pela página de listagem das equipes.
// Apresenta os participantes disponíveis e permite explorar seus desempenhos.
export default async function TeamsPage(){

// Carrega simultaneamente a lista de equipes e o idioma selecionado.
// Essas informações serão utilizadas para montar a interface da página.
const [teams,locale]=await Promise.all([getTeams(),getLocale()]);

// Renderiza o título, a descrição da página e o diretório de equipes.
// Os textos são adaptados ao idioma escolhido pelo usuário.
// O componente TeamDirectory recebe os dados necessários para
// apresentar e permitir a navegação entre as equipes.
return <><div className="eyebrow">{text(locale,"Explorar / Equipes","Explore / Teams")}</div><h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">{text(locale,"Todas as","All")} <span className="text-[#ff5968]">{text(locale,"equipes.","teams.")}</span></h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#a8bbc3]">{text(locale,"Pesquise participantes, compare aproveitamento e identifique padrões de desempenho. Cada perfil usa exclusivamente o histórico disponibilizado no desafio.","Search participants, compare win rates, and identify performance patterns. Each profile exclusively uses the history provided for the challenge.")}</p><TeamDirectory teams={teams} locale={locale}/></>}
