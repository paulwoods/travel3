import {
    AppBar,
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Grid,
    Link,
    Paper,
    Stack,
    Toolbar,
    Typography
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import GoogleIcon from '@mui/icons-material/Google'
import MapIcon from '@mui/icons-material/Map'
import AltRouteIcon from '@mui/icons-material/AltRoute'
import {Link as RouterLink, Route, Routes} from 'react-router-dom'
import {useAuth} from './auth/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import AddressForm from './features/addresses/AddressForm'
import AddressList from './features/addresses/AddressList'
import AddressEdit from './features/addresses/AddressEdit'

function Home() {
    const {user, loading, signInWithGoogle} = useAuth()
    return (
        <Box component="section" sx={{py: {xs: 6, md: 10}}}>
            <Container maxWidth="lg">
                <Stack spacing={8}>
                    <Stack direction={{xs: 'column', md: 'row'}} spacing={4} alignItems="center"
                           justifyContent="space-between">
                        <Box sx={{flex: 1}}>
                            <Typography variant="h2" gutterBottom sx={{fontWeight: 900}}>
                                Plan multi-stop routes in minutes
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{maxWidth: 720}}>
                                Save places you love, organize stops, and optimize your path — all with a sleek
                                neon-dark interface.
                            </Typography>
                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} sx={{mt: 3}}>
                                {user ? (
                                    <Button component={RouterLink} to="/addresses" size="large" variant="contained"
                                            color="primary" startIcon={<MapIcon/>}>
                                        Open Address Book
                                    </Button>
                                ) : (
                                    <Button size="large" variant="contained" color="primary" startIcon={<GoogleIcon/>}
                                            disabled={loading} onClick={signInWithGoogle}>
                                        {loading ? 'Loading…' : 'Sign in with Google'}
                                    </Button>
                                )}
                                <Button component="a" href="#features" size="large" variant="outlined" color="secondary"
                                        startIcon={<AutoAwesomeIcon/>}>
                                    See features
                                </Button>
                            </Stack>
                        </Box>
                        <Box sx={{flex: 1, width: '100%'}}>
                            <Paper elevation={0} sx={{p: 2, borderRadius: 3, backdropFilter: 'blur(6px)'}}>
                                <Stack spacing={1}>
                                    <Typography variant="overline" color="text.secondary">Preview</Typography>
                                    <Box sx={{
                                        height: 220,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(255,0,229,0.12))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Stack alignItems="center" spacing={1}>
                                            <AltRouteIcon color="primary" sx={{
                                                fontSize: 48,
                                                filter: 'drop-shadow(0 0 18px rgba(0,229,255,0.7))'
                                            }}/>
                                            <Typography variant="body2" color="text.secondary">Optimized route
                                                preview</Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Box>
                    </Stack>

                    <Box id="features">
                        <Typography variant="h3" gutterBottom>Features</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <FeatureCard
                                    icon={<MapIcon color="primary"/>}
                                    title="Address book"
                                    text="Save and manage your places with Google Places Autocomplete."/>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FeatureCard
                                    icon={<AltRouteIcon color="secondary"/>}
                                    title="Route planning"
                                    text="Arrange stops, and soon optimize the best order for your trip."/>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FeatureCard
                                    icon={<AutoAwesomeIcon color="success"/>}
                                    title="Neon dark UI"
                                    text="A crisp, modern theme with subtle glow and smooth interactions."/>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box>
                        <Typography variant="h3" gutterBottom>How it works</Typography>
                        <Grid container spacing={2}>
                            {[
                                {n: 1, t: 'Sign in with Google'},
                                {n: 2, t: 'Add addresses to your book'},
                                {n: 3, t: 'Build your route and optimize'},
                            ].map((step) => (
                                <Grid item xs={12} md={4} key={step.n}>
                                    <Paper elevation={0} sx={{p: 3, borderRadius: 3}}>
                                        <Chip label={step.n} color="success" size="small" sx={{mb: 1}}/>
                                        <Typography variant="h6">{step.t}</Typography>
                                        <Typography variant="body2" color="text.secondary">It only takes a minute to get
                                            started.</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Paper elevation={0} sx={{p: 4, borderRadius: 3, textAlign: 'center'}}>
                        <Typography variant="h5" gutterBottom>Ready to plan your next trip?</Typography>
                        {user ? (
                            <Button component={RouterLink} to="/addresses/new" variant="contained" color="primary"
                                    size="large" startIcon={<MapIcon/>}>
                                Add a new address
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" size="large" startIcon={<GoogleIcon/>}
                                    onClick={signInWithGoogle} disabled={loading}>
                                {loading ? 'Loading…' : 'Get started — it’s free'}
                            </Button>
                        )}
                    </Paper>
                </Stack>
            </Container>
        </Box>
    )
}

function FeatureCard({icon, title, text}: { icon: any, title: string, text: string }) {
    return (
        <Paper elevation={0} sx={{p: 3, borderRadius: 3, height: '100%'}}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{mt: 0.5}}>{icon}</Box>
                <Box>
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">{text}</Typography>
                </Box>
            </Stack>
        </Paper>
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
                    {user && <Link component={RouterLink} to="/addresses">Addresses</Link>}
                    {user && <Link component={RouterLink} to="/addresses/new">New Address</Link>}
                </Stack>
            </Container>

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route element={<PrivateRoute/>}>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/addresses" element={
                        <Container maxWidth="lg" sx={{py: 4}}>
                            <AddressList/>
                        </Container>
                    }/>
                    <Route path="/addresses/new" element={
                        <Container maxWidth="md" sx={{py: 4}}>
                            <AddressForm/>
                        </Container>
                    }/>
                    <Route path="/addresses/:id/edit" element={
                        <Container maxWidth="md" sx={{py: 4}}>
                            <AddressEdit/>
                        </Container>
                    }/>
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </Box>
    )
}

export default App
