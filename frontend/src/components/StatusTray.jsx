import styles from './StatusTray.module.css';

export default function StatusTray({ invalid_entries = [], duplicate_edges = [] }) {
  const hasInvalid   = invalid_entries.length  > 0;
  const hasDuplicates = duplicate_edges.length > 0;
  const isEmpty = !hasInvalid && !hasDuplicates;

  if (isEmpty) {
    return (
      <div className={styles.tray}>
        <div className={styles.header}>
          <span className={styles.label}>STATUS TRAY</span>
        </div>
        <div className={styles.clean}>
          <span className={styles.cleanIcon}>✓</span>
          All entries valid — no anomalies detected
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tray}>
      <div className={styles.header}>
        <span className={styles.label}>STATUS TRAY</span>
        <div className={styles.counts}>
          {hasInvalid    && <span className={styles.countBadge} data-type="invalid">{invalid_entries.length} INVALID</span>}
          {hasDuplicates && <span className={styles.countBadge} data-type="dup">{duplicate_edges.length} DUPE</span>}
        </div>
      </div>

      <div className={styles.sections}>
        {hasInvalid && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionIcon} data-type="invalid">⊘</span>
              INVALID ENTRIES
            </div>
            <div className={styles.chips}>
              {invalid_entries.map((e, i) => (
                <span key={i} className={styles.chip} data-type="invalid">{e}</span>
              ))}
            </div>
          </section>
        )}

        {hasDuplicates && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionIcon} data-type="dup">⊕</span>
              DUPLICATE EDGES
            </div>
            <div className={styles.chips}>
              {duplicate_edges.map((e, i) => (
                <span key={i} className={styles.chip} data-type="dup">{e}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
