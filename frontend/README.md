# AgriSmart AI — Frontend

This directory contains the Next.js frontend application for AgriSmart AI.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3
- **Linting:** ESLint

## Getting Started

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
frontend/
├── src/
│   └── app/
│       ├── layout.tsx       # Root layout
│       ├── page.tsx         # Home page
│       ├── check-crop/      # Capture → review → analysis journey
│       └── globals.css      # Global styles
├── src/components/          # UI components (camera, guidance, AgriBot)
├── src/lib/                 # API clients and diagnosis services
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## Development

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
