import React, { createContext, useContext, useState, useRef } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";
// Create context
const AppContext = createContext();

// Provider component that wraps your app and makes the state available to any child component
export const AppProvider = ({
  type = "builder",
  initialNodes = [],
  initialEdges = [],
  initialOas = {},
  builderId = null,
  playbook = null,
  children,
  getNodeStruc = () => {},
}) => {
  const [bgColor, setBgColor] = useState("#000");
  const [rfi, setReactFlowInstance] = useState(null);
  const [builderType, setBuilderType] = useState(type);

  const [connecting, setConnecting] = useState(false);
  const [connectionLineColor, setConnectionLineColor] = useState("#fff");

  const [oas, setOas] = useState(initialOas);
  const [issue, setIssue] = useState(null);

  // Complex States (custom hooks)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // Add other states and setters here
  const [nodeDetails, setNodeDetails] = useState(null);
  const [menu, setMenu] = useState(null);
  const [paneMenu, setPaneMenu] = useState(null);
  const [builder, setBuilder] = useState(builderId);
  const [playbookId, setPlaybook] = useState(playbook);

  const flowRef = useRef(null);
  const wrapperRef = useRef(null);

  return (
    <AppContext.Provider
      value={{
        bgColor,
        setBgColor,
        rfi,
        setReactFlowInstance,
        oas,
        setOas,
        issue,
        setIssue,
        nodes,
        setNodes,
        onNodesChange,
        edges,
        setEdges,
        onEdgesChange,
        flowRef,
        wrapperRef,
        nodeDetails,
        setNodeDetails,
        menu,
        setMenu,
        paneMenu,
        setPaneMenu,
        connectionLineColor,
        setConnectionLineColor,
        connecting,
        setConnecting,
        builderType,
        builder,
        getNodeStruc,
        playbookId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);
