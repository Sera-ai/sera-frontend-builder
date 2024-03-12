import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactFlow, {
  useNodesState,
  Background,
  useEdgesState,
  addEdge,
  Controls,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";
import "./assets/css/nodes/node.css";
import "./assets/css/sidebar.css";
import "./assets/css/mouse.css";
import "./assets/css/menu/detail.css";
import "./assets/css/index.css";

import { socket } from "./helpers/socket";
import Modal from "./helpers/helper.modal";

import ContextMenu from "./components/contexts/context.node";
import PaneMenu from "./components/contexts/context.pane";
import ItemBar from "./components/menus/menu.main";
import DetailsBar from "./components/menus/menu.detail";

import apiNode from "./components/nodes/node.api";
import functionNode from "./components/nodes/node.function";
import scriptNode from "./components/nodes/node.script";

import {
  handleEdgesChangeUtil,
  handleNodesChangeUtil,
  handleNodesCreateUtil,
  handleConnectChangeUtil,
  handleNodesDeleteUtil,
} from "./events/events.socket";

import {
  viewPeerPointers as viewPeerPointersUtil,
  handleUserDisconnect as handleUserDisconnectUtil,
  onMouseMove as onMouseMoveUtil,
  loadRFI as loadRFIUtil,
  onNodeContextMenu as onNodeContextMenuUtil,
  onConnectEnd as onConnectEndUtil,
  onConnectStart as onConnectStartUtil,
  onDrop as onDropUtil,
  onDragOver as onDragOverUtil,
  onPaneClick as onPaneClickUtil,
  onConnect as onConnectUtil,
} from "./events/events.triggers";

import {
  fetchData as fetchDataUtil,
  createData as createDataUtil,
  createNode
} from "./events/events.backend";

const initBgColor = "#141414";
const snapGrid = [10, 10];
const nodeTypes = {
  apiNode,
  functionNode,
  scriptNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 0.75 };

const nodeBuilder = () => {
  // Refs
  const rfw = useRef(null);
  const ref = useRef(null);

  // Basic States
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [nodeSelected, onSelection] = useState(null);
  const [nodeDetails, setDetails] = useState(null);
  const [bgColor, setBgColor] = useState(initBgColor);
  const [menu, setMenu] = useState(null);
  const [oas, setOas] = useState(null);
  const [issue, setIssue] = useState(null);
  const [paneMenu, setPaneMenu] = useState(null);
  const [rfi, setReactFlowInstance] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionLineColor, setConnectionLineColor] = useState("#fff");

  // Complex States (custom hooks)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  /* On Event Handlers */
  const onDragOver = (event) => onDragOverUtil(event);
  const onConnect = (params) => onConnectUtil(params, setEdges, addEdge);
  const onDrop = (event) =>
    onDropUtil(event, rfw, rfi, handleNodesCreateUtil, setNodes, createNode);
  const onConnectStart = (event) =>
    onConnectStartUtil(event, setConnecting, setConnectionLineColor);
  const onMouseMove = (event) =>
    onMouseMoveUtil(ref, rfi, socket, bgColor, event);
  const onConnectEnd = (event, node) =>
    onConnectEndUtil(event, node, ref, setPaneMenu);
  const onPaneClick = () =>
    onPaneClickUtil(
      connecting,
      setMenu,
      setPaneMenu,
      setConnecting,
      setDetails
    );
  const onNodeContextMenu = (event, node) =>
    onNodeContextMenuUtil(event, node, ref, setMenu);

  /*   */
  const viewPeerPointers = (data) => viewPeerPointersUtil(data, ref);
  const fetchData = (path) =>
    fetchDataUtil(setNodes, setEdges, setOas, setIssue, path);
  const loadRFI = (instance) =>
    loadRFIUtil(instance, setReactFlowInstance, fetchData);
  const handleUserDisconnect = (data) => handleUserDisconnectUtil(data, ref);
  const createData = (data) => createDataUtil(data, fetchData, setIssue);

  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    function onConnectSocket() {
      setIsConnected(true);
      console.log("socket connected");
      const hash = socket.id
        .split("")
        .reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);

      // Convert hash to a 6-character hexadecimal color code
      const color = Array.from({ length: 3 }, (_, i) =>
        ((hash >> (i * 8)) & 0xff).toString(16).padStart(2, "0")
      )
        .reverse()
        .join(""); // Reverse to maintain the original order if needed

      setBgColor("#" + color);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    socket.on("connect", onConnectSocket);
    socket.on("disconnect", onDisconnect);
    socket.on("userDisconnected", handleUserDisconnect);

    socket.on("mouseMoved", viewPeerPointers);

    socket.on("nodeUpdate", (node) => {
      handleNodesChangeUtil({
        changedNodes: node.changedNodes,
        nodes,
        onNodesChange,
        onSelection,
        setDetails,
        fromSocket: true,
      });
    });
    socket.on("nodeCreate", (node) => {
      handleNodesCreateUtil({
        newNode: node.newNode,
        setNodes,
      });
    });
    socket.on("nodeDelete", (node) => {
      handleNodesDeleteUtil({
        deletedNode: node,
        fromSocket: true,
        setNodes,
        setEdges,
      });
    });
    socket.on("edgeUpdate", (edge) => {
      handleEdgesChangeUtil({
        edge,
        fromSocket: true,
        edges,
        onEdgesChange,
      });
    });
    socket.on("onConnect", (edge) => {
      handleConnectChangeUtil({
        edge,
        fromSocket: true,
        onConnect,
        edges,
        setEdges,
        nodes,
      });
    });
    socket.on("updateField", (data) => {
      let paramName = data?.edge ? "targets" : "inputData";
      const newNodes = nodesRef.current.map((node) => {
        if (node.id === data.id) {
          return {
            ...node,
            data: {
              ...node.data,
              [paramName]: data.data,
            },
          };
        }
        return node;
      });
      console.log(newNodes);
      setNodes(newNodes);
    });

    const containers = Array.from(
      document.getElementsByClassName("react-flow__attribution")
    );
    containers.forEach((container) => container.remove());
  }, []);

  return (
    <div className="sera-flow" style={{ height: "100%", width: "100%" }}>
      <ReactFlowProvider>
        {oas && <ItemBar oas={oas} />}

        <div className="reactflow-wrapper" ref={rfw}>
          {issue && <Modal data={issue} create={createData} />}

          <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            style={{ background: initBgColor }}
            nodeTypes={nodeTypes}
            connectionLineStyle={{ stroke: connectionLineColor }}
            snapToGrid={true}
            snapGrid={snapGrid}
            defaultViewport={defaultViewport}
            fitView
            attributionPosition="bottom-left"
            onNodeContextMenu={onNodeContextMenu}
            onNodesChange={(changedNodes) =>
              handleNodesChangeUtil({
                changedNodes,
                nodes,
                onNodesChange,
                onSelection,
                setDetails,
              })
            }
            onEdgesChange={(edge) => {
              handleEdgesChangeUtil({
                edge,
                edges,
                onEdgesChange,
              });
            }}
            onConnect={(edge) => {
              handleConnectChangeUtil({
                edge,
                fromSocket: true,
                onConnect,
                edges,
                setEdges,
                nodes,
              });
            }}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onNodesDelete={(node) => {
              handleNodesDeleteUtil({
                deletedNode: node,
                setNodes,
                setEdges,
              });
            }}
            onPaneClick={onPaneClick}
            onPaneMouseMove={onMouseMove}
            onInit={loadRFI}
            onError={(err) => {
              console.log(err);
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Controls />
            {paneMenu && <PaneMenu {...paneMenu} />}

            <Background variant="dots" gap={10} />
            <ContextMenu
              onClick={onPaneClick}
              {...menu}
              onDelete={(node) => {
                handleNodesDeleteUtil({
                  deletedNode: node,
                  setNodes,
                  setEdges,
                });
              }}
            />
          </ReactFlow>
        </div>
        {nodeDetails && (
          <DetailsBar
            handleConnectChange={(edge) => {
              handleConnectChangeUtil({
                edge,
                fromSocket: true,
                onConnect,
                edges,
                setEdges,
                nodes,
              });
            }}
            nodeDetails={nodeDetails}
            nodes={nodes}
            edges={edges}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default nodeBuilder;
