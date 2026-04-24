import styles from './Card.module.css';

export default function Card({ children, className = '', accent = false, danger = false }) {
  return (
    <div
      className={[
        styles.card,
        accent  ? styles.accent  : '',
        danger  ? styles.danger  : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}
