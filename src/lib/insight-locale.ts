
import type { Locale } from "@/lib/locale";

// Dicionário responsável pela tradução dos títulos dos insights.
// Cada título em português possui uma versão equivalente em inglês,
// permitindo apresentar as análises no idioma selecionado pelo usuário.
const titles: Record<string, string> = {
  "Controla a abertura dos rounds": "Controls round openings",
  "Converte bem a pistola": "Converts pistol rounds well",
  "Desequilíbrio entre lados: fraco na defesa": "Side imbalance: weak on defense",
  "Desequilíbrio entre lados: fraco no ataque": "Side imbalance: weak on attack",
  "Eco eficiente": "Efficient eco rounds",
  "Em ascensão": "On the rise",
  "Em queda": "Declining",
  "Joga junto e troca bem": "Plays together and trades well",
  "Mortes sem troca": "Deaths without trades",
  "Ninguém assume a abertura": "No one takes the opening duel",
  "Não converte a vantagem da pistola": "Does not convert the pistol-round advantage",
  "Perde os duelos de abertura": "Loses opening duels",
  "Perde rounds que deveria ganhar": "Loses rounds it should win",
  "Pistola forte": "Strong pistol rounds",
  "Pistola é ponto fraco": "Pistol rounds are a weakness",
  "Planta mas não sustenta": "Plants the spike but cannot hold",
  "Rende abaixo do esperado dado o dinheiro": "Underperforms given the economy",
  "Rende acima do esperado dado o dinheiro": "Overperforms given the economy",
  "Retake forte": "Strong retakes",
  "Ritmo de ataque lento": "Slow attacking pace",
  "Ritmo de ataque rápido": "Fast attacking pace",
};

// Dicionário que traduz as áreas de análise utilizadas nos insights.
// Essas categorias identificam o assunto principal de cada observação.
const areas: Record<string, string> = {
  abertura: "Opening",
  ataque: "Attack",
  coletivo: "Team play",
  defesa: "Defense",
  economia: "Economy",
  lados: "Sides",
  mapas: "Maps",
  tendencia: "Trend",
};

// Função auxiliar utilizada para traduzir textos com informações variáveis.
// A expressão regular identifica um padrão no texto original e,
// quando existe correspondência, envia os trechos encontrados
// para a função responsável por montar a tradução.
function translatedMatch(
  value: string,
  pattern: RegExp,
  translate: (match: RegExpExecArray) => string,
): string | undefined {
  const match = pattern.exec(value);
  return match ? translate(match) : undefined;
}

// Traduz a categoria do insight quando o idioma selecionado é inglês.
// Caso a categoria não esteja cadastrada, preserva o valor original.
export function insightArea(area: string, locale: Locale): string {
  return locale === "en" ? areas[area] ?? area : area;
}

// Traduz os títulos dos insights gerados pelo processamento.
// Primeiro verifica as traduções cadastradas no dicionário.
// Para títulos que possuem informações dinâmicas, utiliza
// expressões regulares para preservar nomes, mapas e funções.
export function insightTitle(title: string, locale: Locale): string {
  if (locale !== "en") return title;
  if (titles[title]) return titles[title];

  // Testa os formatos conhecidos de títulos dinâmicos.
  // O operador ?? utiliza a primeira tradução encontrada.
  // Caso nenhum padrão corresponda ao texto, mantém o título original.
  return (
    translatedMatch(title, /^(.*?) oscila entre partidas$/, m => `${m[1]} has inconsistent performance`)
    ?? translatedMatch(title, /^Dependência de (.+)$/, m => `Overreliance on ${m[1]}`)
    ?? translatedMatch(title, /^(.*): agente de duelista, papel de (suporte|lurker)$/, m => {
      const role = m[2] === "suporte" ? "support" : "lurker";
      return `${m[1]}: Duelist agent, ${role} playstyle`;
    })
    ?? translatedMatch(title, /^Mapa (forte|fraco): (.+)$/, m => `${m[1] === "forte" ? "Strong" : "Weak"} map: ${m[2]}`)
    ?? title
  );
}

