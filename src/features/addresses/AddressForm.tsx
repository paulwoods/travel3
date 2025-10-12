import React, {useState} from 'react'
import {Alert, Autocomplete, Box, Button, Chip, Grid, Stack, TextField, Typography} from '@mui/material'
import GooglePlacesAutocompleteField, {ParsedPlace} from '../../components/GooglePlacesAutocompleteField'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {db} from '../../firebase'
import {useAuth} from '../../auth/AuthContext'

export type AddressFormData = {
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
    tags: string[]
}

const initialData: AddressFormData = {
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
    tags: [],
}

export default function AddressForm({onSubmit}: { onSubmit?: (data: AddressFormData) => void }) {
    const [data, setData] = useState<AddressFormData>(initialData)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const {user} = useAuth()

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
        setError(null)
        setSuccess(null)
        if (!user) {
            setError('You must be signed in to save an address.')
            return
        }
        if (!data.address1 && !data.formattedAddress) {
            setError('Please enter an address or select one from search.')
            return
        }
        try {
            setSaving(true)
            const colRef = collection(db, 'users', user.uid, 'addresses')
            const payload = {
                ...data,
                uid: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }
            const docRef = await addDoc(colRef, payload)
            setSuccess('Saved!')
            onSubmit?.(data)
            // Reset form but keep success message
            setData(initialData)
            // eslint-disable-next-line no-console
            console.log('Address saved with id:', docRef.id)
        } catch (err) {
            console.error('Failed to save address', err)
            setError('Failed to save address. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Box component="form" onSubmit={submit} noValidate>
            <Stack spacing={3}>
                <div>
                    <Typography variant="h5" gutterBottom>New Address</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Start by searching for an address. You can adjust the fields after selecting.
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

                <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={data.tags}
                    onChange={(_, value) => setData({
                        ...data,
                        tags: (value || []).map(v => (typeof v === 'string' ? v.trim() : '')).filter(Boolean)
                    })}
                    renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                            <Chip variant="outlined" color="success" label={option} {...getTagProps({index})}
                                  key={option + index}/>
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Tags" placeholder="Add a tag and press Enter"
                                   helperText="Use tags to organize and filter addresses"/>
                    )}
                />

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" color="primary" disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </Button>
                    <Button type="button" variant="outlined" onClick={() => setData(initialData)} disabled={saving}>
                        Reset
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}
