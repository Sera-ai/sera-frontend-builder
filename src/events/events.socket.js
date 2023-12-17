import { generateRandomString } from "../helpers/helper.node";

export const handleNodesChangeUtil = (newNodes, fromSocket, nodes, onNodesChange, onSelection, setDetails, socket) => {
    onNodesChange(newNodes);

    if (fromSocket) return;
    if (newNodes.length === 0) return;
    if (newNodes[0].type === "remove") return;
    if (newNodes[0].type === "select") {
        const selectedNode = newNodes.filter((nod) => nod.selected == true)
        const hasSelectedItem = selectedNode.length > 0
        onSelection(hasSelectedItem ? selectedNode[0] : null);
        hasSelectedItem ? setDetailsUtil(selectedNode[0], setDetails, nodes) : setDetails(null)
        return;
    }
    socket.emit('nodeUpdate', { newNodes, nodes });
};

export const handleNodesCreateUtil = (newNode, fromSocket, setNodes, socket) => {
    setNodes(nds => nds.some(node => node.id === newNode.id) ? nds : nds.concat(newNode)
    );
    if (fromSocket) return;
    if (newNode.length === 0) return;

    socket.emit('nodeCreate', { newNode });
};

export const handleEdgesChangeUtil = (newEdges, fromSocket, edges, onEdgesChange, socket) => {
    onEdgesChange(newEdges);

    if (fromSocket) return;

    socket.emit('edgeUpdate', { newEdges, edges });
};

export const handleNodesDeleteUtil = (deletedNode, fromSocket, setNodes, setEdges, socket) => {
    console.log("deletedNode", deletedNode)
    deletedNode.map((dnode) => {
        setNodes((nodes) => nodes.filter((node) => node.id !== dnode.id));
        setEdges((edges) => edges.filter((edge) => edge.source !== dnode.id));
    })
    if (fromSocket) return;

    socket.emit('nodeDelete', deletedNode);
};


export const handleConnectChangeUtil = (params, fromSocket, onConnect, socket, edges, setEdges) => {

    console.log("params", params)

    const sourceDiv = document.querySelector(`div[data-handleid="${params.sourceHandle}"]`);
    const targetDiv = document.querySelector(`div[data-handleid="${params.targetHandle}"]`);

    if (sourceDiv && targetDiv) {
        let sourceColorClass = null
        Object.keys(sourceDiv.classList).map((key) => {
            if (sourceDiv.classList[key].includes("Edge")) sourceColorClass = sourceDiv.classList[key];
        })

        let targetColorClass = null
        Object.keys(targetDiv.classList).map((key) => {
            if (targetDiv.classList[key].includes("Edge")) targetColorClass = targetDiv.classList[key];
        })

        if (sourceColorClass === targetColorClass) {

            setEdges((edges) => edges.filter((edge) => edge.targetHandle !== params.targetHandle))
            onConnect(params);

            const newEdges = edges.filter((edge) => edge.targetHandle !== params.targetHandle)
            console.log(newEdges)
            let lineColor = "#fff"
            if (targetColorClass) {
                const element = document.querySelector(`.${targetColorClass}`);
                if (element) {
                    const computedStyle = window.getComputedStyle(element);
                    lineColor = rgbToHex(computedStyle.borderColor);
                }
            }

            console.log("sourceColorClass", sourceColorClass)
            if (fromSocket) return;
            let edge = params
            edge.id = `${params.source}-${params.target}-${params.sourceHandle.split("-")[3]}-${generateRandomString()}`
            edge.animated = sourceColorClass == "nullEdge";
            edge.style = { stroke: lineColor };
            edge.type = sourceColorClass == "nullEdge" ? "flow" : "param"
            edge.selected = false;
            socket.emit('onConnect', { edge, edges: newEdges });
        } else {
            console.log("it dont be matchin")
        }

    } else {
        console.log("Div not found");
    }



};

export const handleFieldUpdateUtil = (params, ref) => {
    const childElement = ref.current.querySelector(`#${params.id}`);
    childElement.value = params.value
}

async function setDetailsUtil(node, setDetails, nodes) {
    let nodeData

    nodes.map((nodeItem) => {
        if (nodeItem.id == node.id) nodeData = nodeItem
    })
    console.log(nodeData)

    try {
        const response = await fetch(`http://localhost:12000/manage/getNode?id=${nodeData.node_id}`);
        const jsonData = await response.json();
        if (!jsonData.issue) {
            nodeData["node_data"] = jsonData
            setDetails(nodeData)
        } else {
            setIssue(jsonData.issue)
            console.log("something went wrong")
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}




function rgbToHex(rgb) {
    // Ensure the input string is in the correct format (e.g., "rgb(255, 0, 0)")
    const regex = /rgb\((\d+), (\d+), (\d+)\)/;
    const match = rgb.match(regex);

    if (!match) {
        throw new Error('Invalid RGB color format');
    }

    // Extract the Red, Green, and Blue components
    const red = parseInt(match[1]);
    const green = parseInt(match[2]);
    const blue = parseInt(match[3]);

    // Convert each component to hexadecimal and pad with zeros if needed
    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');

    // Combine the hexadecimal values to form the final hex color code
    const hexColor = `#${redHex}${greenHex}${blueHex}`;

    return hexColor;
}