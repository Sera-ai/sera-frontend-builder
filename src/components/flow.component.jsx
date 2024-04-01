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
import sendEventNode from "./nodes/node.sendEvent";
import eventNode from "./nodes/node.event";

import { triggerEvents } from "../events/events.triggers";
import { backendEvents } from "../events/events.backend";
import { socketEvents } from "../events/events.socket";
import { useAppContext } from "../AppContext";
import { ContentBar } from "../../../../src/components/standard/Standard.ContentBar";
import { EventBar } from "../../../../src/components/standard/Standard.EventBar";
import { useNavigate } from "react-router-dom";

const FlowComponent = () => {
  const builderContext = useAppContext();

  // Determine which sidebar component to render based on the builderContext.builderType
  const SideBarComponent = useMemo(() => {
    switch (builderContext.builderType) {
      case "builder":
        return ContentBar;
      case "event":
        return EventBar;
      default:
        return null; // Or a default component if you have one
    }
  }, [builderContext.builderType]);

  const nodeTypes = useMemo(
    () => ({
      apiNode,
      functionNode,
      scriptNode,
      sendEventNode,
      eventNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      flow: "default",
      param: "default",
    }),
    []
  );

  useEffect(() => {
    const containers = Array.from(
      document.getElementsByClassName("react-flow__attribution")
    );
    containers.forEach((container) => container.remove());
  }, [builderContext.flowRef]);

  const navigate = useNavigate();

  const navigateBuilder = (data) => {
    const newUrl = `/builder/${data
      .replace("__", "")
      .replace("https://", "")
      .replace("http://", "")}`;

    console.log(data);

    navigate(newUrl);
  };

  return (
    <ReactFlowProvider>
      {builderContext.oas && (
        <SideBarComponent
          // You might need to adjust these props based on which component is being rendered
          showHost={builderContext.builderType === "builder"}
          endpoint="inventory/api.sample.com/pets/__post"
          host={"http://sample.com"}
          selectedEndpoint={"selectedEndpoint"}
          showBlock={false}
          setSelectedEndpoint={navigateBuilder}
          builder
        >
          <ItemBarComponent
            oas={builderContext.oas}
            type={builderContext.builderType}
          />
        </SideBarComponent>
      )}
      <FlowSetup nodeTypes={nodeTypes} edgeTypes={edgeTypes} />
      {builderContext.nodeDetails && (
        <DetailsBarComponent nodeDetails={builderContext.nodeDetails} />
      )}
    </ReactFlowProvider>
  );
};

const ItemBarComponent = memo(({ oas, type }) => (
  <ItemBar oas={oas} type={type} />
));

const DetailsBarComponent = memo(({ nodeDetails }) => {
  const { nodes, edges } = useAppContext();
  return <DetailsBar nodeDetails={nodeDetails} nodes={nodes} edges={edges} />;
});

const FlowSetup = memo(({ nodeTypes, edgeTypes }) => {
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
        edgeTypes={edgeTypes}
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
        onError={(code, error) => console.log(code, error)}
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
