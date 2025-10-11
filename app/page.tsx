'use client'

import { useState } from 'react'
import { Loader2, FileCode, AlertTriangle, CheckCircle2, ExternalLink, GitPullRequest, Sparkles } from 'lucide-react'

const styles = {
  main: {
    height: '100vh',
    background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #000000 100%)',
    color: '#000000',
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
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
    filter: 'blur(80px)',
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
    background: 'linear-gradient(90deg, #ffffff 0%, #93c5fd 50%, #ffffff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em',
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
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  iconBox: {
    padding: '0.75rem',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  inputGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.75rem'
  },
  input: {
    width: '100%',
    padding: '1rem 1.25rem',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid #374151',
    borderRadius: '0.75rem',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '1.25rem 2rem',
    background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
    border: 'none',
    borderRadius: '0.75rem',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    boxShadow: '0 10px 30px -5px rgba(37, 99, 235, 0.4)',
    transition: 'all 0.3s ease'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  loadingCard: {
    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.5) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    marginBottom: '2.5rem'
  },
  loadingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  loadingTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  skeleton: {
    height: '1rem',
    background: 'rgba(55, 65, 81, 0.6)',
    borderRadius: '0.5rem',
    marginBottom: '0.75rem',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  },
  resultCard: {
    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.5) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
  },
  prHeader: {
    borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
    paddingBottom: '1.5rem',
    marginBottom: '2rem'
  },
  prTitleWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1rem'
  },
  prTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    lineHeight: '1.3'
  },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#60a5fa',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'color 0.2s ease'
  },
  timestamp: {
    fontSize: '0.8rem',
    color: '#6b7280',
    marginTop: '0.5rem'
  },
  summaryBox: {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '1rem',
    padding: '1.75rem',
    marginBottom: '2.5rem'
  },
  summaryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.25rem'
  },
  summaryTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  summaryContent: {
    color: '#d1d5db',
    fontSize: '0.9rem',
    whiteSpace: 'pre-wrap',
    fontFamily: 'Monaco, "Courier New", monospace',
    lineHeight: '1.6',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '1rem',
    borderRadius: '0.5rem'
  },
  filesSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  filesCount: {
    padding: '0.5rem 1rem',
    background: 'rgba(59, 130, 246, 0.2)',
    color: '#93c5fd',
    borderRadius: '9999px',
    fontSize: '0.9rem',
    fontWeight: '700'
  },
  filesContainer: {
    maxHeight: '800px',
    overflowY: 'auto',
    paddingRight: '0.5rem'
  },
  fileCard: {
    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.5) 100%)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '1.25rem',
    padding: '2rem',
    marginBottom: '1.5rem',
    transition: 'all 0.3s ease'
  },
  fileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  fileName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0
  },
  codeBlock: {
    maxHeight: '300px',
    overflowY: 'auto',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    marginBottom: '1.5rem'
  },
  code: {
    color: '#d1d5db',
    fontSize: '0.8rem',
    fontFamily: 'Monaco, "Courier New", monospace',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
    margin: 0
  },
  analysisBox: {
    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    marginBottom: '1.5rem'
  },
  analysisText: {
    color: '#93c5fd',
    fontSize: '0.95rem',
    fontStyle: 'italic',
    lineHeight: '1.6',
    margin: 0
  },
  issuesDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(to right, #374151, transparent)'
  },
  issuesLabel: {
    fontSize: '0.75rem',
    fontWeight: '900',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  },
  issueCard: {
    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(0, 0, 0, 0.5) 100%)',
    border: '1px solid rgba(75, 85, 99, 0.5)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    transition: 'all 0.3s ease'
  },
  issueHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  severityBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid'
  },
  issueFileName: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: '#6b7280',
    background: 'rgba(55, 65, 81, 0.5)',
    padding: '0.5rem 0.75rem',
    borderRadius: '9999px'
  },
  issueMessage: {
    color: '#e5e7eb',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '0.75rem'
  },
  suggestionBox: {
    marginTop: '1rem',
    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
    borderLeft: '4px solid #3b82f6',
    borderRadius: '0 0.5rem 0.5rem 0',
    padding: '1rem 1rem 1rem 1.25rem'
  },
  suggestionText: {
    color: '#93c5fd',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    fontStyle: 'italic',
    lineHeight: '1.6',
    margin: 0
  }
}

