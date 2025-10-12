import {alpha, createTheme} from '@mui/material/styles'

// Neon color palette
const neonCyan = '#00e5ff'
const neonMagenta = '#ff00e5'
const neonLime = '#39ff14'
const neonYellow = '#f9f871'
const deepBg = '#0b0f14' // near-black with a hint of blue
const paperBg = '#0f1520'

const glow = (color: string, spread = 18) =>
    `0 0 ${Math.round(spread * 0.35)}px ${alpha(color, 0.3)}, 0 0 ${spread}px ${alpha(color, 0.55)}`

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: neonCyan,
            contrastText: '#0a0a0a',
        },
        secondary: {
            main: neonMagenta,
            contrastText: '#0a0a0a',
        },
        success: {main: neonLime},
        warning: {main: neonYellow},
        background: {
            default: deepBg,
            paper: paperBg,
        },
        text: {
            primary: '#e6f1ff',
            secondary: '#a8b3cf',
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial`,
        h1: {fontWeight: 800, letterSpacing: -1.2},
        h2: {fontWeight: 800, letterSpacing: -1},
        h3: {fontWeight: 700, letterSpacing: -0.6},
        button: {fontWeight: 700, textTransform: 'none', letterSpacing: 0.2},
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundImage:
                        `radial-gradient(1000px 600px at 10% -10%, ${alpha(neonCyan, 0.08)} 0%, transparent 60%),` +
                        `radial-gradient(800px 500px at 110% 10%, ${alpha(neonMagenta, 0.06)} 0%, transparent 60%)`,
                },
                '*::selection': {
                    backgroundColor: alpha(neonCyan, 0.3),
                    color: '#001219',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: `1px solid ${alpha('#9aa4b2', 0.15)}`,
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: alpha(neonCyan, 0.35),
                    boxShadow: glow(neonCyan, 12),
                    backdropFilter: 'blur(4px)',
                    transition: 'box-shadow 200ms ease, transform 200ms ease, border-color 200ms ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: glow(neonCyan, 22),
                        borderColor: alpha(neonCyan, 0.7),
                    },
                },
                containedSecondary: {
                    boxShadow: glow(neonMagenta, 18),
                    '&:hover': {boxShadow: glow(neonMagenta, 28)},
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: neonCyan,
                    textDecorationColor: alpha(neonCyan, 0.4),
                    textUnderlineOffset: '3px',
                    '&:hover': {
                        textDecorationColor: neonCyan,
                        textShadow: glow(neonCyan, 18),
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {variant: 'outlined'},
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: alpha('#ffffff', 0.02),
                        '& fieldset': {borderColor: alpha('#9aa4b2', 0.2)},
                        '&:hover fieldset': {borderColor: alpha(neonCyan, 0.6)},
                        '&.Mui-focused fieldset': {
                            borderColor: neonCyan,
                            boxShadow: glow(neonCyan, 20),
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: alpha('#0f172a', 0.6),
                    borderBottom: `1px solid ${alpha('#9aa4b2', 0.15)}`,
                    backdropFilter: 'blur(10px)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: `0 8px 24px ${alpha('#000', 0.6)}`,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    boxShadow: glow(neonLime, 12),
                },
            },
        },
    },
})

export default theme
