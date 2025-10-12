import React, {useEffect, useMemo, useState} from 'react'
import {
    Alert,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Grid,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import TableRowsIcon from '@mui/icons-material/TableRows'
import PlaceIcon from '@mui/icons-material/Place'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {collection, deleteDoc, doc, onSnapshot, orderBy, query, Timestamp} from 'firebase/firestore'
import {db} from '../../firebase'
import {useAuth} from '../../auth/AuthContext'
import {Link as RouterLink} from 'react-router-dom'

export type AddressDoc = {
    id: string
    address1?: string
    address2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    lat?: number | null
    lng?: number | null
    placeId?: string | null
    formattedAddress?: string | null
    name?: string | null
    createdAt?: Timestamp | null
    updatedAt?: Timestamp | null
}

type ViewMode = 'table' | 'cards'

export default function AddressList() {
    const {user} = useAuth()
    const [rows, setRows] = useState<AddressDoc[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [view, setView] = useState<ViewMode>('table')

    const handleDelete = async (id: string) => {
        if (!user) return
        const confirmDelete = window.confirm('Delete this address? This action cannot be undone.')
        if (!confirmDelete) return
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'addresses', id))
        } catch (e) {
            console.error('Failed to delete address', e)
            setError('Failed to delete address. Please try again.')
        }
    }

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

    const empty = !loading && rows.length === 0

    const content = useMemo(() => {
        if (view === 'table') return <TableView rows={rows} onDelete={handleDelete}/>
        return <CardGridView rows={rows} onDelete={handleDelete}/>
    }, [view, rows])

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                    <Typography variant="h5" gutterBottom>My Addresses</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Addresses saved under your account.
                    </Typography>
                </Box>
                <ToggleButtonGroup size="small" value={view} exclusive onChange={(_, v) => v && setView(v)}>
                    <ToggleButton value="table" aria-label="Table view">
                        <TableRowsIcon fontSize="small"/>
                    </ToggleButton>
                    <ToggleButton value="cards" aria-label="Card view">
                        <ViewModuleIcon fontSize="small"/>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            {loading && (
                <Alert severity="info">Loading addresses…</Alert>
            )}
            {error && (
                <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
            )}
            {empty && (
                <Alert severity="warning">No addresses yet. Use "New Address" to add one.</Alert>
            )}

            {!loading && !empty && content}
        </Stack>
    )
}

function TableView({rows, onDelete}: { rows: AddressDoc[], onDelete: (id: string) => void }) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Label</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Postal</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell align="right">Created</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((r) => (
                        <TableRow key={r.id} hover>
                            <TableCell>{r.name || '-'}</TableCell>
                            <TableCell>{r.address1 || r.formattedAddress || '-'}</TableCell>
                            <TableCell>{r.city || '-'}</TableCell>
                            <TableCell>{r.state || '-'}</TableCell>
                            <TableCell>{r.postalCode || '-'}</TableCell>
                            <TableCell>{r.country || '-'}</TableCell>
                            <TableCell align="right">{formatTs(r.createdAt)}</TableCell>
                            <TableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <IconButton
                                        size="small"
                                        aria-label="Edit"
                                        component={RouterLink}
                                        to={`/addresses/${r.id}/edit`}
                                    >
                                        <EditIcon fontSize="small"/>
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        aria-label="Delete"
                                        onClick={() => onDelete(r.id)}
                                    >
                                        <DeleteIcon fontSize="small"/>
                                    </IconButton>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function CardGridView({rows, onDelete}: { rows: AddressDoc[], onDelete: (id: string) => void }) {
    return (
        <Grid container spacing={2}>
            {rows.map((r) => (
                <Grid item xs={12} sm={6} md={4} key={r.id}>
                    <Card>
                        <CardHeader
                            avatar={<PlaceIcon color="primary"/>}
                            title={r.name || r.address1 || r.formattedAddress || 'Untitled'}
                            subheader={formatTs(r.createdAt)}
                            action={
                                <Tooltip title={`${r.lat ?? '-'}, ${r.lng ?? '-'}`}>
                  <span>
                    <IconButton size="small" disabled={!r.lat || !r.lng}>
                      <AccessTimeIcon fontSize="small"/>
                    </IconButton>
                  </span>
                                </Tooltip>
                            }
                        />
                        <CardContent>
                            <Stack spacing={0.5}>
                                <Typography variant="body2" color="text.secondary">
                                    {(r.address1 || r.formattedAddress) ?? '-'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {[r.city, r.state, r.postalCode].filter(Boolean).join(', ') || '-'}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{mt: 1}}>
                                    {r.country && <Chip label={r.country} size="small"/>}
                                    {r.placeId && <Chip label="Places" size="small" color="secondary"/>}
                                </Stack>
                            </Stack>
                        </CardContent>
                        <CardActions sx={{justifyContent: 'flex-end'}}>
                            <IconButton
                                size="small"
                                aria-label="Edit"
                                component={RouterLink}
                                to={`/addresses/${r.id}/edit`}
                            >
                                <EditIcon fontSize="small"/>
                            </IconButton>
                            <IconButton
                                size="small"
                                aria-label="Delete"
                                onClick={() => onDelete(r.id)}
                            >
                                <DeleteIcon fontSize="small"/>
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

function formatTs(ts?: Timestamp | null) {
    if (!ts) return '-'
    try {
        const d = ts.toDate()
        return d.toLocaleString()
    } catch {
        return '-'
    }
}
