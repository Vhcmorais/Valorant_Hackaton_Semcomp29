// Importa o tipo Metadata, utilizado para definir o título
// e a descrição da página nos metadados do Next.js.
import type { Metadata } from "next";
import { CompareTeams } from "@/components/compare-teams";
import { getTeams } from "@/lib/data";
import { getLocale } from "@/lib/locale-server";
import { text } from "@/lib/locale";

// Gera os metadados da página de comparação de equipes.
// O título e a descrição são definidos de acordo com o idioma selecionado.
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: "Valorant Observatory",
    description: text(locale,
      "Compare indicadores históricos de equipes de VALORANT com dados das classificatórias do Hackathon.",
      "Compare historical VALORANT team metrics using data from the Hackathon qualifiers.",
    ),
  };
}

// Componente principal da página de comparação.
// Carrega a lista de equipes e o idioma simultaneamente,
// evitando que uma operação precise esperar pela outra.
export default async function CompararPage() {
  const [teams, locale] = await Promise.all([getTeams(), getLocale()]);

  // Envia os dados carregados para o componente responsável
  // por exibir a interface e as comparações entre equipes.
  return <CompareTeams teams={teams} locale={locale} />;
}