# Binpar Test - Pokédex Web App

A modern Pokédex web application created by Luis Anaya as a technical assessment for BinPar. Built with Next.js, TypeScript, and Tailwind CSS.

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - App Router, React Server Components & React 19
- [TypeScript](https://www.typescriptlang.org/) - Type safety and better developer experience
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Customizable, accessible components
- [TanStack React Query](https://tanstack.com/query/latest) - Powerful data fetching and caching
- [PokeAPI](https://pokeapi.co/) - Pokémon data API

## 🚀 Features

- Tanstack Query integrated with Server Components for data prefetching
- Infinite scroll pagination
- Persistent and shareable search and filters states with searchParams
- Debounced searchbar for a more optimized search functionality
- Custom type icons and glow hover effects for pokemon cards
- Loading spinners and empty states for the pokemons grid
- RSC fetching with skeleton loading for pokemon page
- Evolution card active link and navigation
- Clickable types and generation badges with links to filtered grid
- Stat bars with coded colors to show pokemon level

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/laamdev/luis-anaya-binpar-pokedex.git
cd luis-anaya-binpar-pokedex
```

2. Install dependencies:

```bash
pnpm install
```

## 🚀 Development

To run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Build

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## 👤 Author

**Luis Anaya**

- GitHub: [@laamdev](https://github.com/laamdev)
