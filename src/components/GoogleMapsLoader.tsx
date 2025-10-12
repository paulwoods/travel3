import {useEffect, useState} from 'react'

// Lightweight Google Maps JS API loader with Places library.
// Reads API key from VITE_GOOGLE_MAPS_API_KEY
export function useLoadGoogleMaps() {
    const [loaded, setLoaded] = useState<boolean>(!!(window as any).google?.maps?.places)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if ((window as any).google?.maps?.places) {
            setLoaded(true)
            return
        }

        const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps]')
        if (existing) {
            // If an existing script is present, rely on its onload or current state
            if ((window as any).google?.maps?.places) setLoaded(true)
            else existing.addEventListener('load', () => setLoaded(true))
            existing.addEventListener('error', () => setError(new Error('Failed to load Google Maps script')))
            return
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
        if (!apiKey) {
            setError(new Error('Missing VITE_GOOGLE_MAPS_API_KEY in environment'))
            return
        }

        const src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&v=weekly`
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.defer = true
        script.dataset.googleMaps = 'true'
        script.addEventListener('load', () => setLoaded(true))
        script.addEventListener('error', () => setError(new Error('Failed to load Google Maps script')))
        document.head.appendChild(script)
    }, [])

    return {loaded, error}
}

export default useLoadGoogleMaps
