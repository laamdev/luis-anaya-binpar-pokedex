# Binpar Test - Pokédex Web App

A modern Pokédex web application created by Luis Anaya as a technical assessment for BinPar. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- Next.js 15 with App Router and React 19
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components for accessible UI elements
- ESLint for code quality
- Turbopack for faster development
- TanStack React Query for efficient data fetching and caching
- Responsive design for all devices
- Interactive Pokémon cards with hover effects
- Detailed Pokémon information pages
- Type-based color coding
- Generation-based organization

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

## 🧪 Testing and Quality

To run the linter:

```bash
pnpm lint
```

## 📁 Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── lib/             # Utility functions and constants
├── api/             # API integration and queries
└── types/           # TypeScript type definitions
```

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type safety and better developer experience
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Customizable, accessible components
- [TanStack React Query](https://tanstack.com/query/latest) - Powerful data fetching and caching
- [PokeAPI](https://pokeapi.co/) - Pokémon data API

## 📝 API Integration

The application uses the PokeAPI to fetch Pokémon data. The integration is handled through TanStack React Query hooks and queries in the `src/api` directory, providing efficient data fetching, caching, and state management.

## 🎨 UI Components

The application features several custom components:

- Pokémon Cards with hover effects
- Type badges with icons
- Tooltips for additional information(type badge in card)
- Responsive grid layouts
- Loading states and animations

## 👤 Author

**Luis Anaya**

- GitHub: [@laamdev](https://github.com/laamdev)
