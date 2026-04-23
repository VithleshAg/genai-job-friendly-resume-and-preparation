import { createContext, useState } from "react"
import { ToastContainer, toast } from 'react-toastify'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [initialized, setInitialized] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token') || null)

    if(message.text && message.type === 'success')
        toast.success(message.text)
    else if(message.text && message.type === 'error')
        toast.error(message.text) 

    return (
        <AuthContext.Provider value={{ loading, setLoading, user, setUser, message, setMessage, initialized, setInitialized, token, setToken }}>
            <ToastContainer />
            {children}
        </AuthContext.Provider>
    )
}