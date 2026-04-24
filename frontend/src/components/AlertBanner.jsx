import styles from './AlertBanner.module.css';

const TYPES = {
  offline:  { icon: '⊘', label: 'SERVER OFFLINE',   text: 'Cannot reach the API endpoint. Check your network or server status.' },
  malformed:{ icon: '⚠', label: 'MALFORMED RESPONSE', text: 'The server returned an unexpected response structure.' },
  error:    { icon: '✕', label: 'REQUEST FAILED',    text: '' },
};

export default function AlertBanner({ type = 'error', message = '', onDismiss }) {
  const config = TYPES[type] || TYPES.error;
  const displayText = message || config.text;

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.iconWrap}>
        <span className={styles.icon}>{config.icon}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.label}>{config.label}</span>
        <span className={styles.text}>{displayText}</span>
      </div>
      {onDismiss && (
        <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">✕</button>
      )}
    </div>
  );
}
