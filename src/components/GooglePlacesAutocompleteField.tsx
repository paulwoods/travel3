import React, {useEffect, useRef, useState} from 'react'
import TextField, {TextFieldProps} from '@mui/material/TextField'
import {useLoadGoogleMaps} from './GoogleMapsLoader'

export type ParsedPlace = {
    placeId: string | null
    formattedAddress: string | null
    name: string | null
    streetNumber: string | null
    route: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    lat: number | null
    lng: number | null
}

function parsePlace(place: any): ParsedPlace {
    const components: Record<string, string> = {}
    const address_components = place.address_components || []
    for (const c of address_components) {
        const types: string[] = c.types || []
        if (types.includes('street_number')) components.street_number = c.long_name
        if (types.includes('route')) components.route = c.long_name
        if (types.includes('locality')) components.locality = c.long_name
        if (types.includes('administrative_area_level_1')) components.admin_area_l1 = c.short_name
        if (types.includes('postal_code')) components.postal_code = c.long_name
        if (types.includes('country')) components.country = c.long_name
    }
    const loc = place.geometry?.location
    return {
        placeId: place.place_id ?? null,
        formattedAddress: place.formatted_address ?? null,
        name: place.name ?? null,
        streetNumber: components.street_number ?? null,
        route: components.route ?? null,
        city: components.locality ?? null,
        state: components.admin_area_l1 ?? null,
        postalCode: components.postal_code ?? null,
        country: components.country ?? null,
        lat: loc ? loc.lat() : null,
        lng: loc ? loc.lng() : null,
    }
}

export default function GooglePlacesAutocompleteField(
    {onPlaceSelected, ...props}: { onPlaceSelected?: (p: ParsedPlace) => void } & TextFieldProps
) {
    const {loaded, error} = useLoadGoogleMaps()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const autocompleteRef = useRef<any>(null)
    const [value, setValue] = useState('')

    useEffect(() => {
        if (!loaded || !inputRef.current || autocompleteRef.current) return
        try {
            const google = (window as any).google as any
            const ac = new google.maps.places.Autocomplete(inputRef.current, {
                fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id'],
                types: ['geocode'],
            })
            autocompleteRef.current = ac
            ac.addListener('place_changed', () => {
                const place = ac.getPlace()
                const parsed = parsePlace(place)
                setValue(parsed.formattedAddress || parsed.name || '')
                onPlaceSelected?.(parsed)
            })
        } catch (e) {
            console.error('Failed to init autocomplete', e)
        }
    }, [loaded, onPlaceSelected])

    return (
        <TextField
            fullWidth
            label={props.label ?? 'Search address'}
            placeholder={props.placeholder ?? 'Start typing an address…'}
            inputRef={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            helperText={error ? 'Google Maps failed to load. Set VITE_GOOGLE_MAPS_API_KEY.' : props.helperText}
            {...props}
        />
    )
}
