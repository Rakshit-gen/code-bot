'use client'

import { useState } from 'react'
import { Loader2, FileCode, AlertTriangle, CheckCircle2, ExternalLink, GitPullRequest, Sparkles, Hash, Zap, Code2, ShieldAlert } from 'lucide-react'

const styles = {
  main: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at top, #0f172a 0%, #000000 50%, #000000 100%)',
    color: '#ffffff',
    padding: '3rem 1.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundPattern: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
    zIndex: 0
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1
  },
  headerWrapper: {
    textAlign: 'center',
    marginBottom: '5rem',
    position: 'relative'
  },
  glowEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.05) 50%, transparent 70%)',
    filter: 'blur(100px)',
    pointerEvents: 'none',
    animation: 'pulse 4s ease-in-out infinite'
  },
  headerContent: {
    position: 'relative',
    zIndex: 1
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  mainTitle: {
    fontSize: '5rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #ffffff 0%, #60a5fa 30%, #a78bfa 60%, #ffffff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.03em',
    margin: 0,
    textShadow: '0 0 80px rgba(59, 130, 246, 0.3)'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1.25rem',
    fontWeight: '400',
    letterSpacing: '0.02em'
  },
  inputCard: {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '2rem',
    padding: '3rem',
    marginBottom: '3rem',
    boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(148, 163, 184, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative'
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '2rem',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
    opacity: 0,
    transition: 'opacity 0.4s ease',
    pointerEvents: 'none'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    marginBottom: '2.5rem'
  },
  iconBox: {
    padding: '1rem',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
    border: '1px solid rgba(59, 130, 246, 0.3)'
  },
  cardTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  inputGroup: {
    marginBottom: '1.75rem'
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '0.75rem'
  },
  input: {
    width: '100%',
    padding: '1.25rem 1.5rem',
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '1rem',
    color: '#ffffff',
    fontSize: '1.05rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    fontWeight: '500'
  },
  button: {
    width: '100%',
    padding: '1.5rem 2.5rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: '1rem',
    color: '#ffffff',
    fontSize: '1.15rem',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    boxShadow: '0 10px 40px -5px rgba(59, 130, 246, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    letterSpacing: '0.02em'
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.5s ease'
  },
  loadingCard: {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '2rem',
    padding: '3rem',
    marginBottom: '3rem',
    boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.5)'
  },
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  loadingTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  skeleton: {
    height: '1.25rem',
    background: 'linear-gradient(90deg, rgba(71, 85, 105, 0.3) 0%, rgba(71, 85, 105, 0.5) 50%, rgba(71, 85, 105, 0.3) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
    borderRadius: '0.5rem',
    marginBottom: '1rem'
  },
  resultCard: {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.9) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '2rem',
    padding: '3rem',
    boxShadow: '0 30px 80px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(148, 163, 184, 0.1)'
  },
  prHeader: {
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    paddingBottom: '2rem',
    marginBottom: '3rem'
  },
  prTitleWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.25rem',
    marginBottom: '1.5rem'
  },
  prTitle: {
    fontSize: '2.25rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    lineHeight: '1.3',
    flex: 1
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    color: '#60a5fa',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    padding: '0.75rem 1.5rem',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '0.75rem',
    border: '1px solid rgba(59, 130, 246, 0.2)'
  },
  timestamp: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginTop: '1rem',
    fontWeight: '500'
  },
  fileCard: {
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    marginBottom: '2rem',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  fileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
  },
  fileName: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    flex: 1
  },
  issuesCount: {
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
    color: '#fca5a5',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: '800',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  issueCard: {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '1.25rem',
    padding: '2rem',
    marginBottom: '1.5rem',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  issueGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    borderRadius: '1.25rem 1.25rem 0 0',
    background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #3b82f6 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  issueMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '1.25rem'
  },
  issueTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: '700',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    border: '1px solid',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  issueMessage: {
    color: '#f1f5f9',
    fontSize: '1.05rem',
    lineHeight: '1.7',
    marginBottom: '1rem',
    fontWeight: '500'
  },
  suggestionBox: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)',
    borderLeft: '4px solid #3b82f6',
    borderRadius: '0 1rem 1rem 0',
    padding: '1.25rem 1.5rem',
    marginTop: '1.25rem',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderLeft: '4px solid #3b82f6'
  },
  suggestionText: {
    color: '#93c5fd',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontWeight: '500',
    lineHeight: '1.6',
    margin: 0
  },
  noIssues: {
    textAlign: 'center',
    padding: '3rem',
    color: '#64748b',
    fontSize: '1.05rem',
    fontStyle: 'italic'
  }
}

const keyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`

const GlowingHeader = () => (
  <div style={styles.headerWrapper}>
    <div style={styles.glowEffect}></div>
    <div style={styles.headerContent}>
      <div style={styles.headerTop}>
        <Sparkles color="#60a5fa" size={42} strokeWidth={2.5} />
        <h1 style={styles.mainTitle}>PR Review Agent</h1>
        <Sparkles color="#a78bfa" size={42} strokeWidth={2.5} />
      </div>
      <p style={styles.subtitle}>AI-powered code analysis for your pull requests</p>
    </div>
  </div>
)

const IssueCard = ({ issue }) => {
  const [isHovering, setIsHovering] = useState(false)
  
  const getTagStyle = (type) => {
    const styles = {
      file: { bg: 'rgba(100, 116, 139, 0.3)', color: '#cbd5e1', border: 'rgba(100, 116, 139, 0.5)' },
      line: { bg: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: 'rgba(59, 130, 246, 0.4)' },
      type: { bg: 'rgba(234, 179, 8, 0.2)', color: '#fde047', border: 'rgba(234, 179, 8, 0.4)' }
    }
    return styles[type] || styles.file
  }

  return (
    <div
      style={styles.issueCard}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={{ ...styles.issueGlow, opacity: isHovering ? 0.6 : 0 }}></div>
      
      <div style={styles.issueMeta}>
        {issue.file && (
          <span style={{ ...styles.issueTag, background: getTagStyle('file').bg, color: getTagStyle('file').color, borderColor: getTagStyle('file').border }}>
            <FileCode size={14} strokeWidth={2.5} /> {issue.file}
          </span>
        )}
        {issue.line !== null && issue.line !== undefined && (
          <span style={{ ...styles.issueTag, background: getTagStyle('line').bg, color: getTagStyle('line').color, borderColor: getTagStyle('line').border }}>
            <Hash size={14} strokeWidth={2.5} /> Line {issue.line}
          </span>
        )}
        {issue.type && (
          <span style={{ ...styles.issueTag, background: getTagStyle('type').bg, color: getTagStyle('type').color, borderColor: getTagStyle('type').border }}>
            <Zap size={14} strokeWidth={2.5} /> {issue.type}
          </span>
        )}
      </div>

      <p style={styles.issueMessage}>{issue.description}</p>

      {issue.suggestion && (
        <div style={styles.suggestionBox}>
          <p style={styles.suggestionText}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>💡</span>
            <span>{issue.suggestion}</span>
          </p>
        </div>
      )}
    </div>
  )
}

const FileCard = ({ file }) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      style={{
        ...styles.fileCard,
        transform: isHovering ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovering 
          ? '0 30px 60px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.2)'
          : '0 20px 40px -10px rgba(0, 0, 0, 0.4)'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={styles.fileHeader}>
        <div style={styles.iconBox}>
          <Code2 size={24} color="#60a5fa" strokeWidth={2.5} />
        </div>
        <h3 style={styles.fileName}>{file.name}</h3>
        {file.issues?.length > 0 && (
          <span style={styles.issuesCount}>
            <ShieldAlert size={16} strokeWidth={2.5} />
            {file.issues.length} {file.issues.length === 1 ? 'Issue' : 'Issues'}
          </span>
        )}
      </div>

      {file.issues?.length > 0 ? (
        file.issues.map((issue, i) => <IssueCard key={i} issue={issue} />)
      ) : (
        <div style={styles.noIssues}>
          <CheckCircle2 size={48} color="#34d399" strokeWidth={2} style={{ marginBottom: '1rem' }} />
          <p style={{ margin: 0 }}>No issues found in this file</p>
        </div>
      )}
    </div>
  )
}

export default function PRReviewAgent() {
  const [url, setUrl] = useState('')
  const [pr, setPr] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cardHover, setCardHover] = useState(false)
  const [buttonHover, setButtonHover] = useState(false)

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
    <>
      <style>{keyframes}</style>
      <main style={styles.main}>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.container}>
          <GlowingHeader />

          <div
            style={{
              ...styles.inputCard,
              transform: cardHover ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: cardHover
                ? '0 30px 80px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.2)'
                : '0 20px 60px -10px rgba(0, 0, 0, 0.5)'
            }}
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
          >
            <div style={{ ...styles.cardGlow, opacity: cardHover ? 1 : 0 }}></div>
            
            <div style={styles.cardHeader}>
              <div style={styles.iconBox}>
                <GitPullRequest size={32} color="#60a5fa" strokeWidth={2.5} />
              </div>
              <h2 style={styles.cardTitle}>Analyze Pull Request</h2>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Repository URL</label>
              <input
                type="text"
                placeholder="https://github.com/user/repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)'
                  e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>PR Number</label>
              <input
                type="text"
                placeholder="42"
                value={pr}
                onChange={(e) => setPr(e.target.value)}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)'
                  e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <button
              onClick={analyze}
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                transform: buttonHover && !loading ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: buttonHover && !loading
                  ? '0 20px 50px -5px rgba(59, 130, 246, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)'
                  : '0 10px 40px -5px rgba(59, 130, 246, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={() => setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
            >
              <div style={{ ...styles.buttonShine, left: buttonHover ? '100%' : '-100%' }}></div>
              {loading && <Loader2 size={24} strokeWidth={2.5} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Analyzing PR...' : 'Analyze PR'}
            </button>
          </div>

          {loading && (
            <div style={styles.loadingCard}>
              <div style={styles.loadingContent}>
                <Loader2 size={36} color="#60a5fa" strokeWidth={2.5} style={{ animation: 'spin 1s linear infinite' }} />
                <h3 style={styles.loadingTitle}>Processing Pull Request...</h3>
              </div>
              <div style={styles.skeleton}></div>
              <div style={styles.skeleton}></div>
              <div style={{ ...styles.skeleton, width: '70%' }}></div>
            </div>
          )}

          {result && (
            <div style={styles.resultCard}>
              <div style={styles.prHeader}>
                <div style={styles.prTitleWrapper}>
                  <CheckCircle2 color="#34d399" size={36} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '4px' }} />
                  <h2 style={styles.prTitle}>{result.pr_title}</h2>
                </div>
                <a
                  href={result.pr_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.2)'
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)'
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)'
                  }}
                >
                  View Pull Request <ExternalLink size={18} strokeWidth={2.5} />
                </a>
                <p style={styles.timestamp}>
                  Analyzed on {new Date(result.analyzed_at).toLocaleString()}
                </p>
              </div>

              {result.files?.map((file, i) => (
                <FileCard key={i} file={file} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}