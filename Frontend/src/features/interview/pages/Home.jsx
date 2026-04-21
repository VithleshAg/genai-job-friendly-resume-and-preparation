import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const { handleLogout, user } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [fileName, setFileName] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) setFileName(file.name)
        else setFileName(null)
    }

    const filteredReports = reports.filter(r =>
        !searchQuery || (r.title || 'Untitled').toLowerCase().includes(searchQuery.toLowerCase())
    )

    const canGenerate = jobDescription.trim().length > 0 && (selfDescription.trim().length > 0 || fileName)

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className='loading-screen__bar' />
                <h1>Generating your interview plan...</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>

            {/* Navbar */}
            <nav className='home-navbar'>
                <div className='home-navbar__brand'>
                    <span className='brand-dot' />
                    <span>PrepAI</span>
                </div>
                <div className='home-navbar__actions'>
                    {user && <span className='nav-user'>@{user.username || user.email}</span>}
                    <button className='logout-btn' onClick={handleLogout}>Sign out</button>
                </div>
            </nav>

            {/* Header */}
            <header className='page-header'>
                <div className='header-tag'>AI-Powered Interview Preparation</div>
                <h1>Create Your Custom<br /><span className='highlight'>Interview Strategy</span></h1>
                <p>Our AI analyzes the job requirements and your unique profile to build a winning preparation plan.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel – Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            onChange={(e) => setJobDescription(e.target.value)}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. "Senior Frontend Engineer at Acme Corp requires proficiency in React, TypeScript..."`}
                            maxLength={5000}
                            value={jobDescription}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000</div>
                    </div>

                    {/* Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel – Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className={`dropzone ${fileName ? 'has-file' : ''}`} htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    {fileName
                                        ? <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                                    }
                                </span>
                                <p className='dropzone__title'>{fileName ? fileName : 'Click to upload or drag & drop'}</p>
                                <p className='dropzone__subtitle'>{fileName ? 'Click to change file' : 'PDF or DOCX (Max 5MB)'}</p>
                                <input
                                    ref={resumeInputRef}
                                    hidden type='file' id='resume' name='resume'
                                    accept='.pdf,.docx'
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                onChange={(e) => setSelfDescription(e.target.value)}
                                id='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years in the field..."
                                value={selfDescription}
                            />
                        </div>

                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2"/></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate your plan.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>
                        <span className='status-dot' />
                        AI Engine Ready · ~30s generation
                    </span>
                    <button
                        onClick={handleGenerateReport}
                        className='generate-btn'
                        disabled={!canGenerate}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                        Generate My Interview Strategy
                    </button>
                </div>
            </div>

            {/* Recent Reports */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <div className='section-title'>
                        <h2>Recent Interview Plans</h2>
                        <span className='section-count'>{reports.length}</span>

                        {/* NEW: Search filter */}
                        <div style={{ marginLeft: 'auto', position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Filter plans..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    background: '#091812',
                                    border: '1px solid rgba(0,229,160,0.12)',
                                    borderRadius: '0.4rem',
                                    padding: '0.35rem 0.75rem 0.35rem 2rem',
                                    color: '#dff0e8',
                                    fontSize: '0.78rem',
                                    fontFamily: 'Outfit, sans-serif',
                                    outline: 'none',
                                    width: '180px',
                                }}
                            />
                            <svg style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)', color: '#3d6650' }}
                                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                        </div>
                    </div>

                    <div className='reports-grid'>
                        {filteredReports.map(report => (
                            <div key={report._id} className='report-item'
                                onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3 className='report-item__title'>{report.title || 'Untitled Position'}</h3>
                                <p className='report-item__meta'>
                                    {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                                <p className={`report-item__score score--${report.matchScore >= 80 ? 'high' : report.matchScore >= 60 ? 'mid' : 'low'}`}>
                                    Match Score: {report.matchScore}%
                                </p>
                            </div>
                        ))}
                        {filteredReports.length === 0 && (
                            <p style={{ color: '#3d6650', fontSize: '0.82rem', gridColumn: '1/-1' }}>No plans match your search.</p>
                        )}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}

export default Home
