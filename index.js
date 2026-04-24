const express = require("express");
const cors = require("cors");
const { 
    isInputValid, 
    getNodes, 
    isCyclic, 
    calculateLevels, 
    nestNodes 
} = require("./graphUtils");

const app = express();
app.use(cors());
app.use(express.json());

const MY_ID = "arnab_06052005";
const MY_EMAIL = "ad0472@srmist.edu.in"; 
const MY_ROLL = "RA2311030010183"; 

app.post("/bfhl", (req, res) => {
    try {
        const { data } = req.body;
        if (!Array.isArray(data)) {
            return res.status(400).json({ error: "Data field is required and must be an array" });
        }

        const sanitizedData = [];
        const invalid_entries = [];
        const recordedEdges = new Set();
        const duplicate_edges = [];

        data.forEach(item => {
            if (isInputValid(item)) {
                if (recordedEdges.has(item)) {
                    if (!duplicate_edges.includes(item)) duplicate_edges.push(item);
                } else {
                    recordedEdges.add(item);
                    sanitizedData.push(item);
                }
            } else {
                invalid_entries.push(String(item));
            }
        });

        const nodeConnections = {}; 
        const kinshipMap = {};   
        const nodeSet = new Set();

        sanitizedData.forEach(edge => {
            const { parent, child } = getNodes(edge);
            nodeSet.add(parent);
            nodeSet.add(child);

            if (!kinshipMap.hasOwnProperty(child)) {
                kinshipMap[child] = parent;
                if (!nodeConnections[parent]) nodeConnections[parent] = [];
                nodeConnections[parent].push(child);
            }
        });
        const childNodes = new Set(Object.keys(kinshipMap));
        const initialNodes = [...nodeSet].filter(n => !childNodes.has(n)).sort();
        const hierarchies = [];
        const globalVisited = new Set();
        let resultsSummary = {
            total_trees: 0,
            total_cycles: 0,
            largest_tree_root: "",
            _maxDepth: -1
        };
        initialNodes.forEach(startNode => {
            if (globalVisited.has(startNode)) return;
            const componentNodes = new Set();
            const q = [startNode];
            while(q.length) {
                const n = q.shift();
                if (componentNodes.has(n)) continue;
                componentNodes.add(n);
                (nodeConnections[n] || []).forEach(child => q.push(child));
            }
            componentNodes.forEach(node => globalVisited.add(node));

            if (isCyclic(startNode, nodeConnections)) {
                resultsSummary.total_cycles++;
                hierarchies.push({ root: startNode, has_cycle: true, tree: {} }); 
            } else {
                resultsSummary.total_trees++;
                const depths = calculateLevels(startNode, nodeConnections);
                const localMaxDepth = Math.max(...Object.values(depths));
                
                hierarchies.push({
                    root: startNode,
                    tree: nestNodes(startNode, nodeConnections),
                    depth: localMaxDepth
                });
                if (localMaxDepth > resultsSummary._maxDepth || 
                   (localMaxDepth === resultsSummary._maxDepth && startNode < resultsSummary.largest_tree_root)) {
                    resultsSummary._maxDepth = localMaxDepth;
                    resultsSummary.largest_tree_root = startNode;
                }
            }
        });
        res.json({
            user_id: MY_ID,
            email: MY_EMAIL,
            college_roll_number: MY_ROLL,
            hierarchies,
            invalid_entries,
            duplicate_edges,
            summary: {
                total_trees: resultsSummary.total_trees,
                total_cycles: resultsSummary.total_cycles,
                largest_tree_root: resultsSummary.largest_tree_root
            }
        });

    } catch (error) {
        console.error("Critical Failure:", error);
        res.status(500).json({ error: "An internal error occurred while building hierarchies." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));