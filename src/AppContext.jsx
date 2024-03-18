import React, { createContext, useContext, useState, useRef } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";
// Create context
const AppContext = createContext();

// Provider component that wraps your app and makes the state available to any child component
export const AppProvider = ({ children }) => {
  const [bgColor, setBgColor] = useState("#000");
  const [rfi, setReactFlowInstance] = useState(null);

  const [connecting, setConnecting] = useState(false);
  const [connectionLineColor, setConnectionLineColor] = useState("#fff");

  const [oas, setOas] = useState(null);
  const [issue, setIssue] = useState(null);

  // Complex States (custom hooks)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // Add other states and setters here
  const [nodeDetails, setNodeDetails] = useState(null);
  const [menu, setMenu] = useState(null);
  const [paneMenu, setPaneMenu] = useState(null);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);
