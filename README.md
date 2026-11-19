# Mimikyu's TCG Dex

[English](#english) | [Português](#português)

## English

A searchable catalog for the Pokémon Trading Card Game, powered by the [TCGdex API](https://tcgdex.dev/).

### Features

- Browse the English card catalog with card images, names, set names, and card numbers.
- Search by card name, set name, card number, or card ID.
- Filter cards by set, type, card kind, rarity, stage, regulation mark, HP range, and format legality.
- Sort cards by set and card number or alphabetically by name.
- Open any card to view details, including effects, attacks, abilities, weaknesses, variants, and legality when available.
- Load large result sets in batches with **Load more cards**.

The catalog and set list are loaded from TCGdex. Full card details are requested only when a card is opened. An internet connection is required, and no API key is needed.

### Getting started

Install [Node.js](https://nodejs.org/) and npm. Then, from the `MimikyuTCGDex` project directory, run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

### Data source

Card and set data are provided by the [TCGdex REST API](https://tcgdex.dev/rest). The application uses the English API endpoints for card lists, set lists, filtered searches, and individual card details.

---

## Português

Um catálogo pesquisável do Pokémon Trading Card Game, desenvolvido com a [API do TCGdex](https://tcgdex.dev/).

### Funcionalidades

- Navegue pelo catálogo em inglês com imagens, nomes das cartas, nomes das coleções e números das cartas.
- Pesquise pelo nome da carta, nome da coleção, número da carta ou ID da carta.
- Filtre cartas por coleção, tipo, categoria, raridade, estágio, símbolo de regulação, faixa de PS e legalidade em formatos.
- Ordene cartas por coleção e número ou alfabeticamente pelo nome.
- Abra qualquer carta para ver detalhes, incluindo efeitos, ataques, habilidades, fraquezas, variantes e legalidade, quando disponíveis.
- Carregue resultados grandes em lotes com **Load more cards**.

O catálogo e a lista de coleções são carregados pelo TCGdex. Os detalhes completos são solicitados somente ao abrir uma carta. É necessário ter conexão com a internet e não é necessária nenhuma chave de API.

### Como começar

Instale o [Node.js](https://nodejs.org/) e o npm. Em seguida, execute os seguintes comandos no diretório do projeto `MimikyuTCGDex`:

```sh
npm install
npm run dev
```

Abra no navegador o endereço local exibido pelo Vite.

### Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor local de desenvolvimento. |
| `npm run build` | Cria a versão de produção na pasta `dist/`. |
| `npm run preview` | Visualiza localmente a versão de produção. |
| `npm run lint` | Executa o ESLint. |

### Fonte dos dados

Os dados das cartas e coleções são fornecidos pela [TCGdex REST API](https://tcgdex.dev/rest). A aplicação utiliza os endpoints da API em inglês para listas de cartas, listas de coleções, pesquisas filtradas e detalhes individuais das cartas.
