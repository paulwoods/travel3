import {useState} from 'react'
import {AppBar, Box, Button, Chip, Container, Link, Stack, TextField, Toolbar, Typography,} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

function App() {
    const [count, setCount] = useState(0)

    return (
        <Box>
            <AppBar position="sticky" color="transparent" enableColorOnDark>
                <Toolbar>
                    <AutoAwesomeIcon
                        sx={{mr: 1, color: 'primary.main', filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.75))'}}/>
                    <Typography variant="h6" sx={{flexGrow: 1, fontWeight: 800}}>
                        Dark Neon UI
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Chip color="success" label="alpha" size="small"/>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{py: 6}}>
                <Stack spacing={4} alignItems="flex-start">
                    <Box>
                        <Typography variant="h2" gutterBottom>
                            Vite + React + MUI
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            A modern dark neon theme powered by Material UI. Buttons, links and inputs glow on
                            hover/focus.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button variant="contained" color="primary" onClick={() => setCount((c) => c + 1)}
                                startIcon={<AutoAwesomeIcon/>}>
                            Count is {count}
                        </Button>
                        <Button variant="contained" color="secondary">Secondary</Button>
                        <Button variant="outlined" color="success">Success</Button>
                    </Stack>

                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} sx={{width: '100%'}}>
                        <TextField fullWidth label="Search" placeholder="Type to search..."/>
                        <TextField fullWidth label="Email" placeholder="you@example.com"/>
                    </Stack>

                    <Stack direction="row" spacing={3}>
                        <Link href="https://vitejs.dev" target="_blank" rel="noreferrer">
                            Vite docs
                        </Link>
                        <Link href="https://mui.com" target="_blank" rel="noreferrer">
                            MUI docs
                        </Link>
                        <Link href="https://react.dev" target="_blank" rel="noreferrer">
                            React docs
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    )
}

export default App
