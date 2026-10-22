
import { notFound } from "next/navigation";
import { getTeam } from "@/lib/data";
import { TeamPageContent } from "@/components/team-profile";
import { getLocale } from "@/lib/locale-server";

// Componente responsável por exibir o perfil detalhado de uma equipe.
// Utiliza o slug recebido pela URL para identificar a equipe selecionada.
export default async function TeamDetail({params}:{params:Promise<{slug:string}>}){

 // Obtém o identificador da equipe e o idioma selecionado pelo usuário.
 // As duas informações são carregadas simultaneamente.
 const [{slug},locale]=await Promise.all([params,getLocale()]);

 // Busca os dados da equipe correspondente ao slug informado.
 const team=await getTeam(slug);

 // Caso a equipe não seja encontrada, exibe a página de erro 404.
 if(!team) notFound();

 // Renderiza o perfil da equipe, enviando os dados resumidos,
 // as informações detalhadas e o idioma para o componente.
 return <TeamPageContent sum={team.sum} detail={team.detail} locale={locale}/>;
}
