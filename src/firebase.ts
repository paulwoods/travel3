// Firebase initialization for Auth, Firestore, and (optionally) Analytics.
// Uses Vite env vars (VITE_FIREBASE_*) so no secrets are committed.
// Fill in the values in a local .env file (see .env.example).

import {FirebaseApp, getApps, initializeApp} from 'firebase/app'
import {type Auth, getAuth, GoogleAuthProvider} from 'firebase/auth'
import {type Firestore, getFirestore} from 'firebase/firestore'

// Build config from Vite env vars
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
}

function assertConfig(cfg: Record<string, string | undefined>) {
    const missing = Object.entries(cfg)
        .filter(([, v]) => !v)
        .map(([k]) => k)
    if (missing.length) {
        // Don't throw to allow building other parts; log a helpful warning instead.
        // This module can still be imported safely, but services won't be usable until configured.
        console.warn(
            `Firebase config is missing the following keys: ${missing.join(', ')}.\n` +
            'Create a .env file based on .env.example and restart the dev server.'
        )
    }
}

assertConfig(firebaseConfig)

let app: FirebaseApp
if (!getApps().length) {
    app = initializeApp(firebaseConfig)
} else {
    app = getApps()[0]!
}

// Export initialized services
export const auth: Auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db: Firestore = getFirestore(app)

export default app
