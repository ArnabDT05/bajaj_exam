import { useState } from 'react';
import styles from './TreeNode.module.css';

export default function TreeNode({ node, children, depth = 0, isLast = false }) {
  const hasChildren = children && Object.keys(children).length > 0;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.node} style={{ '--depth': depth }}>
      {/* Connector lines */}
      {depth > 0 && <div className={styles.connector} />}

      <div className={styles.row}>
        {/* Toggle btn */}
        {hasChildren ? (
          <button
            className={[styles.toggle, collapsed ? styles.collapsed : ''].join(' ')}
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '▶' : '▼'}
          </button>
        ) : (
          <span className={styles.leaf}>◆</span>
        )}

        {/* Node label */}
        <span className={styles.nodeLabel}>{node}</span>

        {/* Depth badge */}
        <span className={styles.depthBadge}>L{depth}</span>
      </div>

      {/* Children */}
      {!collapsed && hasChildren && (
        <div className={styles.children}>
          {Object.entries(children).map(([child, grandchildren], i, arr) => (
            <TreeNode
              key={child}
              node={child}
              children={grandchildren}
              depth={depth + 1}
              isLast={i === arr.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
