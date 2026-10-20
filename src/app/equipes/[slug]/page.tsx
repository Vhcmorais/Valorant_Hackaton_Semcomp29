import { notFound } from "next/navigation";
import { getTeam } from "@/lib/data";
import { TeamPageContent } from "@/components/team-profile";
import { getLocale } from "@/lib/locale-server";
export default async function TeamDetail({params}:{params:Promise<{slug:string}>}){
 const [{slug},locale]=await Promise.all([params,getLocale()]);
 const team=await getTeam(slug);
 if(!team) notFound();
 return <TeamPageContent sum={team.sum} detail={team.detail} locale={locale}/>;
}
