import { applyEdgeChanges, applyNodeChanges } from "reactflow";
import { generateRandomString } from "../helpers/helper.node";
import { socket } from "../helpers/socket";
import { backendEvents } from "./events.backend";

export const socketEvents = (builderContext) => {
  const {
    setIssue,
    nodes,
    setNodes,
    onNodesChange,
    nodeDetails,
    edges,
    setEdges,
    setNodeDetails,
    onEdgesChange,
    _source = null,
  } = builderContext;

  const backendEventClass = backendEvents({
    ...builderContext,
    _source: "component",
  });
  // Function to compare two nodes shallowly
  const handleNodesChange = (changedNodes) => {
    if (changedNodes.length == 0) return;
    if (changedNodes[0].type == "dimensions") return;
    if (changedNodes[0].type == "remove") return;
    if (changedNodes[0].type == "select") return;

    let sendUpdate = true;
    if (changedNodes[0].type == "position")
      sendUpdate = changedNodes[0].dragging;
    if (!sendUpdate) return;
    console.log(changedNodes);

    if (_source == "socket") {
      setNodes((oldEdges) => applyNodeChanges(changedNodes, oldEdges));
      return;
    }
    // Filter out unchanged nodes based on your criteria, e.g., position, data changes, etc.
    // This is a basic example; you might need a more complex comparison based on your needs.
    const changedNodes2 = changedNodes.filter((newNode) => {
      const oldNode = nodes.find((n) => n.id === newNode.id);
      if (
        JSON.stringify(oldNode.position) !== JSON.stringify(newNode.position)
      ) {
        return changedNodes.find((n) => n.id == newNode.id);
      }
    });
    setNodes((oldEdges) => applyNodeChanges(changedNodes, oldEdges));
    if (changedNodes2.length == 0) return;
    console.log("changedNodes", changedNodes)
    socket.wsEmit("nodeUpdate", { node: changedNodes });
  };

  const handleNodesCreate = (newNode) => {
    console.log(newNode);
    if (newNode?.id)
      setNodes((nds) =>
        nds.some((node) => node.id === newNode.id) ? nds : nds.concat(newNode)
      );
    if (_source == "socket") return;
    if (newNode.length === 0) return;
    backendEventClass.createNode(newNode);
  };

  const handleEdgesDelete = (changes) => {
    console.log("changes", changes);

    setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
  };

  const handleEdgesCreate = (newEdge) => {
    console.log(newEdge)
    setEdges((eds) => {
      // Check if the edge with the same ID already exists
      const edgeIndex = eds.findIndex((edge) => edge._id === newEdge._id);

      if (edgeIndex !== -1) {
        // Edge exists, update it
        return eds.map((edge, index) => {
          if (index === edgeIndex) {
            return { ...edge, ...newEdge }; // Update the existing edge with new properties
          }
          return edge; // Return all other edges unchanged
        });
      } else {
        // Edge doesn't exist, add the new edge
        return [...eds, newEdge];
      }
    });
  };

  const handleEdgesChange = (edge) => {
    if (_source == "socket") {
      setEdges((eds) => eds.map((edg) => (edg._id === edge._id ? edge : edg)));
    }
    if (_source == "socket") return;
    if (edge[0].type == "remove") {
      backendEventClass.removeEdge(edge);
    } else {
      //backendEventClass.updateEdge(edge);
    }
  };

  const handleNodesDelete = (deletedNode) => {
    console.log("deletedNode", deletedNode);
    deletedNode.map((dnode) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== dnode.id));
      setEdges((edges) => edges.filter((edge) => edge.source !== dnode.id));
    });
    if (_source == "socket") return;
    backendEventClass.deleteNode(deletedNode);
  };

  const handleConnectChange = (edge, create = false) => {
    if (_source == "socket") {
      setEdges((eds) =>
        eds.filter((edg) => (edg._id == edge._id ? edge : edg))
      );
    }
    if (_source == "socket") return;
    if (create) {
      backendEventClass.createEdge(edge);
    } else {
      backendEventClass.updateEdge(edge);
    }
  };

  const handleNodeClick = (event, node) => {
    if (node?._id != nodeDetails?._id) setDetails(node);
  };

  async function setDetails(nodeData) {
    if (!nodeData) return;
    try {
      const response = await fetch(`https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/getNode?id=${nodeData._id}`, {
        headers: { "x-sera-service": "be_builder" },
      });
      const jsonData = await response.json();
      if (jsonData) {
        if (!jsonData.issue) {
          nodeData["node_data"] = jsonData;
          setNodeDetails(nodeData);
        } else {
          setIssue(jsonData.issue);
          console.log("something went wrong");
        }
      } else {
        setIssue("something went wrong");
        console.log("something went wrong");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return {
    handleConnectChange,
    handleNodesDelete,
    handleNodeClick,
    handleEdgesChange,
    handleEdgesCreate,
    handleNodesChange,
    handleNodesCreate,
    handleEdgesDelete,
  };
};
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
