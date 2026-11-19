# Mimikyu's TCG Dex

[English](#english) | [Português (Portugal)](#português-portugal)

---

## English

A searchable Pokémon Trading Card Game catalog powered by the [TCGdex API](https://tcgdex.dev/).

### Features

- Browse the English card catalog with card images, names, set names, and card numbers.
- Search by card name, set name, card number, or card ID.
- Filter by set, type, card kind, rarity, stage, regulation mark, HP range, and format legality.
- Sort cards by set and card number, or alphabetically by name.
- Open a card to view details such as effects, attacks, abilities, weaknesses, variants, and legality.
- Browse large result sets in batches with **Load more cards**.

The card catalog and set list come from TCGdex. Full card details are loaded when a card is opened. An internet connection is required, and no API key is needed.

### Getting started

Install [Node.js](https://nodejs.org/) and npm, then run the following commands from the project directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in a browser.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Data source

Card and set data are provided by the [TCGdex REST API](https://tcgdex.dev/rest). The application uses TCGdex's English API endpoints for card lists, set lists, filtered lists, and individual card details.

The frontend is built with JavaScript (JSX) and React, using Vite. It parses the API's JSON responses and displays fields such as card name, image, set name, card number, rarity, and category.

---

## Português

Um catálogo pesquisável do Jogo de Cartas Colecionáveis Pokémon fornecido pela [API TCGdex](https://tcgdex.dev/).

### Funcionalidades

- Consultar o catálogo de cartas em inglês com imagens, nomes, nomes das coleções e números das cartas.
- Pesquisar pelo nome da carta, nome da coleção, número da carta ou ID da carta.
- Filtrar por coleção, tipo, categoria, raridade, fase, marca de regulamentação, intervalo de PS e legalidade em formatos.
- Ordenar as cartas por coleção e número ou alfabeticamente pelo nome.
- Abrir uma carta para ver detalhes como efeitos, ataques, habilidades, fraquezas, variantes e legalidade.
- Consultar conjuntos grandes de resultados em lotes com **Load more cards**.

O catálogo de cartas e a lista de coleções são obtidos através do TCGdex. Os detalhes completos são carregados ao abrir uma carta. É necessária uma ligação à Internet e não é necessária nenhuma chave de API.

### Primeiros passos

Instale o [Node.js](https://nodejs.org/) e o npm e execute os seguintes comandos na pasta do projeto:

```sh
npm install
npm run dev
```

Abra no navegador o URL local apresentado pelo Vite.

### Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Iniciar o servidor local de desenvolvimento |
| `npm run build` | Criar uma versão de produção em `dist/` |
| `npm run preview` | Pré-visualizar localmente a versão de produção |
| `npm run lint` | Executar o ESLint |

### Fonte dos dados

Os dados das cartas e coleções são fornecidos pela [API REST do TCGdex](https://tcgdex.dev/rest). A aplicação utiliza os endpoints em inglês do TCGdex para listas de cartas, coleções, resultados filtrados e detalhes individuais das cartas.

O front-end é desenvolvido em JavaScript (JSX) com React, usando Vite. Analisa as respostas JSON da API e apresenta campos como o nome da carta, imagem, nome da coleção, número, raridade e categoria.
