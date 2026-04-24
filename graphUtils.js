 const isInputValid = (entry) => {
    if (typeof entry !== 'string') return false;
    return /^[A-Z]->[A-Z]$/.test(entry.trim());
};

const getNodes = (connection) => {
    const [parent, child] = connection.trim().split("->");
    return { parent, child };
};

const isCyclic = (startNode, nodeConnections) => {
    const visited = new Set();
    const activeStack = new Set();

    const dfs = (current) => {
        visited.add(current);
        activeStack.add(current);

        const neighbors = nodeConnections[current] || [];
        for (const nextNode of neighbors) {
            if (!visited.has(nextNode)) {
                if (dfs(nextNode)) return true;
            } else if (activeStack.has(nextNode)) {
                return true;
            }
        }

        activeStack.delete(current);
        return false;
    };

    return dfs(startNode);
};
const calculateLevels = (root, nodeConnections) => {
    const depthMap = {};
    const queue = [[root, 1]];

    while (queue.length > 0) {
        const [node, level] = queue.shift();
        depthMap[node] = level;

        const children = nodeConnections[node] || [];
        for (const childNode of children) {
            queue.push([childNode, level + 1]);
        }
    }
    return depthMap;
};

const nestNodes = (currentNode, nodeConnections, visited = new Set()) => {
    if (visited.has(currentNode)) return {};
    visited.add(currentNode);

    const tree = {};
    const children = nodeConnections[currentNode] || [];

    for (const child of children) {
        tree[child] = nestNodes(child, nodeConnections, visited);
    }
    return tree;
};

module.exports = {
    isInputValid,
    getNodes,
    isCyclic,
    calculateLevels,
    nestNodes
};