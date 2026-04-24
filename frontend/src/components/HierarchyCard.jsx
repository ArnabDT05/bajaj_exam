import { useState } from 'react';
import TreeNode from './TreeNode';
import styles from './HierarchyCard.module.css';

export default function HierarchyCard({ hierarchy, index }) {
  const { root, has_cycle, tree, depth, node_depths } = hierarchy;
  const [expanded, setExpanded] = useState(true);

  const maxDepth = depth ?? (node_depths ? Math.max(...Object.values(node_depths)) : 0);
  const nodeCount = node_depths ? Object.keys(node_depths).length : '—';

  return (
    <div className={[styles.card, has_cycle ? styles.cycle : styles.tree].join(' ')}>
      {/* Card header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {/* Index chip */}
          <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>

          {/* Root node */}
          <span className={styles.root}>{root}</span>

          {/* Type badge */}
          {has_cycle ? (
            <span className={styles.cycleBadge}>
              <span className={styles.cycleIcon}>⚠</span>
              CYCLE DETECTED
            </span>
          ) : (
            <span className={styles.treeBadge}>TREE</span>
          )}
        </div>

        <div className={styles.headerRight}>
          {!has_cycle && (
            <>
              <span className={styles.stat}>
                <span className={styles.statLabel}>DEPTH</span>
                <span className={styles.statVal}>{maxDepth}</span>
              </span>
              <span className={styles.divider} />
              <span className={styles.stat}>
                <span className={styles.statLabel}>NODES</span>
                <span className={styles.statVal}>{nodeCount}</span>
              </span>
              <span className={styles.divider} />
            </>
          )}
          <button
            className={styles.toggle}
            onClick={() => setExpanded(e => !e)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className={styles.body}>
          {has_cycle ? (
            <div className={styles.cycleWarning}>
              <div className={styles.cycleWarningIcon}>⚠</div>
              <div>
                <div className={styles.cycleWarningTitle}>Cyclic Structure</div>
                <div className={styles.cycleWarningText}>
                  Root&nbsp;<strong>{root}</strong>&nbsp;participates in a cycle.
                  Tree representation is undefined — no valid depth ordering exists.
                </div>
              </div>
            </div>
          ) : tree && Object.keys(tree).length > 0 ? (
            <div className={styles.treeWrap}>
              <TreeNode node={root} children={tree} depth={0} />
            </div>
          ) : (
            <div className={styles.isolatedNode}>
              <span className={styles.isolatedIcon}>◈</span>
              <span className={styles.isolatedLabel}>{root}</span>
              <span className={styles.isolatedNote}>Isolated node — no children</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
