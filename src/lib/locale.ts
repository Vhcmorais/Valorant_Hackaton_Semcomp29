
// Define os idiomas disponíveis na plataforma.
// O tipo Locale restringe os valores ao português brasileiro e ao inglês.
export type Locale = "pt-BR" | "en";

// Função responsável por selecionar o texto conforme o idioma do usuário.
// Recebe as versões em português e inglês e retorna a correspondente
// ao idioma escolhido, utilizando português como padrão.
export function text(locale: Locale, portuguese: string, english: string): string {
  return locale === "en" ? english : portuguese;
}
