import React from 'react'
import { Navigate } from 'react-router-dom'
function Protected({ authenticated, children }) {
    if (!authenticated) {
        return <Navigate to="/login" replace />
    }
    return children
}
export default Protected