
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  FileText,
  Users,
  Crosshair,
  ArrowLeftRight,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";

import type { Locale } from "@/lib/locale";
import { text } from "@/lib/locale";

// Define as páginas disponíveis no menu de navegação.
// Cada item contém o endereço, os nomes em português e inglês
// e o ícone utilizado para representar a respectiva seção.
const pages = [
  { href: "/", pt: "Visão geral", en: "Overview", Icon: BarChart3 },
  { href: "/equipes", pt: "Equipes", en: "Teams", Icon: Users },
  { href: "/comparar", pt: "Comparar", en: "Compare", Icon: ArrowLeftRight },
  { href: "/diagnostico", pt: "Diagnóstico", en: "Diagnosis", Icon: ClipboardList },
  { href: "/metodologia", pt: "Metodologia", en: "Methodology", Icon: FileText },
];

// Componente responsável pelo cabeçalho principal da plataforma.
// Reúne a identidade visual, o menu de navegação e a seleção de idioma,
// adaptando sua apresentação para computadores e dispositivos móveis.
export function SiteHeader({ locale }: { locale: Locale }) {

  // Obtém a rota atual e o controlador de navegação do Next.js.
  // Essas informações permitem identificar a página ativa
  // e atualizar os componentes após a troca de idioma.
  const path = usePathname();
  const router = useRouter();

  // Armazena o idioma selecionado e controla a abertura do menu mobile.
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [menuOpen, setMenuOpen] = useState(false);

  // Atualiza o idioma da interface e salva a preferência em um cookie.
  // O router.refresh solicita novamente os componentes do servidor,
  // permitindo que as páginas utilizem o idioma atualizado.
  function changeLocale(next: Locale) {
    setCurrentLocale(next);

    document.cookie = `site-locale=${
      next === "en" ? "en" : "pt-BR"
    }; path=/; max-age=31536000; samesite=lax`;

    router.refresh();
  }

  // Verifica se um item do menu corresponde à página atual.
  // Também considera rotas internas, como o perfil individual
  // de uma equipe dentro da seção de equipes.
  function isActive(href: string) {
    return href === "/"
      ? path === "/"
      : path === href || path.startsWith(href + "/");
  }

  // Componente reutilizável para alternar entre português e inglês.
  // O mesmo seletor é apresentado nas versões desktop e mobile.
  function LanguageSelector() {
    return (
      <div
        role="group"
        aria-label={text(currentLocale, "Selecionar idioma", "Select language")}
        className="flex items-center rounded-md border border-[#354851] p-1"
      >

        {/* Percorre os idiomas disponíveis e cria um botão para cada opção.
            O idioma ativo recebe um destaque visual e o atributo aria-pressed. */}
        {(
          [
            { locale: "pt-BR", label: "PT" },
            { locale: "en", label: "EN" },
          ] as const
        ).map((option) => (
          <button
            key={option.locale}
            type="button"
            aria-pressed={currentLocale === option.locale}
            onClick={() => changeLocale(option.locale)}
            className={`rounded px-3 py-1.5 text-[10px] font-black transition-all ${
              currentLocale === option.locale
                ? "bg-[#ff4655] text-white"
                : "text-[#9cafb8] hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }

  // Renderiza a estrutura completa do cabeçalho,
  // mantendo os elementos de navegação disponíveis durante a rolagem.
  return (
    <header className="glass sticky top-0 z-50 border-b border-white/5">
      <div className="mx-auto flex min-h-[74px] max-w-7xl items-center justify-between gap-3 px-5 py-3 lg:px-8">

        {/* LOGO */}

        {/* Identificação visual da plataforma.
            Funciona como um link para a página inicial e também
            fecha o menu mobile quando é selecionada. */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          aria-label={text(currentLocale, "Página inicial", "Home page")}
          className="flex shrink-0 items-center gap-3"
        >

          {/* Símbolo da plataforma com fundo vermelho.
              O clipPath cria o recorte característico da logo. */}
          <div
            className="grid size-10 place-items-center bg-[#ff4655] text-white"
            style={{
              clipPath:
                "polygon(0 0,100% 0,100% 72%,68% 100%,0 100%)",
            }}
          >
            <Crosshair size={22} strokeWidth={2.8} />
          </div>

          {/* Nome e descrição visual do projeto. */}
          <div>
            <div className="text-[15px] font-black leading-none tracking-[.04em] sm:text-[16px]">
              Valorant
              <span className="text-[#ff4655]"> Observatory</span>
            </div>

            <div className="mt-1 text-[9px] font-bold tracking-[.25em] text-[#93a8b1]">
              POST GAME ANALYSIS
            </div>
          </div>
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}

        {/* Menu principal exibido em telas maiores.
            Os links são gerados a partir da lista de páginas
            e recebem destaque quando correspondem à rota atual. */}
        <nav
          aria-label={text(currentLocale, "Navegação principal", "Main navigation")}
          className="hidden items-center gap-1 lg:flex"
        >
          {pages.map(({ href, pt, en, Icon }) => {

            // Identifica se o item corresponde à página acessada.
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-2.5 text-xs font-bold transition-all xl:px-3 ${
                  active
                    ? "bg-[#ff46551e] text-[#ff7780]"
                    : "text-[#9cafb8] hover:bg-white/5 hover:text-white"
                }`}
              >

                {/* Exibe o ícone e o nome da página no idioma selecionado. */}
                <Icon size={15} />
                {text(currentLocale, pt, en)}
              </Link>
            );
          })}
        </nav>

        {/* CONTROLES */}

        {/* Agrupa os controles adicionais do cabeçalho,
            incluindo idioma, indicador visual e menu mobile. */}
        <div className="flex shrink-0 items-center gap-3">

          {/* IDIOMA DESKTOP */}

          {/* Exibe o seletor de idiomas apenas em telas maiores. */}
          <div className="hidden lg:block">
            <LanguageSelector />
          </div>

          {/* STATUS LIVE */}

          {/* Indicador visual exibido em telas muito largas.
              Sua apresentação é controlada pelas classes responsivas. */}
          <div className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[#9eb0b8] 2xl:flex">
            <span className="ring-dot" />
            LIVE
          </div>

          {/* BOTÃO MOBILE */}

          {/* Controla a abertura e o fechamento do menu em dispositivos móveis.
              O ícone muda conforme o estado atual da navegação. */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={text(
              currentLocale,
              menuOpen ? "Fechar menu" : "Abrir menu",
              menuOpen ? "Close menu" : "Open menu"
            )}
            className="grid size-10 place-items-center rounded-md border border-[#354851] text-white transition-colors hover:border-[#ff4655] hover:text-[#ff4655] lg:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}

      {/* Renderiza o menu de navegação mobile somente quando
          o usuário aciona o botão de abertura do cabeçalho. */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#293942] bg-[#101b22] lg:hidden"
        >
          <nav
            aria-label={text(currentLocale, "Navegação móvel", "Mobile navigation")}
            className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4"
          >

            {/* Gera os links da navegação mobile.
                Ao selecionar uma página, o menu é fechado automaticamente. */}
            {pages.map(({ href, pt, en, Icon }) => {

              // Utiliza a mesma verificação de rota ativa do menu desktop.
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                    active
                      ? "border-l-2 border-[#ff4655] bg-[#ff46551e] text-[#ff7780]"
                      : "text-[#a8bbc3] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {text(currentLocale, pt, en)}
                </Link>
              );
            })}

            {/* IDIOMAS NO MOBILE */}

            {/* Disponibiliza a troca de idioma também no menu mobile,
                reutilizando o mesmo componente da versão desktop. */}
            <div className="mt-3 flex items-center justify-between border-t border-[#293942] pt-4">
              <span className="text-xs font-semibold text-[#8da2ab]">
                {text(currentLocale, "Idioma", "Language")}
              </span>

              <LanguageSelector />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