const keyframes = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`

// Components
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

const InputSection = ({ url, setUrl, pr, setPr, onAnalyze, loading }) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div 
      style={{
        ...styles.card,
        borderColor: isHovering ? 'rgba(59, 130, 246, 0.3)' : 'rgba(75, 85, 99, 0.5)'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={styles.cardHeader}>
        <div style={styles.iconBox}>
          <GitPullRequest color="#60a5fa" size={28} />
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
            e.target.style.borderColor = '#3b82f6'
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#374151'
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
            e.target.style.borderColor = '#3b82f6'
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#374151'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>
      
      <button
        onClick={onAnalyze}
        disabled={loading}
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {})
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.background = 'linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)'
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 15px 40px -5px rgba(37, 99, 235, 0.5)'
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)'
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 10px 30px -5px rgba(37, 99, 235, 0.4)'
        }}
      >
        {loading && <Loader2 className="animate-spin" size={22} style={{ animation: 'spin 1s linear infinite' }} />}
        {loading ? 'Analyzing PR...' : 'Analyze PR'}
      </button>
    </div>
  )
}

const LoadingState = () => (
  <div style={styles.loadingCard}>
    <style>{keyframes}</style>
    <div style={styles.loadingHeader}>
      <Loader2 color="#60a5fa" size={32} style={{ animation: 'spin 1s linear infinite' }} />
      <h3 style={styles.loadingTitle}>Processing Pull Request...</h3>
    </div>
    <div>
      <div style={styles.skeleton}></div>
      <div style={styles.skeleton}></div>
      <div style={{ ...styles.skeleton, width: '75%' }}></div>
    </div>
  </div>
)

const PRHeader = ({ title, url, analyzedAt }) => (
  <div style={styles.prHeader}>
    <div style={styles.prTitleWrapper}>
      <CheckCircle2 color="#34d399" size={28} style={{ flexShrink: 0, marginTop: '4px' }} />
      <h2 style={styles.prTitle}>{title}</h2>
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.link}
      onMouseEnter={(e) => e.target.style.color = '#93c5fd'}
      onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
    >
      View Pull Request <ExternalLink size={16} />
    </a>
    <p style={styles.timestamp}>
      Analyzed on {new Date(analyzedAt).toLocaleString()}
    </p>
  </div>
)

const SummarySection = ({ summary }) => (
  <div style={styles.summaryBox}>
    <div style={styles.summaryHeader}>
      <div style={styles.iconBox}>
        <CheckCircle2 size={20} color="#34d399" />
      </div>
      <h3 style={styles.summaryTitle}>Summary</h3>
    </div>
    <pre style={styles.summaryContent}>
      {JSON.stringify(summary, null, 2)}
    </pre>
  </div>
)

const SeverityBadge = ({ severity }) => {
  const badgeStyles = {
    high: {
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#fca5a5',
      borderColor: 'rgba(239, 68, 68, 0.4)',
      boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)'
    },
    medium: {
      background: 'rgba(234, 179, 8, 0.2)',
      color: '#fde047',
      borderColor: 'rgba(234, 179, 8, 0.4)',
      boxShadow: '0 4px 10px rgba(234, 179, 8, 0.2)'
    },
    low: {
      background: 'rgba(59, 130, 246, 0.2)',
      color: '#93c5fd',
      borderColor: 'rgba(59, 130, 246, 0.4)',
      boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)'
    }
  }
  
  return (
    <span style={{ ...styles.severityBadge, ...(badgeStyles[severity] || badgeStyles.low) }}>
      {severity}
    </span>
  )
}

const IssueCard = ({ issue, fileName }) => {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      style={{
        ...styles.issueCard,
        borderColor: isHovering ? 'rgba(107, 114, 128, 0.5)' : 'rgba(75, 85, 99, 0.5)'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={styles.issueHeader}>
        <SeverityBadge severity={issue.severity} />
        <span style={styles.issueFileName}>
          <AlertTriangle size={14} /> {fileName}
        </span>
      </div>
      <p style={styles.issueMessage}>{issue.message}</p>
      {issue.suggestion && (
        <div style={styles.suggestionBox}>
          <p style={styles.suggestionText}>
            <span style={{ fontSize: '1.2rem' }}>💡</span>
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
        borderColor: isHovering ? 'rgba(59, 130, 246, 0.3)' : 'rgba(75, 85, 99, 0.5)'
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={styles.fileHeader}>
        <div style={styles.iconBox}>
          <FileCode size={22} color="#60a5fa" />
        </div>
        <h3 style={styles.fileName}>{file.file_name}</h3>
      </div>

      {file.content && (
        <div style={styles.codeBlock}>
          <pre style={styles.code}>{file.content}</pre>
        </div>
      )}

      {file.analysis && (
        <div style={styles.analysisBox}>
          <p style={styles.analysisText}>{file.analysis}</p>
        </div>
      )}

      {file.issues?.length > 0 && (
        <div>
          <div style={styles.issuesDivider}>
            <div style={styles.dividerLine}></div>
            <h4 style={styles.issuesLabel}>Issues Found ({file.issues.length})</h4>
            <div style={{ ...styles.dividerLine, background: 'linear-gradient(to left, #374151, transparent)' }}></div>
          </div>
          {file.issues.map((issue, j) => (
            <IssueCard key={j} issue={issue} fileName={file.file_name} />
          ))}
        </div>
      )}
    </div>
  )
}

const FilesSection = ({ files }) => (
  <div>
    <div style={styles.filesSectionHeader}>
      <div style={styles.iconBox}>
        <FileCode size={28} color="#60a5fa" />
      </div>
      <h3 style={styles.cardTitle}>Files Analyzed</h3>
      <span style={styles.filesCount}>{files.length}</span>
    </div>
    <div style={styles.filesContainer}>
      {files.map((file, i) => (
        <FileCard key={i} file={file} />
      ))}
    </div>
  </div>
)

// Main Component
export default function PRReviewAgent() {
  const [url, setUrl] = useState('')
  const [pr, setPr] = useState('')
  const [taskId, setTaskId] = useState('')
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
        body: JSON.stringify({ repo_url: url, pr_number: parseInt(pr) }),
      })
      const data = await res.json()
      if (!data?.task_id) {
        alert('Failed to start analysis. Check your repository URL and PR number.')
        setLoading(false)
        return
      }
      setTaskId(data.task_id)
      checkStatus(data.task_id)
    } catch (err) {
      console.error('Error:', err)
      alert('Network or server error. Please try again.')
      setLoading(false)
    }
  }

  const checkStatus = async (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API}/status/${id}`)
        const data = await res.json()
        if (data.status === 'completed') {
          clearInterval(interval)
          await checkResult(id)
        }
        if (data.status === 'failed') {
          clearInterval(interval)
          setLoading(false)
          alert('Failed: ' + data.error)
        }
      } catch (err) {
        console.error('Error checking status:', err)
        clearInterval(interval)
        setLoading(false)
      }
    }, 2500)
  }

  const checkResult = async (id) => {
    try {
      const res = await fetch(`${API}/results/${id}`)
      const data = await res.json()
      const finalResult = data.results || data.result
      if (finalResult) setResult(finalResult)
      else alert('Result not found or malformed.')
    } catch (err) {
      console.error('Error fetching result:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{backgroundColor:"black"}}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        ${keyframes}
      `}</style>
      <main style={styles.main}>
        <div style={styles.container}>
          <GlowingHeader />

          <InputSection
            url={url}
            setUrl={setUrl}
            pr={pr}
            setPr={setPr}
            onAnalyze={analyze}
            loading={loading}
          />

          {loading && <LoadingState />}

          {result && (
            <div style={styles.resultCard}>
              <PRHeader
                title={result.pr_title}
                url={result.pr_url}
                analyzedAt={result.analyzed_at}
              />

              <div>
                {result.summary && <SummarySection summary={result.summary} />}
                {result.files?.length > 0 && <FilesSection files={result.files} />}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}