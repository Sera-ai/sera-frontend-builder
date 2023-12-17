import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  Background,
  useEdgesState,
  addEdge,
  Controls,
  ReactFlowProvider
} from 'reactflow';

import 'reactflow/dist/style.css';
import './assets/css/nodes/node.css';
import './assets/css/sidebar.css';
import './assets/css/mouse.css';
import './assets/css/menu/detail.css';

import { socket } from './helpers/socket';

import Modal from './helpers/helper.modal';


import ContextMenu from './components/contexts/context.node';
import PaneMenu from './components/contexts/context.pane';
import ItemBar from './components/menus/menu.main';
import DetailsBar from './components/menus/menu.detail';

import apiNode from './components/nodes/node.api';
import functionNode from './components/nodes/node.function';



import {
  handleEdgesChangeUtil,
  handleNodesChangeUtil,
  handleNodesCreateUtil,
  handleConnectChangeUtil,
  handleFieldUpdateUtil,
  handleNodesDeleteUtil
} from './events/events.socket';

import {
  viewPeerPointers as viewPeerPointersUtil,
  handleUserDisconnect as handleUserDisconnectUtil,
  onMouseMove as onMouseMoveUtil,
  loadRFI as loadRFIUtil,
  onNodeContextMenu as onNodeContextMenuUtil,
  onConnectEnd as onConnectEndUtil,
  onConnectStart as onConnectStartUtil,
  onPaneContextMenu as onPaneContextMenuUtil,
  onDrop as onDropUtil,
  onDragOver as onDragOverUtil,
  onPaneClick as onPaneClickUtil,
  onConnect as onConnectUtil,
  fetchData as fetchDataUtil,
  createData as createDataUtil
} from './events/events.triggers';




const initBgColor = '#141414';
const snapGrid = [10, 10];
const nodeTypes = {
  apiNode,
  functionNode
};

const defaultViewport = { x: 0, y: 0, zoom: 1 };

const CustomNodeFlow = () => {
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
  const [connectionLineColor, setConnectionLineColor] = useState("#fff")

  // Complex States (custom hooks)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);


  /* Socket.IO Emitters */
  const handleNodesChange = (newNodes, fromSocket = false) => handleNodesChangeUtil(newNodes, fromSocket, nodes, onNodesChange, onSelection, setDetails, socket);
  const handleNodesCreate = (newNode, fromSocket = false) => handleNodesCreateUtil(newNode, fromSocket, setNodes, socket);
  const handleEdgesChange = (newEdges, fromSocket = false) => handleEdgesChangeUtil(newEdges, fromSocket, edges, onEdgesChange, socket);
  const handleConnectChange = (params, fromSocket = false) => handleConnectChangeUtil(params, fromSocket, onConnect, socket, edges, setEdges);
  const handleNodesDelete = (deletedNode, fromSocket = false) => handleNodesDeleteUtil(deletedNode, fromSocket, setNodes, setEdges, socket)

  /* On Event Handlers */
  const onDragOver = (event) => onDragOverUtil(event);
  const onConnect = (params) => onConnectUtil(params, setEdges, addEdge);
  const onDrop = (event) => onDropUtil(event, rfw, rfi, handleNodesCreate);
  const onConnectStart = (event) => onConnectStartUtil(event, setConnecting, setConnectionLineColor);
  const onMouseMove = (event) => onMouseMoveUtil(ref, rfi, socket, bgColor, event);
  const onPaneContextMenu = (event) => onPaneContextMenuUtil(event, ref, setPaneMenu);
  const onConnectEnd = (event, node) => onConnectEndUtil(event, node, ref, setPaneMenu);
  const onPaneClick = () => onPaneClickUtil(connecting, setMenu, setPaneMenu, setConnecting, setDetails);
  const onNodeContextMenu = (event, node) => onNodeContextMenuUtil(event, node, ref, setMenu);

  /*   */
  const viewPeerPointers = (data) => viewPeerPointersUtil(data, ref);
  const fetchData = (path) => fetchDataUtil(setNodes, setEdges, setOas, setIssue, path);
  const loadRFI = (instance) => loadRFIUtil(instance, setReactFlowInstance, fetchData);
  const handleUserDisconnect = (data) => handleUserDisconnectUtil(data, ref);
  const createData = (data) => createDataUtil(data, fetchData, setIssue);


  useEffect(() => {
    function onConnectSocket() { setIsConnected(true); console.log("socket connected"); socket.emit("getId"); }
    function onDisconnect() { setIsConnected(false); }
    const gotId = str => setBgColor('#' + [...Array(3)].map((_, i) => ((str.split('').reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0) >> (i * 8)) & 0xff).toString(16).padStart(2, '0')).join(''));

    socket.on('connect', onConnectSocket);
    socket.on('disconnect', onDisconnect);

    socket.on('gotId', gotId);
    socket.on('mouseMoved', viewPeerPointers);
    socket.on('userDisconnected', handleUserDisconnect);
    socket.on('nodeUpdate', (node) => { handleNodesChange(node.newNodes, true) });
    socket.on('nodeCreate', (node) => { handleNodesCreate(node.newNode, true) });
    socket.on('nodeDelete', (node) => { handleNodesDelete(node, true) });
    socket.on('edgeUpdate', (edge) => handleEdgesChange(edge, true));
    socket.on('onConnect', (edge) => handleConnectChange(edge, true));
    socket.on('updateField', (data) => handleFieldUpdateUtil(data, ref))


    const containers = Array.from(document.getElementsByClassName('react-flow__attribution'));
    containers.forEach(container => container.remove());
  }, []);


  return (
    <div className='sera-flow' style={{ height: '100vh', width: '100vw' }}>
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
            //onPaneContextMenu={onPaneContextMenu}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnectChange}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onNodesDelete={handleNodesDelete}
            onPaneClick={onPaneClick}
            onPaneMouseMove={onMouseMove}
            onInit={loadRFI}
            onError={(err) => { console.log(err) }}
            onDrop={onDrop}
            onDragOver={onDragOver} >
            <Controls />
            {paneMenu && <PaneMenu {...paneMenu} />}

            <Background variant="dots" gap={10} />
            <ContextMenu onClick={onPaneClick} {...menu} onDelete={handleNodesDelete} />
          </ReactFlow>
        </div>
        {nodeDetails && <DetailsBar handleConnectChange={handleConnectChange} nodeDetails={nodeDetails} nodes={nodes} edges={edges} />}
      </ReactFlowProvider>
    </div>
  );
};

export default CustomNodeFlow;
