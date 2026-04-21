import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export const register = async ({ username, email, password }) => {
    try {
        const response = await api.post('/api/auth/register', { username, email, password })
        return response.data
    } catch (error) {
        console.error("Error in register:", error)
        throw error.response ? error.response.data : { message: "Network error" }
    }
}

export const login = async ({ email, password }) => {
    try {
        const response = await api.post('/api/auth/login', { email, password })
        return response.data
    } catch (error) {
        console.error("Error in login:", error)
        throw error.response ? error.response.data : { message: "Network error" }
    }
}

export const logout = async () => {
    try {
        const response = await api.post('/api/auth/logout')
        return response.data
    } catch (error) {
        console.error("Error in logout:", error)
        throw error.response ? error.response.data : { message: "Network error" }
    }
}

export const getMe = async () => {
    try {
        const response = await api.get('/api/auth/get-me')
        return response.data
    } catch (error) {
        console.error("Error in getMe:", error)
        throw error.response ? error.response.data : { message: "Network error" }
    }
}