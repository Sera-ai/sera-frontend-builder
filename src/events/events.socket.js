import { applyNodeChanges, useUpdateNodeInternals } from "reactflow";
import { generateRandomString } from "../helpers/helper.node";
import { socket } from "../helpers/socket";

export const handleNodesChangeUtil = ({
  changedNodes,
  fromSocket = false,
  nodes,
  onNodesChange,
  onSelection,
  setDetails,
}) => {
  onNodesChange(changedNodes);

  if (fromSocket) return;
  if (changedNodes.length === 0) return;
  if (changedNodes[0].type === "remove") return;
  if (changedNodes[0].type === "select") {
    const selectedNode = changedNodes.filter((nod) => nod.selected == true);
    const hasSelectedItem = selectedNode.length > 0;
    onSelection(hasSelectedItem ? selectedNode[0] : null);
    hasSelectedItem
      ? setDetailsUtil(selectedNode[0], setDetails, nodes)
      : setDetails(null);
    return;
  }
  // Filter out unchanged nodes based on your criteria, e.g., position, data changes, etc.
  // This is a basic example; you might need a more complex comparison based on your needs.
  const changedNodes2 = changedNodes.filter((newNode) => {
    const oldNode = nodes.find((n) => n.id === newNode.id);
    if (JSON.stringify(oldNode.position) !== JSON.stringify(newNode.position)) {
      return changedNodes.find((n) => n.id == newNode.id);
    }
  });

  if (changedNodes2.length == 0) return;
  socket.emit("nodeUpdate", { changedNodes, nodes });
};

export const handleNodesCreateUtil = ({
  newNode,
  fromSocket = false,
  setNodes,
}) => {
  console.log(newNode);
  if (newNode?.id)
    setNodes((nds) =>
      nds.some((node) => node.id === newNode.id) ? nds : nds.concat(newNode)
    );
  if (fromSocket) return;
  if (newNode.length === 0) return;

  socket.emit("nodeCreate", newNode);
};

export const handleEdgesChangeUtil = (
  newEdges,
  fromSocket,
  edges,
  onEdgesChange,
  socket
) => {
  onEdgesChange(newEdges);

  if (fromSocket) return;

  socket.emit("edgeUpdate", { newEdges, edges });
};

export const handleNodesDeleteUtil = ({
  deletedNode,
  fromSocket = false,
  setNodes,
  setEdges,
}) => {
  console.log("deletedNode", deletedNode);
  deletedNode.map((dnode) => {
    setNodes((nodes) => nodes.filter((node) => node.id !== dnode.id));
    setEdges((edges) => edges.filter((edge) => edge.source !== dnode.id));
  });
  if (fromSocket) return;

  socket.emit("nodeDelete", deletedNode);
};

export const handleConnectChangeUtil = (
  params,
  fromSocket,
  onConnect,
  edges,
  setEdges,
  nodes
) => {
  console.log("params", params);

  const sourceDiv = document.querySelector(
    `div[data-handleid="${params.sourceHandle}"]`
  );
  const targetDiv = document.querySelector(
    `div[data-handleid="${params.targetHandle}"]`
  );

  if (sourceDiv && targetDiv) {
    let sourceColorClass = null;
    Object.keys(sourceDiv.classList).map((key) => {
      if (sourceDiv.classList[key].includes("Edge"))
        sourceColorClass = sourceDiv.classList[key];
    });

    let targetColorClass = null;
    Object.keys(targetDiv.classList).map((key) => {
      if (targetDiv.classList[key].includes("Edge"))
        targetColorClass = targetDiv.classList[key];
    });

    if (sourceColorClass === targetColorClass) {
      if (targetColorClass != "nullEdge")
        setEdges((edges) =>
          edges.filter((edge) => edge.targetHandle !== params.targetHandle)
        );
      onConnect(params);

      const newEdges = edges.filter(
        (edge) => edge.targetHandle !== params.targetHandle
      );
      console.log(newEdges);
      let lineColor = "#fff";
      if (targetColorClass) {
        const element = document.querySelector(`.${targetColorClass}`);
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          lineColor = rgbToHex(computedStyle.borderColor);
        }
      }

      console.log("sourceColorClass", sourceColorClass);
      if (fromSocket) return;
      let edge = params;
      edge.id = `${params.source}-${params.target}-${
        params.sourceHandle.split("-")[3]
      }-${generateRandomString()}`;
      edge.animated = sourceColorClass == "nullEdge";
      edge.style = { stroke: lineColor };
      edge.type = sourceColorClass == "nullEdge" ? "flow" : "param";
      edge.selected = false;
      socket.emit("onConnect", { edge, edges: newEdges , nodes});
    } else if (targetColorClass == "anyEdge") {
      onConnect(params);

      const newEdges = edges.filter(
        (edge) => edge.targetHandle !== params.targetHandle
      );
      console.log(newEdges);
      let lineColor = "#fff";
      if (targetColorClass) {
        const element = document.querySelector(`.${sourceColorClass}`);
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          lineColor = rgbToHex(computedStyle.borderColor);
        }
      }

      console.log("sourceColorClass", sourceColorClass);
      if (fromSocket) return;
      let edge = params;
      edge.id = `${params.source}-${params.target}-${
        params.sourceHandle.split("-")[3]
      }-${generateRandomString()}`;
      edge.animated = sourceColorClass == "nullEdge";
      edge.style = { stroke: lineColor };
      edge.type = sourceColorClass == "nullEdge" ? "flow" : "param";
      edge.selected = false;
      socket.emit("onConnect", { edge, edges: newEdges, nodes });
    } else {
      console.log(
        "it dont be matchin2",
        `${targetColorClass} ${sourceColorClass}`
      );
    }
  } else {
    console.log("Div not found");
  }
};

async function setDetailsUtil(node, setDetails, nodes) {
  let nodeData;

  nodes.map((nodeItem) => {
    if (nodeItem.id == node.id) nodeData = nodeItem;
  });
  console.log(nodeData);

  try {
    const response = await fetch(`/manage/getNode?id=${nodeData._id}`, {
      headers: { "x-sera-service": "be_builder" },
    });
    const jsonData = await response.json();
    if (!jsonData.issue) {
      nodeData["node_data"] = jsonData;
      setDetails(nodeData);
    } else {
      setIssue(jsonData.issue);
      console.log("something went wrong");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function rgbToHex(rgb) {
  // Ensure the input string is in the correct format (e.g., "rgb(255, 0, 0)")
  const regex = /rgb\((\d+), (\d+), (\d+)\)/;
  const match = rgb.match(regex);

  if (!match) {
    throw new Error("Invalid RGB color format");
  }

  // Extract the Red, Green, and Blue components
  const red = parseInt(match[1]);
  const green = parseInt(match[2]);
  const blue = parseInt(match[3]);

  // Convert each component to hexadecimal and pad with zeros if needed
  const redHex = red.toString(16).padStart(2, "0");
  const greenHex = green.toString(16).padStart(2, "0");
  const blueHex = blue.toString(16).padStart(2, "0");

  // Combine the hexadecimal values to form the final hex color code
  const hexColor = `#${redHex}${greenHex}${blueHex}`;

  return hexColor;
}
