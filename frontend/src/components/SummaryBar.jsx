import styles from './SummaryBar.module.css';

export default function SummaryBar({ summary, user_id, email, college_roll_number }) {
  const { total_trees, total_cycles, largest_tree_root } = summary;

  const stats = [
    { label: 'TOTAL TREES',  value: total_trees,       highlight: true    },
    { label: 'TOTAL CYCLES', value: total_cycles,       danger: total_cycles > 0 },
    { label: 'LARGEST ROOT', value: largest_tree_root || '—', mono: true },
  ];

  return (
    <div className={styles.bar}>
      <div className={styles.header}>
        <span className={styles.label}>EXECUTION SUMMARY</span>
        <div className={styles.identity}>
          <span className={styles.idChip}>{user_id}</span>
          <span className={styles.idChip}>{college_roll_number}</span>
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map(({ label, value, highlight, danger, mono }) => (
          <div
            key={label}
            className={[
              styles.stat,
              highlight ? styles.highlight : '',
              danger    ? styles.danger    : '',
            ].filter(Boolean).join(' ')}
          >
            <span className={styles.statVal + (mono ? ' ' + styles.mono : '')}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}

        <div className={styles.statDivider} />

        <div className={styles.idBlock}>
          <span className={styles.idLabel}>OPERATOR</span>
          <span className={styles.idVal}>{email}</span>
        </div>
      </div>
    </div>
  );
}
