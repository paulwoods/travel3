# Node.js App (with Vite + React source)

This repository now includes a Node.js server entry point while keeping the original Vite + React + TypeScript source.

## Prerequisites

- Node.js 18+ recommended
- npm (or pnpm/yarn)

## Setup

Install dependencies:

```bash
npm install
```

## Run as a Node.js app

Starts a small Node HTTP server that serves the static files in the repo (index.html, src, etc.).

```bash
npm start
```

The server will run at http://localhost:3000 (or the port specified in the `PORT` env var).

## Development (Vite)

Start the Vite dev server for React development with hot reload:

```bash
npm run dev
```

The dev server usually runs at http://localhost:5173.

## Build (Vite)

```bash
npm run build
```

The production build will be emitted to the `dist/` directory.

## Preview production build (Vite)

```bash
npm run preview
```

This will serve the contents of `dist/` locally for inspection.