// Traduz as descrições completas dos insights para inglês.
// Como os textos incluem estatísticas, nomes de jogadores e resultados,
// utiliza expressões regulares para identificar as partes variáveis
// e inseri-las corretamente nas versões traduzidas.
export function insightText(description: string, locale: Locale): string {
  if (locale !== "en") return description;

  // Cada regra reconhece uma estrutura de frase produzida pelo agregador.
  // Os grupos capturados pelas expressões regulares, como m[1] e m[2],
  // representam valores que devem ser preservados na tradução.
  // As regras são avaliadas em sequência até encontrar uma correspondência.
  return (
    translatedMatch(description, /^Consistência de (.+?) no ACS \((.+?) partidas\): alterna partidas muito boas e muito ruins\.$/, m =>
      `ACS consistency: ${m[1]} across ${m[2]} matches; performance swings between very strong and very weak games.`,
    )
    ?? translatedMatch(description, /^Vence (.+?) das últimas (.+?) partidas, contra (.+?) nas anteriores\.$/, m =>
      `Won ${m[1]} of the last ${m[2]} matches, compared with ${m[3]} in the previous matches.`,
    )
    ?? translatedMatch(description, /^Faz a primeira kill em só (.+?) dos rounds \((.+?) rounds\)\. Quando abre, vence (.+?); quando não abre, (.+?)\.$/, m =>
      `Gets the opening kill in only ${m[1]} of rounds (${m[2]} rounds). Wins ${m[3]} when getting the opening kill, and ${m[4]} otherwise.`,
    )
    ?? translatedMatch(description, /^Vence (.+?) pontos percentuais a mais de rounds do que o esperado pela economia de cada round, na média da liga\.$/, m =>
      `Wins ${m[1]} percentage points more rounds than expected based on each round's economy, compared with the league average.`,
    )
    ?? translatedMatch(description, /^Vence (.+?) pontos percentuais a menos de rounds do que o esperado pela economia de cada round\. As decisões de compra ou a execução custam rounds\.$/, m =>
      `Wins ${m[1]} percentage points fewer rounds than expected based on each round's economy. Buy decisions or execution are costing rounds.`,
    )
    ?? translatedMatch(description, /^Faz a primeira kill em (.+?) dos rounds \((.+?) rounds\), e quando abre vence (.+?)\.$/, m =>
      `Gets the opening kill in ${m[1]} of rounds (${m[2]} rounds), and wins ${m[3]} when doing so.`,
    )
    ?? translatedMatch(description, /^Planta em média aos (.+?)s do round \(liga: (.+?)s\)\.$/, m =>
      `Plants the spike at an average of ${m[1]}s into the round (league average: ${m[2]}s).`,
    )
    ?? translatedMatch(description, /^Vence só (.+?) dos rounds de pistola \((.+?) rounds\)\. Perder a pistola derruba a economia do time para o resto da metade\.$/, m =>
      `Wins only ${m[1]} of pistol rounds (${m[2]} rounds). Losing the pistol round hurts the team's economy for the rest of the half.`,
    )
    ?? translatedMatch(description, /^Joga de Duelista mas, pelo comportamento \(aberturas, trocas, distância dos aliados\), age como (suporte|lurker)\.$/, m =>
      `Plays a Duelist agent but, based on their opening duels, trades, and distance from teammates, behaves like a ${m[1] === "suporte" ? "support" : "lurker"}.`,
    )
    ?? translatedMatch(description, /^Vence (.+?) do round seguinte à pistola ganha \(liga: (.+?)\)\.$/, m =>
      `Wins ${m[1]} of the rounds after winning the pistol round (league average: ${m[2]}).`,
    )
    ?? translatedMatch(description, /^Vence (.+?) no ataque contra (.+?) na defesa \((.+?) rounds\)\.$/, m =>
      `Wins ${m[1]} on attack, compared with ${m[2]} on defense (${m[3]} rounds).`,
    )
    ?? translatedMatch(description, /^Vence (.+?) na defesa contra (.+?) no ataque \((.+?) rounds\)\.$/, m =>
      `Wins ${m[1]} on defense, compared with ${m[2]} on attack (${m[3]} rounds).`,
    )
    ?? translatedMatch(description, /^Nenhum jogador do time se destaca na abertura dos rounds \(primeira kill ou morte\)\.$/, () =>
      "No player on the team stands out in round openings (first kills or first deaths).",
    )
    ?? translatedMatch(description, /^Em rounds eco contra compra cheia, vence (.+?) \(liga: (.+?), (.+?) rounds\)\.$/, m =>
      `Wins ${m[1]} in eco rounds against full buys (league average: ${m[2]}, ${m[3]} rounds).`,
    )
    ?? translatedMatch(description, /^Quando a spike é plantada contra o time, vence (.+?) \(liga: (.+?), (.+?) rounds\)\.$/, m =>
      `When the opposing team plants the spike, wins ${m[1]} (league average: ${m[2]}, ${m[3]} rounds).`,
    )
    ?? translatedMatch(description, /^Vence (.+?) dos rounds de pistola \((.+?) rounds\), o que dá vantagem de economia logo no início\.$/, m =>
      `Wins ${m[1]} of pistol rounds (${m[2]} rounds), gaining an early economic advantage.`,
    )
    ?? translatedMatch(description, /^Vence (.+?) das partidas em (.+?) \((.+?)\/(.+?)\), contra (.+?) na média dos mapas com amostra\.$/, m =>
      `Wins ${m[1]} of its matches on ${m[2]} (${m[3]}/${m[4]}), compared with ${m[5]} across maps with sufficient samples.`,
    )
    ?? translatedMatch(description, /^Vence (.+?) das partidas em (.+?) \((.+?)\/(.+?)\)\.$/, m =>
      `Wins ${m[1]} of its matches on ${m[2]} (${m[3]}/${m[4]}).`,
    )
    ?? translatedMatch(description, /^Depois de plantar, vence (.+?) dos rounds \(liga: (.+?)\)\.$/, m =>
      `After planting the spike, wins ${m[1]} of rounds (league average: ${m[2]}).`,
    )
    ?? translatedMatch(description, /^Depois de ganhar a pistola, vence só (.+?) do round seguinte \(liga: (.+?), (.+?) rounds\)\. Há desperdício de vantagem econômica\.$/, m =>
      `After winning the pistol round, wins only ${m[1]} of the following rounds (league average: ${m[2]}, ${m[3]} rounds). The economic advantage is being wasted.`,
    )
    ?? translatedMatch(description, /^Só (.+?) das mortes do time são trocadas em até (.+?)s \(liga: (.+?)\)\. Os jogadores morrem isolados\.$/, m =>
      `Only ${m[1]} of the team's deaths are traded within ${m[2]}s (league average: ${m[3]}). Players are dying in isolation.`,
    )
    ?? translatedMatch(description, /^(.+?) das mortes do time são trocadas em até (.+?)s \(liga: (.+?)\)\. Bom jogo coletivo\.$/, m =>
      `${m[1]} of the team's deaths are traded within ${m[2]}s (league average: ${m[3]}). Strong team play.`,
    )
    ?? translatedMatch(description, /^Com compra cheia contra eco adversário, vence (.+?) \(liga: (.+?), (.+?) rounds\)\. Falta disciplina contra eco\.$/, m =>
      `With a full buy against an opposing eco, wins ${m[1]} (league average: ${m[2]}, ${m[3]} rounds). Needs more discipline against eco rounds.`,
    )
    ?? translatedMatch(description, /^Mimikyu concentra (.+?) do score do time \(o equilíbrio seria ~(.+?)\)\.$/, m =>
      `Mimikyu accounts for ${m[1]} of the team's score (an even share would be ~${m[2]}).`,
    )
    ?? translatedMatch(description, /^(.+?) concentra (.+?) do score do time \(o equilíbrio seria ~(.+?)\)\.$/, m =>
      `${m[1]} accounts for ${m[2]} of the team's score (an even share would be ~${m[3]}).`,
    )

    // Se nenhuma expressão regular reconhecer a descrição,
    // retorna o texto original para evitar perder informações.
    ?? description
  );
}
