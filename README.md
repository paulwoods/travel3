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

---

## Firebase (Auth, Firestore, Hosting)

This project is pre-configured for Firebase Auth and Firestore in the client and Firebase Hosting configuration for SPA
deployment.

### 1) Create Firebase project

- Create a project at https://console.firebase.google.com
- Add a Web app and copy the Web SDK config.

### 2) Configure environment variables

Copy .env.example to .env and fill in values from your Web app config:

```bash
cp .env.example .env
```

Ensure these keys are set (Vite exposes VITE_* variables):

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID (optional)

### 3) Firebase CLI and project selection

Install the Firebase CLI if you haven't:

```bash
npm i -g firebase-tools
```

Login and set the default project:

```bash
firebase login
# set your actual project id in .firebaserc or run:
firebase use your-project-id
```

### 4) Firestore security rules

Rules live in firestore.rules. To deploy rules:

```bash
firebase deploy --only firestore:rules
```

### 5) Build and deploy to Hosting

Build the app and deploy. Hosting is configured to serve dist/ and rewrite all routes to /index.html for SPA.

```bash
npm run build
firebase deploy --only hosting
```

If deploying both hosting and rules at once:

```bash
firebase deploy --only hosting,firestore:rules
```

### 6) Using Firebase in code

Import initialized instances from src/firebase.ts

```ts
import {auth, db, googleProvider} from './src/firebase'
```

Auth, Firestore, and the Firebase App are initialized from Vite env vars.


---

## Firebase Functions (Node.js)

Cloud Functions have been set up in the `functions/` directory using Node.js (runtime nodejs20) and TypeScript.

Contents:

- `functions/src/index.ts` – exports two functions:
    - `hello` (HTTP onRequest) for sanity checks
    - `optimizeRoute` (callable) – a stub to be implemented in Phase 4
- TypeScript compiles to `functions/lib/`.

Prerequisites:

- Install Firebase CLI: `npm i -g firebase-tools`
- Log in and select your project: `firebase login` and `firebase use <your-project-id>`

Install and build functions:

```bash
cd functions
npm install
npm run build
```

Run emulators (from repo root):

```bash
npm run emulators
```

This will emulate Hosting, Firestore (if configured), and Functions. The `hello` endpoint will be available at a local
Functions URL printed in the console.

Deploy Functions:

```bash
npm run deploy:functions
```

Client usage example (callable):

```ts
import {getFunctions, httpsCallable} from "firebase/functions";
import {app} from "./src/firebase"; // ensure app is initialized

const functions = getFunctions(app);
const optimizeRoute = httpsCallable(functions, "optimizeRoute");
const res = await optimizeRoute({stops: ["A", "B"]});
console.log(res.data);
```

Notes:

- `optimizeRoute` is a placeholder and does not call external APIs yet.
- Set any required API keys as environment config or secrets before implementing real logic.
