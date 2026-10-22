
import "server-only";

import { cookies } from "next/headers";
import type { Locale } from "@/lib/locale";

// Função responsável por identificar o idioma selecionado pelo usuário.
// A preferência é recuperada a partir do cookie site-locale,
// permitindo que o servidor apresente os conteúdos no idioma correto.
export async function getLocale(): Promise<Locale> {

  // Consulta os cookies da requisição e verifica o idioma armazenado.
  // Se o valor for "en", retorna inglês. Caso contrário, utiliza
  // português brasileiro como idioma padrão da aplicação.
  return (await cookies()).get("site-locale")?.value === "en" ? "en" : "pt-BR";
}
