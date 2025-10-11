'use client'

import { useState } from 'react'
import { Loader2, FileCode, AlertTriangle, CheckCircle2, ExternalLink, GitPullRequest, Sparkles, Hash } from 'lucide-react'

// --- BASE STYLE OBJECT ---
const styles = {
  main: {
    height: '100vh',
    background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
    color: '#ffffff',
    padding: '4rem 1.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  container: {
    maxWidth: '1440px',
    margin: '0 auto'
  },
  headerWrapper: {
    textAlign: 'center',
    marginBottom: '4rem',
    position: 'relative'
  },
  glowEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
    filter: 'blur(100px)',
    pointerEvents: 'none',
    zIndex: 0
  },
  headerContent: {
    position: 'relative',
    zIndex: 1
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  mainTitle: {
    fontSize: '4rem',
    fontWeight: '900',
    background: 'linear-gradient(90deg, #ffffff 0%, #60a5fa 50%, #ffffff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '1.1rem',
    fontWeight: '300'
  },
  card: {
    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.5) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    marginBottom: '2.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
    transition: 'all 0.3s ease'
  },
  resultCard: {
    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    border: '1px solid rgba(75, 85, 99, 0.4)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
  },
  issueCard: {
    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(0, 0, 0, 0.5) 100%)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  issueMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  issueFileTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    background: 'rgba(55, 65, 81, 0.5)',
    padding: '0.4rem 0.75rem',
    borderRadius: '9999px',
    color: '#9ca3af'
  },
  issueLineTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    background: 'rgba(37, 99, 235, 0.2)',
    padding: '0.4rem 0.75rem',
    borderRadius: '9999px',
    color: '#93c5fd'
  },
  issueTypeTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.8rem',
    background: 'rgba(234, 179, 8, 0.2)',
    padding: '0.4rem 0.75rem',
    borderRadius: '9999px',
    color: '#fde047'
  },
  issueMessage: {
    color: '#f3f4f6',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '0.75rem'
  },
  suggestionBox: {
    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
    borderLeft: '4px solid #3b82f6',
    borderRadius: '0 0.5rem 0.5rem 0',
    padding: '0.75rem 1rem'
  },
  suggestionText: {
    color: '#93c5fd',
    fontSize: '0.9rem',
    display: 'flex',
    gap: '0.5rem',
    fontStyle: 'italic'
  }
}

// --- SIMPLE KEYFRAMES ---
const keyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`

// --- COMPONENTS ---
const GlowingHeader = () => (
  <div style={styles.headerWrapper}>
    <div style={styles.glowEffect}></div>
    <div style={styles.headerContent}>
      <div style={styles.headerTop}>
        <Sparkles color="#60a5fa" size={36} />
        <h1 style={styles.mainTitle}>PR Review Agent</h1>
        <Sparkles color="#60a5fa" size={36} />
      </div>
      <p style={styles.subtitle}>AI-powered code analysis for your pull requests</p>
    </div>
  </div>
)

// --- NEW ISSUE CARD ---
const IssueCard = ({ issue }) => (
  <div style={styles.issueCard}>
    <div style={styles.issueMeta}>
      {issue.file && (
        <span style={styles.issueFileTag}>
          <FileCode size={14} /> {issue.file}
        </span>
      )}
      {issue.line !== null && issue.line !== undefined && (
        <span style={styles.issueLineTag}>
          <Hash size={14} /> Line {issue.line}
        </span>
      )}
      {issue.type && (
        <span style={styles.issueTypeTag}>
          {issue.type}
        </span>
      )}
    </div>

    <p style={styles.issueMessage}>{issue.description}</p>

    {issue.suggestion && (
      <div style={styles.suggestionBox}>
        <p style={styles.suggestionText}>
          <span>💡</span>
          <span>{issue.suggestion}</span>
        </p>
      </div>
    )}
  </div>
)

// --- FILE CARD (CONTAINS ISSUES) ---
const FileCard = ({ file }) => (
  <div style={{ ...styles.card, padding: '2rem', marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <FileCode size={22} color="#60a5fa" />
      <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>{file.name}</h3>
    </div>

    {file.issues?.length > 0 ? (
      file.issues.map((issue, i) => <IssueCard key={i} issue={issue} />)
    ) : (
      <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No issues found in this file.</p>
    )}
  </div>
)

// --- MAIN COMPONENT ---
export default function PRReviewAgent() {
  const [url, setUrl] = useState('')
  const [pr, setPr] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const API = 'https://agent-prm.onrender.com'

  const analyze = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${API}/analyze-pr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: url, pr_number: parseInt(pr) })
      })
      const data = await res.json()
      if (!data?.task_id) {
        alert('Failed to start analysis.')
        setLoading(false)
        return
      }
      checkStatus(data.task_id)
    } catch (err) {
      console.error(err)
      alert('Server error.')
      setLoading(false)
    }
  }

  const checkStatus = async (id) => {
    const interval = setInterval(async () => {
      const res = await fetch(`${API}/status/${id}`)
      const data = await res.json()
      if (data.status === 'completed') {
        clearInterval(interval)
        await checkResult(id)
      }
      if (data.status === 'failed') {
        clearInterval(interval)
        alert('Analysis failed.')
        setLoading(false)
      }
    }, 2500)
  }

  const checkResult = async (id) => {
    try {
      const res = await fetch(`${API}/results/${id}`)
      const data = await res.json()
      const finalResult = data.results || data.result
      setResult(finalResult)
    } catch (err) {
      console.error(err)
      alert('Could not fetch result.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#000' }}>
      <style>{keyframes}</style>
      <main style={styles.main}>
        <div style={styles.container}>
          <GlowingHeader />

          <div style={styles.card}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Analyze Pull Request</h2>
            <input
              placeholder="Repository URL"
              style={{ ...styles.input, marginBottom: '1rem', width: '100%', padding: '1rem' }}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <input
              placeholder="PR Number"
              style={{ ...styles.input, marginBottom: '1.5rem', width: '100%', padding: '1rem' }}
              value={pr}
              onChange={(e) => setPr(e.target.value)}
            />
            <button
              onClick={analyze}
              disabled={loading}
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                border: 'none',
                padding: '1.25rem 2rem',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                width: '100%',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze PR'}
            </button>
          </div>

          {loading && (
            <div style={styles.card}>
              <Loader2 size={28} color="#60a5fa" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Processing pull request...</p>
            </div>
          )}

          {result && (
            <div style={styles.resultCard}>
              <h2 style={{ color: '#fff', marginBottom: '2rem' }}>{result.pr_title}</h2>
              <a href={result.pr_url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', marginBottom: '2rem', display: 'block' }}>
                View PR
              </a>
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                Analyzed on {new Date(result.analyzed_at).toLocaleString()}
              </p>

              {result.files?.map((file, i) => (
                <FileCard key={i} file={file} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
