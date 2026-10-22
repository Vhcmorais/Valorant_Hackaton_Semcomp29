
import type { Locale } from "@/lib/locale";

// Define o padrão de formatação numérica de acordo com o idioma.
// Utiliza o formato brasileiro para português e o americano para inglês.
const numberLocale = (locale: Locale) => locale === "en" ? "en-US" : "pt-BR";

// Converte valores proporcionais em porcentagens formatadas.
// Permite definir a quantidade de casas decimais e o idioma.
// Caso o valor esteja ausente, retorna um traço no lugar do percentual.
export const pct = (fraction: number | null | undefined, digits = 1, locale: Locale = "pt-BR") =>
  fraction == null ? "—" : new Intl.NumberFormat(numberLocale(locale), { style: "percent", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(fraction);

// Formata números utilizando os separadores de milhares
// correspondentes ao idioma selecionado pelo usuário.
export const num = (value: number, locale: Locale = "pt-BR") => new Intl.NumberFormat(numberLocale(locale)).format(value);

// Converte diferenças entre taxas em pontos percentuais (p.p.).
// Multiplica a proporção por 100 e adiciona o sinal positivo
// quando o resultado é maior ou igual a zero.
// Essa função é utilizada, por exemplo, na exibição do Eco Delta.
export const signedPp = (fraction: number | null | undefined, locale: Locale = "pt-BR") => fraction == null ? "—" : `${fraction >= 0 ? "+" : ""}${(fraction * 100).toLocaleString(numberLocale(locale), { maximumFractionDigits: 1, minimumFractionDigits: 1 })} ${locale === "en" ? "pp" : "p.p."}`;

// Padroniza a apresentação dos nomes dos mapas.
// Transforma a primeira letra em maiúscula e preserva
// os demais caracteres. Strings vazias permanecem inalteradas.
export const mapName = (s: string) => s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
