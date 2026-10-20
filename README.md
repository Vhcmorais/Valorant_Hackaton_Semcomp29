# Tactical.GG — primeira versão

Dashboard de VALORANT para o Hackathon SEMCOMP 2026, construído exclusivamente com os dados recebidos da organização e processados localmente pelos scripts `processar.py` e `agregar.py` do participante.

## Requisitos

- Node.js 20.9+ (preferência: Node.js 22)
- npm
- Python somente se você for executar novamente os scripts de tratamento (não é necessário para abrir o dashboard)

## Como executar

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Dados incluídos e atualização

O starter inclui:

- `public/dados/index.json`: o índice real de 47 equipes enviado na conversa (sem alteração de conteúdo)
- `public/dados/liga.json`: **reconstrução a partir da saída JSON compartilhada na conversa**, para permitir executar imediatamente

**Antes da apresentação final, substitua ambos pelos arquivos exatos que seu `agregar.py` gerou**. Também copie toda a pasta de equipes, para desbloquear seus diagnósticos:

```text
seu-projeto/
├── public/
│   └── dados/
│       ├── index.json     <- dashboard_dados/index.json
│       ├── liga.json      <- dashboard_dados/liga.json
│       └── times/
│           ├── ufmt_turuna.json
│           ├── ufu_saints.json
│           └── ...todos os demais .json
└── src/
    ├── app/
    │   ├── page.tsx          # home e visão geral
    │   ├── equipes/          # diretório e perfis
    │   └── metodologia/      # transparência
    ├── components/
    │   ├── league-dashboard.tsx
    │   ├── team-directory.tsx
    │   └── team-profile.tsx
    └── lib/
        ├── data.ts
        ├── format.ts
        └── types.ts
```

### Atualizar os dados com Python

Se sua saída padrão do Python for `dashboard_dados`, copie o conteúdo inteiro da pasta para `public/dados` sempre que executar `agregar.py`. Não use dados de plataformas externas para complementar as partidas.

## O que funciona

- Página inicial com indicadores históricos da liga.
- Ranking com pesquisa, mínimo de partidas e ordenação.
- Gráfico de lado atacante/defensor com opção de incluir mapas de amostra pequena.
- Visualização de classes de economia.
- Diretório de equipes pesquisável e filtro de participação por campeonato.
- Perfil por equipe baseado no `index.json`, com detalhes extras carregados dos respectivos arquivos `times/<slug>.json` quando presentes.
- Página de metodologia e limitações.

## Restrições e cuidados

- O filtro de campeonato no diretório filtra equipes que **participaram**, não recalcula suas estatísticas por campeonato.
- Taxas históricas não são previsões garantidas.
- `rounds_time.csv` possui duas linhas por round, uma para cada time.
- Nomes de papéis e métricas de retake/trade são interpretações heurísticas do processamento; revise antes do pitch.
- Nenhuma integração com partidas ao vivo, clientes do jogo ou serviços Riot.
- Marca visual original do projeto, sem incluir logos ou artes oficiais do jogo.

## Testar para entrega

```bash
npm run typecheck
npm run build
```

Se precisar publicar, use Vercel vinculada ao repositório contendo seus JSONs finais.
