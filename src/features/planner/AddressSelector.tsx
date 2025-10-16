import React, {useEffect, useMemo, useState} from 'react'
import {Alert, Autocomplete, Box, Button, Paper, Stack, Tab, Tabs, TextField, Typography} from '@mui/material'
import {collection, onSnapshot, orderBy, query} from 'firebase/firestore'
import {db} from '../../firebase'
import {useAuth} from '../../auth/AuthContext'
import GooglePlacesAutocompleteField, {ParsedPlace} from '../../components/GooglePlacesAutocompleteField'
import {AddressDoc} from '../addresses/AddressList'

export type Stop = {
    id: string
    label: string
    source: 'saved' | 'new'
    data: Partial<AddressDoc> | ParsedPlace
}

export default function AddressSelector({onAdd}: { onAdd: (stop: Stop) => void }) {
    const {user} = useAuth()
    const [tab, setTab] = useState<'saved' | 'new'>('saved')

    // Saved addresses state
    const [rows, setRows] = useState<AddressDoc[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Selection state
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const selectedDoc = useMemo(() => rows.find(r => r.id === selectedId) || null, [rows, selectedId])

    // New place state
    const [newPlace, setNewPlace] = useState<ParsedPlace | null>(null)

    useEffect(() => {
        if (!user) return
        setLoading(true)
        setError(null)
        const colRef = collection(db, 'users', user.uid, 'addresses')
        const q = query(colRef, orderBy('createdAt', 'desc'))
        const unsub = onSnapshot(q, (snap) => {
            const list: AddressDoc[] = []
            snap.forEach((doc) => {
                const data = doc.data() as any
                list.push({id: doc.id, ...data})
            })
            setRows(list)
            setLoading(false)
        }, (err) => {
            console.error('Failed to load addresses', err)
            setError('Failed to load addresses.')
            setLoading(false)
        })
        return () => unsub()
    }, [user])

    function addSaved() {
        if (!selectedDoc) return
        onAdd({
            id: `saved:${selectedDoc.id}`,
            label: selectedDoc.name || selectedDoc.formattedAddress || 'Saved address',
            source: 'saved',
            data: selectedDoc,
        })
        setSelectedId(null)
    }

    function addNew() {
        if (!newPlace) return
        onAdd({
            id: `new:${newPlace.placeId || Math.random().toString(36).slice(2)}`,
            label: newPlace.formattedAddress || newPlace.name || 'New place',
            source: 'new',
            data: newPlace,
        })
        setNewPlace(null)
    }

    return (
        <Paper elevation={0} sx={{p: 2, borderRadius: 2}}>
            <Stack spacing={2}>
                <Box>
                    <Typography variant="h6">Add a stop</Typography>
                    <Typography variant="body2" color="text.secondary">Choose from saved addresses or add a new
                        place.</Typography>
                </Box>

                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{minHeight: 36}}>
                    <Tab value="saved" label="Saved" sx={{minHeight: 36}}/>
                    <Tab value="new" label="New" sx={{minHeight: 36}}/>
                </Tabs>

                {tab === 'saved' && (
                    <Stack spacing={1}>
                        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
                        <Autocomplete
                            loading={loading}
                            options={rows}
                            getOptionLabel={(o) => o.name || o.formattedAddress || o.address1 || ''}
                            isOptionEqualToValue={(a, b) => a.id === b.id}
                            value={selectedDoc}
                            onChange={(_, val) => setSelectedId(val?.id || null)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select saved address" placeholder="Type to search…"/>
                            )}
                        />
                        <Box>
                            <Button variant="contained" onClick={addSaved} disabled={!selectedDoc}>Add stop</Button>
                        </Box>
                    </Stack>
                )}

                {tab === 'new' && (
                    <Stack spacing={1}>
                        <GooglePlacesAutocompleteField label="Search a new place"
                                                       onPlaceSelected={(p) => setNewPlace(p)}/>
                        <Box>
                            <Button variant="contained" onClick={addNew} disabled={!newPlace}>Add stop</Button>
                        </Box>
                    </Stack>
                )}
            </Stack>
        </Paper>
    )
}
