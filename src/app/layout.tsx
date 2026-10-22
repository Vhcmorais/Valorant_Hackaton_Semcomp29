
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { text } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";
import "./globals.css";
import "./refinamento.css";

// Define os metadados globais da aplicação.
// Essas informações são utilizadas como título e descrição padrão
// nas páginas que não possuem metadados específicos.
export const metadata: Metadata = {
 title:"Valorant Observatory", description:"Análise histórica de partidas, equipes e padrões competitivos com dados autorizados do hackathon."
};

// Componente principal de layout do Next.js.
// Define a estrutura compartilhada por todas as páginas da aplicação,
// incluindo o cabeçalho, a área de conteúdo e o rodapé.
export default async function RootLayout({ children }:Readonly<{children:React.ReactNode}>){

 // Obtém o idioma selecionado pelo usuário para apresentar
 // os elementos compartilhados de acordo com sua preferência.
 const locale = await getLocale();

 // Renderiza a estrutura global da aplicação.
 // O atributo lang identifica o idioma utilizado na página.
 return <html lang={locale}><body>

 {/* Cabeçalho principal com logo, navegação e seletor de idiomas. */}
 <SiteHeader locale={locale}/>

 {/* Área principal onde o Next.js apresenta o conteúdo
     correspondente à página acessada pelo usuário. */}
 <main className="mx-auto min-h-[calc(100vh-150px)] max-w-7xl px-5 py-8 lg:px-8 lg:py-10">{children}</main>

 {/* Rodapé compartilhado com a identificação do projeto,
     sua finalidade e o aviso de independência em relação à Riot Games. */}
 <footer className="border-t border-[#273740] px-5 py-7 text-center text-xs text-[#8ba0aa]">Valorant Observatory · {text(locale,"Análise histórica pós-partida","Historical post-match analysis")} · Hackathon SEMCOMP 2026 · {text(locale,"Projeto independente, sem afiliação com a Riot Games","Independent project, not affiliated with Riot Games")}</footer>

 </body></html>
}
