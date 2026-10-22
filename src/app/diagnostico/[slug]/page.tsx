
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Database } from "lucide-react";
import { getLeague, getTeam } from "@/lib/data";
import { gerarDiagnostico } from "@/lib/diagnostico";
import { DiagnosticBoard } from "@/components/diagnostic-board";
import { getLocale } from "@/lib/locale-server";
import { text } from "@/lib/locale";

// Define os parâmetros recebidos pela página através da rota dinâmica.
// O slug identifica qual equipe será carregada.
type Props = { params: Promise<{slug: string}> };

// Gera o título da página de acordo com a equipe selecionada
// e com o idioma definido pelo usuário.
export async function generateMetadata(): Promise<Metadata> {
  return { title: "Valorant Observatory" };
}

// Componente principal da página de diagnóstico de uma equipe.
// Carrega os dados necessários e apresenta o relatório individual.
export default async function DiagnosticoEquipePage({params}: Props) {

  // Obtém o identificador da equipe e o idioma em paralelo.
  const [{slug}, locale] = await Promise.all([params, getLocale()]);

  // Busca os dados da equipe e as estatísticas gerais da liga.
  const [team,liga] = await Promise.all([getTeam(slug), getLeague()]);

  // Exibe a página 404 caso a equipe não seja encontrada.
  if (!team) notFound();

  return <>
    {/* Link para retornar à seleção de equipes. */}
    <Link href="/diagnostico" className="inline-flex items-center gap-2 text-xs font-bold text-[#91abb3] hover:text-white"><ArrowLeft size={15}/> {text(locale, "Selecionar outra equipe", "Choose another team")}</Link>

    {/* Cabeçalho com o nome da equipe, descrição do relatório e acesso ao perfil completo. */}
    <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
      <div><div className="eyebrow">{text(locale, "Relatório de desempenho · Dados históricos", "Performance report · Historical data")}</div><h1 className="mt-3 text-4xl font-black uppercase leading-tight tracking-[-.045em] sm:text-5xl">{team.sum.nome}<span className="text-[#ff5968]">.</span></h1><p className="mt-3 max-w-2xl text-sm text-[#9db3bc]">{text(locale, "Diagnóstico fundamentado nas partidas registradas, com referências da liga e sugestões de revisão pós-partida.", "Diagnostics based on recorded matches, with league benchmarks and post-match review suggestions.")}</p></div>
      <Link href={`/equipes/${slug}`} className="btn-outline">{text(locale, "Ver perfil completo", "View full profile")} <ArrowRight size={15}/></Link>
    </div>

    {/* Verifica se os dados detalhados da equipe estão disponíveis.
        Caso não estejam, apresenta uma orientação para adicionar o arquivo JSON.
        Se estiverem, gera e exibe o diagnóstico utilizando as referências da liga. */}
    {!team.detail
      ? <section className="panel mt-8 flex items-start gap-4 p-6"><Database size={25} className="shrink-0 text-[#e5c582]"/><div><h2 className="font-extrabold">{text(locale, "O perfil detalhado desta equipe ainda não foi encontrado", "The detailed profile for this team could not be found")}</h2><p className="mt-2 text-sm leading-7 text-[#a6b6be]">{text(locale, "Copie", "Copy")} <code>dashboard_dados/times/{slug}.json</code> {text(locale, "para", "to")} <code>public/dados/times/</code> {text(locale, "na pasta do Next.js. A página lerá os dados automaticamente.", "in the Next.js project folder. The page will load the data automatically.")}</p></div></section>
      : <DiagnosticBoard diagnostico={gerarDiagnostico(team.sum,team.detail,liga,locale)} insights={team.detail.insights || []} locale={locale}/>}

    {/* Informa as limitações da análise e esclarece que as recomendações
        são baseadas em dados históricos, não em previsões ou informações em tempo real. */}
    <p className="mt-7 text-xs leading-6 text-[#8fa5ad]">{text(locale, "Metodologia: comparação descritiva com a base oficial da liga, com limiares mínimos de amostra. Sugestões de revisão não são prognósticos, causalidade comprovada ou instruções em tempo real.", "Methodology: descriptive comparison with the league's official dataset, using minimum sample thresholds. Review suggestions are not forecasts, proof of causation, or real-time instructions.")}</p>
  </>;
}
