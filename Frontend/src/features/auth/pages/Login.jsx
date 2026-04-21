import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import "../form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
    const { loading, handleLogin, user, message: { type, text } } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
    }

    useEffect(() => { if (user) navigate('/') }, [user])
    useEffect(() => { if (type === 'success') navigate('/') }, [type])

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className='loading-screen__bar' />
                <h1>Authenticating...</h1>
            </main>
        )
    }

    return (
        <main className="auth-main">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <span className="auth-logo__dot" />
                            <span>Preparation AI System</span>
                        </div>
                        <h1>Welcome back</h1>
                        <p>Sign in to access your personalized interview plans.</p>
                    </div>

                    {text && type === 'error' && (
                        <div className="auth-error">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {text}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                </span>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email" id="email" name="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </span>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPass ? "text" : "password"}
                                    id="password" name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    required
                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    style={{
                                        position: 'absolute', right: '0.875rem', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', color: '#3a6650', display: 'flex'
                                    }}>
                                    {showPass
                                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    }
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit">
                            Sign In →
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Login
