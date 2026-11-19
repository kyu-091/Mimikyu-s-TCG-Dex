# Mimikyu's TCG Dex

A searchable Pokémon Trading Card Game card catalog powered by the [TCGdex API](https://tcgdex.dev/).

## Features

- Browse the English card catalog with card images, names, set names, and card numbers.
- Search by card name, set name, card number, or card ID.
- Filter by set, type, card kind, rarity, stage, regulation mark, HP range, and format legality.
- Sort cards by set and card number, or alphabetically by name.
- Open a card for details, including card effects, attacks, abilities, weaknesses, variants, and legality when available.
- Browse large result sets in batches using **Load more cards**.

The catalog and set list are loaded from TCGdex. Full card details are requested when a card is opened. An internet connection is required; no API key is needed.

## Getting started

Install [Node.js](https://nodejs.org/) and npm, then run these commands from the `MimikyuTCGDex` project directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Data source

Card and set data are provided by the [TCGdex REST API](https://tcgdex.dev/rest). The application uses its English API endpoints for card lists, sets, filtered card lists, and individual card details.# Mimikyu-s-TCG-Dex
