import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {CssBaseline, ThemeProvider} from '@mui/material'
import theme from './theme'
import {BrowserRouter} from 'react-router-dom'
import {AuthProvider} from './auth/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
