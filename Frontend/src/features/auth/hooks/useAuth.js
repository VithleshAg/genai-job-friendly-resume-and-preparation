import { useContext } from "react"
import { AuthContext } from "../context"
import { login, register, logout, getMe } from "../services/authService"
import { useEffect } from "react"

export const useAuth = () => {
    const { loading, setLoading, user, setUser, message, setMessage, initialized, setInitialized, token, setToken } = useContext(AuthContext)

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            setToken(data.token)
            localStorage.setItem('token', data.token)  // persist across refresh
            setMessage({ type: 'success', text: data.message || 'Login successful' })
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Login failed' })
            console.error("Login failed:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            setToken(data.token)
            localStorage.setItem('token', data.token)  // persist across refresh
            setMessage({ type: 'success', text: data.message || 'Registration successful' })
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Registration failed' })
            console.error("Registration failed:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
            setToken(null)
            localStorage.removeItem('token')
            setMessage({ type: 'success', text: data.message || 'Logout successful' })
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Logout failed' })
            console.error("Logout failed:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (initialized || !token) {
            // !token => No token at all, don't even call the API
            // initialized => already ran once, don't call again
            setLoading(false)
            setInitialized(true)
            return
        }
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (error) {
                localStorage.removeItem('token')
                setToken(null)
                console.error("Failed to fetch user:", error)
            } finally {
                setLoading(false)
                setInitialized(true)
            }
        }
        getAndSetUser()
    }, [initialized])

    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ type: '', text: '' })
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [message])

    return { loading, handleLogin, handleRegister, handleLogout, user, message, setMessage, token }
}