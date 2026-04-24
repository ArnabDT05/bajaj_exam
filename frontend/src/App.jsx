import { useState, useRef } from 'react';
import DataInput    from './components/DataInput';
import HierarchyCard from './components/HierarchyCard';
import StatusTray   from './components/StatusTray';
import SummaryBar   from './components/SummaryBar';
import AlertBanner  from './components/AlertBanner';
import styles       from './App.module.css';

const API_URL = 'https://bajaj-exam-fn9j.onrender.com/bfhl';

export default function App() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);   // { type, message }
  const [reqLog,  setReqLog]  = useState([]);      // timing log entries
  const resultRef = useRef(null);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    const t0 = performance.now();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
        },
        body: JSON.stringify(payload),
      });

      const elapsed = Math.round(performance.now() - t0);

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw Object.assign(new Error(`HTTP ${res.status}`), {
          type: 'error',
          message: `Server responded with ${res.status}. ${errBody.slice(0, 120)}`,
        });
      }

      const data = await res.json();

      // Basic sanity check
      if (!Array.isArray(data.hierarchies)) {
        throw Object.assign(new Error('Malformed'), {
          type: 'malformed',
          message: 'Response is missing the "hierarchies" field.',
        });
      }

      setResult(data);
      setReqLog(prev => [
        { ts: new Date().toLocaleTimeString(), ms: elapsed, nodes: payload.data.length },
        ...prev.slice(0, 4),
      ]);

      // Scroll to results
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);

    } catch (err) {
      console.error('[BFHL Engine]', err);
      const isOffline = !navigator.onLine || err.message?.includes('fetch');
      setError({
        type: isOffline ? 'offline' : (err.type || 'error'),
        message: err.message || 'An unknown error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const hasResult = !!result;

  return (
    <div className={styles.app}>
      {/* ── Scanline overlay (pure aesthetic) ── */}
      <div className={styles.scanlines} aria-hidden />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoMark}>
            <span className={styles.logoBox}>SRM</span>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Hierarchy Engine</span>
              <span className={styles.logoSub}>Graph Processing System · v2.0</span>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          {reqLog.length > 0 && (
            <div className={styles.reqLog}>
              {reqLog.map((r, i) => (
                <span key={i} className={styles.reqEntry} style={{ opacity: 1 - i * 0.18 }}>
                  {r.ts} · {r.ms}ms · {r.nodes} nodes
                </span>
              ))}
            </div>
          )}
          <div className={styles.statusPill}>
            <span className={[styles.statusDot, loading ? styles.pulsing : styles.idle].join(' ')} />
            <span className={styles.statusText}>{loading ? 'PROCESSING' : 'READY'}</span>
          </div>
        </div>
      </header>

      {/* ── Main bento grid ────────────────────────────────────────────── */}
      <main className={styles.main}>

        {/* ── Row 1: Input + Identity ── */}
        <div className={styles.row1}>
          {/* Input card */}
          <div className={[styles.bentoCell, styles.inputCell].join(' ')}>
            <DataInput onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Identity / info panel */}
          <div className={[styles.bentoCell, styles.infoCell].join(' ')}>
            <div className={styles.infoInner}>
              <div className={styles.infoSection}>
                <span className={styles.infoSectionLabel}>OPERATOR</span>
                <span className={styles.infoVal}>Arnab Datta</span>
              </div>
              <div className={styles.infoDivider} />
              <div className={styles.infoSection}>
                <span className={styles.infoSectionLabel}>ROLL NUMBER</span>
                <span className={[styles.infoVal, styles.infoMono].join(' ')}>RA2311030010183</span>
              </div>
              <div className={styles.infoDivider} />
              <div className={styles.infoSection}>
                <span className={styles.infoSectionLabel}>EMAIL</span>
                <span className={[styles.infoVal, styles.infoMono, styles.infoSmall].join(' ')}>ad0472@srmist.edu.in</span>
              </div>
              <div className={styles.infoDivider} />
              <div className={styles.infoSection}>
                <span className={styles.infoSectionLabel}>ENDPOINT</span>
                <span className={[styles.infoVal, styles.infoMono, styles.infoSmall, styles.infoGold].join(' ')}>POST /bfhl</span>
              </div>
              <div className={styles.infoDivider} />

              {/* Engine legend */}
              <div className={styles.legend}>
                <span className={styles.legendLabel}>LEGEND</span>
                <div className={styles.legendItems}>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: 'var(--gold)' }} /> Tree
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: 'var(--red)' }} /> Cycle
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: '#ECC94B' }} /> Duplicate
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: 'var(--text-ter)' }} /> Invalid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <AlertBanner type={error.type} message={error.message} onDismiss={() => setError(null)} />
        )}

        {/* ── Result area ── */}
        {hasResult && (
          <div ref={resultRef} className={styles.resultArea}>

            {/* Summary bar */}
            <SummaryBar
              summary={result.summary}
              user_id={result.user_id}
              email={result.email}
              college_roll_number={result.college_roll_number}
            />

            {/* Status tray */}
            <StatusTray
              invalid_entries={result.invalid_entries}
              duplicate_edges={result.duplicate_edges}
            />

            {/* Hierarchy grid */}
            {result.hierarchies.length > 0 ? (
              <>
                <div className={styles.hierarchiesLabel}>
                  <span className={styles.sectLabel}>HIERARCHIES</span>
                  <span className={styles.sectCount}>{result.hierarchies.length}</span>
                </div>
                <div className={styles.hierarchiesGrid}>
                  {result.hierarchies.map((h, i) => (
                    <HierarchyCard key={`${h.root}-${i}`} hierarchy={h} index={i} />
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.emptyHierarchies}>
                No graph components found — all entries may have been invalid.
              </div>
            )}
          </div>
        )}

        {/* ── Empty state (no result yet) ── */}
        {!hasResult && !error && (
          <div className={styles.emptyState}>
            <div className={styles.emptyGrid} aria-hidden>
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className={styles.emptyGridCell} />
              ))}
            </div>
            <div className={styles.emptyContent}>
              <div className={styles.emptyIcon}>⬡</div>
              <div className={styles.emptyTitle}>Awaiting Graph Input</div>
              <div className={styles.emptyText}>
                Enter edge pairs in <span className={styles.emptyCode}>A→B</span> format and execute the engine
                to visualise your graph hierarchy.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <span>SRM Hierarchy Engine · Bajaj Finserv Health Dev Challenge</span>
        <span>RA2311030010183 · ad0472@srmist.edu.in</span>
      </footer>
    </div>
  );
}
