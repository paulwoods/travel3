import React, {useState} from 'react'
import {Box, Button, Grid, Stack, TextField, Typography} from '@mui/material'
import GooglePlacesAutocompleteField, {ParsedPlace} from '../../components/GooglePlacesAutocompleteField'

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
}

export default function AddressForm({onSubmit}: { onSubmit?: (data: AddressFormData) => void }) {
    const [data, setData] = useState<AddressFormData>(initialData)

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

    function submit(e: React.FormEvent) {
        e.preventDefault()
        onSubmit?.(data)
        // For now, just log it. Persistence will be implemented in the next task.
        // eslint-disable-next-line no-console
        console.log('Address submit:', data)
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
                    <Button type="submit" variant="contained" color="primary">Save</Button>
                    <Button type="button" variant="outlined" onClick={() => setData(initialData)}>Reset</Button>
                </Stack>
            </Stack>
        </Box>
    )
}
