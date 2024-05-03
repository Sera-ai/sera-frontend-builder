import { io } from "socket.io-client";
export const socket = io(`wss://${window.location.hostname}::${window.location.port}`);
import { triggerEvents } from "../events/events.triggers";
import { socketEvents } from "../events/events.socket";

export const useSocket = (builderContext) => {
  const socketEventClass = socketEvents({
    ...builderContext,
    _source: "socket",
  });
  const triggerEventClass = triggerEvents({
    ...builderContext,
    _source: "socket",
  });

  function onConnectSocket() {
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

    builderContext.setBgColor("#" + color);
  }

  socket.on("connectSuccessful", onConnectSocket);

  socket.on("userDisconnected", triggerEventClass.handleUserDisconnect);
  socket.on("mouseMoved", triggerEventClass.viewPeerPointers);

  socket.on("nodeUpdate", socketEventClass.handleNodesChange);
  socket.on("nodeCreate", socketEventClass.handleNodesCreate);
  socket.on("nodeDelete", socketEventClass.handleNodesDelete);
  socket.on("edgeDelete", socketEventClass.handleEdgesDelete);
  socket.on("edgeCreate", socketEventClass.handleEdgesCreate);
  socket.on("edgeUpdate", socketEventClass.handleEdgesChange);
  socket.on("onConnect", socketEventClass.handleConnectChange);

  socket.on("updateField", (data) => {
    let paramName = data?.edge ? "targets" : "inputData";
    const newNodes = builderContext.nodes.map((node) => {
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
    builderContext.setNodes(newNodes);
  });
};
