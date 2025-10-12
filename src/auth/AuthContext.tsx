import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {onAuthStateChanged, signInWithPopup, signOut as fbSignOut, User} from 'firebase/auth'
import {auth, db, googleProvider} from '../firebase'
import {doc, getDoc, serverTimestamp, setDoc} from 'firebase/firestore'

export type AuthContextValue = {
    user: User | null
    loading: boolean
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function ensureUserProfile(u: User) {
    try {
        const userRef = doc(db, 'users', u.uid)
        const snap = await getDoc(userRef)
        if (!snap.exists()) {
            const providerIds = (u.providerData || []).map((p) => p?.providerId).filter(Boolean)
            await setDoc(userRef, {
                uid: u.uid,
                displayName: u.displayName ?? null,
                email: u.email ?? null,
                photoURL: u.photoURL ?? null,
                providerIds,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
            })
        } else {
            await setDoc(userRef, {lastLoginAt: serverTimestamp()}, {merge: true})
        }
    } catch (e) {
        console.error('Failed to ensure user profile in Firestore', e)
    }
}

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const lastProcessedUidRef = useRef<string | null>(null)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u)
            setLoading(false)
            if (u && lastProcessedUidRef.current !== u.uid) {
                lastProcessedUidRef.current = u.uid
                await ensureUserProfile(u)
            }
        })
        return () => unsub()
    }, [])

    const signInWithGoogle = async () => {
        googleProvider.setCustomParameters({prompt: 'select_account'})
        await signInWithPopup(auth, googleProvider)
    }

    const signOut = async () => {
        await fbSignOut(auth)
    }

    const value = useMemo<AuthContextValue>(() => ({user, loading, signInWithGoogle, signOut}), [user, loading])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
