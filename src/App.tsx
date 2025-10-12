import {useState} from 'react'
import {AppBar, Avatar, Box, Button, Chip, Container, Link, Stack, TextField, Toolbar, Typography,} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import GoogleIcon from '@mui/icons-material/Google'
import {Link as RouterLink, Route, Routes} from 'react-router-dom'
import {useAuth} from './auth/AuthContext'

function Home() {
    const [count, setCount] = useState(0)
    return (
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
    )
}

function About() {
    return (
        <Container maxWidth="md" sx={{py: 6}}>
            <Typography variant="h3" gutterBottom>About</Typography>
            <Typography color="text.secondary">
                This is a demo route using React Router. Modify routes in src/App.tsx.
            </Typography>
        </Container>
    )
}

function NotFound() {
    return (
        <Container maxWidth="md" sx={{py: 6}}>
            <Typography variant="h4" gutterBottom>404 - Not Found</Typography>
            <Typography color="text.secondary">The page you are looking for does not exist.</Typography>
        </Container>
    )
}

function App() {
    const {user, loading, signInWithGoogle, signOut} = useAuth()

    async function handleSignIn() {
        try {
            await signInWithGoogle()
        } catch (e) {
            console.error('Sign-in failed', e)
            alert('Google sign-in failed. Check console for details.')
        }
    }

    async function handleSignOut() {
        try {
            await signOut()
        } catch (e) {
            console.error('Sign-out failed', e)
            alert('Sign-out failed. Check console for details.')
        }
    }

    return (
        <Box>
            <AppBar position="sticky" color="transparent" enableColorOnDark>
                <Toolbar>
                    <AutoAwesomeIcon
                        sx={{mr: 1, color: 'primary.main', filter: 'drop-shadow(0 0 12px rgba(0,229,255,0.75))'}}/>
                    <Typography variant="h6" sx={{flexGrow: 1, fontWeight: 800}}>
                        Dark Neon UI
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        {user ? (
                            <>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{mr: 1}}>
                                    <Avatar src={user.photoURL ?? undefined} alt={user.displayName ?? undefined}
                                            sx={{width: 28, height: 28}}/>
                                    <Typography variant="body2">{user.displayName || user.email}</Typography>
                                </Stack>
                                <Button variant="outlined" color="inherit" onClick={handleSignOut}>Sign out</Button>
                            </>
                        ) : (
                            <Button variant="contained" color="primary" startIcon={<GoogleIcon/>}
                                    onClick={handleSignIn} disabled={loading}>
                                {loading ? 'Loading…' : 'Sign in with Google'}
                            </Button>
                        )}
                        <Chip color="success" label="alpha" size="small"/>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{py: 2}}>
                <Stack direction="row" spacing={3} sx={{mb: 2}}>
                    <Link component={RouterLink} to="/">Home</Link>
                    <Link component={RouterLink} to="/about">About</Link>
                </Stack>
            </Container>

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Box>
    )
}

export default App
