import React, {useState} from 'react'
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Stack,
    Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddressSelector, {Stop} from './AddressSelector'

export default function RoutePlanner() {
    const [stops, setStops] = useState<Stop[]>([])

    function addStop(stop: Stop) {
        setStops((s) => [...s, stop])
    }

    function removeStop(id: string) {
        setStops((s) => s.filter((x) => x.id !== id))
    }

    function clearStops() {
        setStops([])
    }

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h4" gutterBottom>Route Planner</Typography>
                <Typography variant="body2" color="text.secondary">
                    Add stops from your saved addresses or by searching for a new place.
                </Typography>
            </Box>

            <AddressSelector onAdd={addStop}/>

            <Paper elevation={0} sx={{p: 2, borderRadius: 2}}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1}}>
                    <Typography variant="h6">Stops ({stops.length})</Typography>
                    <Button size="small" onClick={clearStops} disabled={!stops.length}>Clear</Button>
                </Stack>
                {stops.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No stops yet. Add one above.</Typography>
                ) : (
                    <List>
                        {stops.map((s, idx) => (
                            <ListItem key={s.id} divider>
                                <ListItemText
                                    primary={`${idx + 1}. ${s.label}`}
                                    secondary={s.source === 'saved' ? 'Saved address' : 'New place'}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => removeStop(s.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Stack>
    )
}
