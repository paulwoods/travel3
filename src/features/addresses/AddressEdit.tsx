import React, {useEffect, useState} from 'react'
import {Alert, Box, Button, Grid, Stack, TextField, Typography} from '@mui/material'
import GooglePlacesAutocompleteField, {ParsedPlace} from '../../components/GooglePlacesAutocompleteField'
import {doc, getDoc, serverTimestamp, updateDoc} from 'firebase/firestore'
import {db} from '../../firebase'
import {useAuth} from '../../auth/AuthContext'
import {useNavigate, useParams} from 'react-router-dom'

export type AddressEditData = {
    address1: string
    address2: string
    city: string
    state: string
    postalCode: string
    country: string
    lat: number | null
    lng: number | null
    placeId: string | null
    formattedAddress: string | null
    name: string | null
}

const emptyData: AddressEditData = {
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    lat: null,
    lng: null,
    placeId: null,
    formattedAddress: null,
    name: null,
}

export default function AddressEdit() {
    const {id} = useParams<{ id: string }>()
    const {user} = useAuth()
    const navigate = useNavigate()
    const [data, setData] = useState<AddressEditData>(emptyData)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            if (!user || !id) return
            setLoading(true)
            setError(null)
            try {
                const ref = doc(db, 'users', user.uid, 'addresses', id)
                const snap = await getDoc(ref)
                if (!snap.exists()) {
                    setError('Address not found.')
                    setLoading(false)
                    return
                }
                const d = snap.data() as any
                setData({
                    address1: d.address1 ?? '',
                    address2: d.address2 ?? '',
                    city: d.city ?? '',
                    state: d.state ?? '',
                    postalCode: d.postalCode ?? '',
                    country: d.country ?? '',
                    lat: d.lat ?? null,
                    lng: d.lng ?? null,
                    placeId: d.placeId ?? null,
                    formattedAddress: d.formattedAddress ?? null,
                    name: d.name ?? null,
                })
            } catch (e) {
                console.error('Failed to load address', e)
                setError('Failed to load address.')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [user, id])

    const handlePlace = (p: ParsedPlace) => {
        const address1 = [p.streetNumber, p.route].filter(Boolean).join(' ')
        setData((d) => ({
            ...d,
            address1,
            city: p.city || '',
            state: p.state || '',
            postalCode: p.postalCode || '',
            country: p.country || '',
            lat: p.lat,
            lng: p.lng,
            placeId: p.placeId,
            formattedAddress: p.formattedAddress,
            name: p.name,
        }))
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!user || !id) return
        setError(null)
        setSuccess(null)
        if (!data.address1 && !data.formattedAddress) {
            setError('Please enter an address or select one from search.')
            return
        }
        try {
            setSaving(true)
            const ref = doc(db, 'users', user.uid, 'addresses', id)
            await updateDoc(ref, {
                ...data,
                updatedAt: serverTimestamp(),
            })
            setSuccess('Updated!')
            // Navigate back to list after a short delay
            setTimeout(() => navigate('/addresses'), 500)
        } catch (err) {
            console.error('Failed to update address', err)
            setError('Failed to update address. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <Alert severity="info">Loading address…</Alert>
    }

    return (
        <Box component="form" onSubmit={submit} noValidate>
            <Stack spacing={3}>
                <div>
                    <Typography variant="h5" gutterBottom>Edit Address</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Update the address details below. You can search to auto-fill fields.
                    </Typography>
                </div>

                {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
                {success && <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>}

                <GooglePlacesAutocompleteField label="Search address" onPlaceSelected={handlePlace}/>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            label="Address line 1"
                            value={data.address1}
                            onChange={(e) => setData({...data, address1: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Address line 2"
                            value={data.address2}
                            onChange={(e) => setData({...data, address2: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <TextField
                            fullWidth
                            label="City"
                            value={data.city}
                            onChange={(e) => setData({...data, city: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="State/Region"
                            value={data.state}
                            onChange={(e) => setData({...data, state: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Postal code"
                            value={data.postalCode}
                            onChange={(e) => setData({...data, postalCode: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Country"
                            value={data.country}
                            onChange={(e) => setData({...data, country: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Latitude"
                            value={data.lat ?? ''}
                            InputProps={{readOnly: true}}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Longitude"
                            value={data.lng ?? ''}
                            InputProps={{readOnly: true}}
                        />
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={saving}>
                        {saving ? 'Saving…' : 'Save Changes'}
                    </Button>
                    <Button type="button" variant="outlined" onClick={() => navigate('/addresses')} disabled={saving}>
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}
