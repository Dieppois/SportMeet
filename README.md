# Sport Matcher Monorepo

Monorepo pour l'application de mise en relation sportive (front React + back Node/Express + MySQL + Socket.io).

## Structure

- `apps/api` : API Node.js/Express (TypeScript) + Prisma + Socket.io
- `apps/web` : Front React 18 + TypeScript + Vite + Tailwind CSS v4
- `packages/shared` : Types partagés (DTO, enums, constantes)

## Scripts racine

- `npm run dev` : démarre le front en mode développement
- `npm run dev:api` : démarre l'API en mode développement
- `npm run dev:web` : démarre le front en mode développement
- `npm run build` : build API + front
- `npm run lint` : lint API + front
- `npm run test` : tests backend

## Prérequis
.
- Node.js >= 18
- npm >= 8
- Docker (recommandé) pour MySQL


