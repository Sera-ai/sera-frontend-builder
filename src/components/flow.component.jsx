import React, { memo, useMemo, useEffect, useRef } from "react";
import ReactFlow, { Background, Controls, ReactFlowProvider } from "reactflow";

import Modal from "../helpers/helper.modal";
import ContextMenu from "./contexts/context.node";
import PaneMenu from "./contexts/context.pane";
import ItemBar from "./menus/menu.main";
import DetailsBar from "./menus/menu.detail";

import apiNode from "./nodes/node.api";
import functionNode from "./nodes/node.function";
import scriptNode from "./nodes/node.script";

import { triggerEvents } from "../events/events.triggers";
import { backendEvents } from "../events/events.backend";
import { socketEvents } from "../events/events.socket";
import { useAppContext } from "../AppContext";

const FlowComponent = () => {
  const builderContext = useAppContext();

  const nodeTypes = useMemo(
    () => ({
      apiNode,
      functionNode,
      scriptNode,
    }),
    []
  );

  useEffect(() => {
    const containers = Array.from(
      document.getElementsByClassName("react-flow__attribution")
    );
    containers.forEach((container) => container.remove());
  }, [builderContext.flowRef]);

  return (
    <ReactFlowProvider>
      {builderContext.oas && <ItemBarComponent oas={builderContext.oas} />}
      <FlowSetup nodeTypes={nodeTypes} />
      {builderContext.nodeDetails && (
        <DetailsBarComponent
          nodeDetails={builderContext.nodeDetails}
        />
      )}
    </ReactFlowProvider>
  );
};

const ItemBarComponent = memo(({ oas }) => <ItemBar oas={oas} />);

const DetailsBarComponent = memo(({ nodeDetails }) => {
  const { nodes, edges } = useAppContext();
  return (
    <DetailsBar
      nodeDetails={nodeDetails}
      nodes={nodes}
      edges={edges}
    />
  );
});

const FlowSetup = memo(({ nodeTypes }) => {
  const {
    nodes,
    edges,
    connectionLineColor,
    flowRef,
    wrapperRef,
    paneMenu,
    menu,
    issue,
  } = useAppContext();
  const backendEventClass = backendEvents(useAppContext());
  const triggerEventClass = triggerEvents(useAppContext());
  const socketEventClass = socketEvents(useAppContext());

  return (
    <div className="reactflow-wrapper" ref={wrapperRef}>
      {issue && <Modal data={issue} create={backendEventClass.createData} />}
      <ReactFlow
        ref={flowRef}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        connectionLineStyle={{ stroke: connectionLineColor }}
        snapToGrid={true}
        snapGrid={[10, 10]}
        fitView
        attributionPosition="bottom-left"
        onInit={triggerEventClass.loadRFI}
        onNodeContextMenu={triggerEventClass.onNodeContextMenu}
        onNodesChange={socketEventClass.handleNodesChange}
        onNodesDelete={socketEventClass.handleNodesDelete}
        onNodeClick={socketEventClass.handleNodeClick}
        onDrop={triggerEventClass.onDrop}
        onDragOver={triggerEventClass.onDragOver}
        onEdgesChange={socketEventClass.handleEdgesChange}
        onConnect={triggerEventClass.onConnect}
        onConnectStart={triggerEventClass.onConnectStart}
        onConnectEnd={triggerEventClass.onConnectEnd}
        onPaneClick={triggerEventClass.onPaneClick}
        onPaneMouseMove={triggerEventClass.onMouseMove}
        onError={(err) => console.log(err)}
      >
        <Controls />
        {paneMenu && <PaneMenu {...paneMenu} />}
        <Background variant="dots" gap={10} />
        <ContextMenu
          onClick={triggerEventClass.onPaneClick}
          {...menu}
          onDelete={socketEventClass.handleNodesDelete}
        />
      </ReactFlow>
    </div>
  );
});

export default FlowComponent;
