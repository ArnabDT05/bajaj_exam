import { useState } from 'react';
import styles from './DataInput.module.css';

const PLACEHOLDER = `{
  "data": ["A->B", "B->C", "A->D", "X->Y", "Y->X"]
}`;

export default function DataInput({ onSubmit, loading }) {
  const [raw, setRaw]       = useState('');
  const [error, setError]   = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    setError('');
    if (!raw.trim()) {
      setError('Input cannot be empty.');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.data)) {
        setError('JSON must have a "data" key containing an array.');
        return;
      }
      onSubmit(parsed);
    } catch {
      setError('Malformed JSON — check your syntax.');
    }
  };

  const handleKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit();
  };

  const charCount = raw.length;
  const isValid   = (() => { try { JSON.parse(raw); return true; } catch { return false; } })();

  return (
    <div className={styles.wrap}>
      {/* Header row */}
      <div className={styles.header}>
        <span className={styles.label}>GRAPH ENTRY</span>
        <div className={styles.meta}>
          <span className={[styles.dot, isValid && raw ? styles.green : raw ? styles.red : styles.idle].join(' ')} />
          <span className={styles.chars}>{charCount} chars</span>
        </div>
      </div>

      {/* Textarea */}
      <div className={[styles.textareaWrap, focused ? styles.focused : '', error ? styles.hasError : ''].join(' ')}>
        <textarea
          className={styles.textarea}
          value={raw}
          onChange={e => setRaw(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          rows={8}
        />
        {/* Line gutter */}
        <div className={styles.gutter} aria-hidden>
          {raw.split('\n').map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠</span>
          {error}
        </div>
      )}

      {/* Hint */}
      <div className={styles.hint}>
        <span className={styles.hintKey}>⌘ Enter</span> to submit
        &nbsp;·&nbsp; Valid edge format: <span className={styles.hintCode}>A→B</span>
      </div>

      {/* Submit */}
      <button
        className={[styles.btn, loading ? styles.loading : ''].join(' ')}
        onClick={handleSubmit}
        disabled={loading}
        id="submit-engine"
      >
        {loading ? (
          <>
            <span className={styles.spinner} /> PROCESSING…
          </>
        ) : (
          <>
            <span className={styles.btnIcon}>▶</span> EXECUTE ENGINE
          </>
        )}
      </button>
    </div>
  );
}
