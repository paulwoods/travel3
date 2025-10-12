import React from 'react'
import {Navigate, Outlet, useLocation} from 'react-router-dom'
import {Box, CircularProgress, Typography} from '@mui/material'
import {useAuth} from '../auth/AuthContext'

/**
 * PrivateRoute
 * Wrap protected routes under this element:
 * <Route element={<PrivateRoute/>}>
 *   <Route path="/about" element={<About/>} />
 * </Route>
 */
export default function PrivateRoute() {
    const {user, loading} = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh'}}>
                <Box sx={{textAlign: 'center'}}>
                    <CircularProgress color="primary"/>
                    <Typography variant="body2" sx={{mt: 2}} color="text.secondary">
                        Checking authentication…
                    </Typography>
                </Box>
            </Box>
        )
    }

    if (!user) {
        return <Navigate to="/" replace state={{from: location}}/>
    }

    return <Outlet/>
}
