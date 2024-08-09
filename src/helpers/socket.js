import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { triggerEvents } from "../events/events.triggers";
import { socketEvents } from "../events/events.socket";

const SOCKET_URL = `wss://${true ? `${window.location.hostname}:9876` : `backend.sera:9876`}/sera-socket-io`;

const createWebSocket = () => {
  return new WebSocket(SOCKET_URL);
};

// Mutable reference to the WebSocket instance
let socket = createWebSocket();

export const useSocket = (builderContext) => {
  const { builder } = builderContext;
  const [isConnected, setIsConnected] = useState(false);

  const notify = (str) => toast(str);

  const socketEventClass = socketEvents({
    ...builderContext,
    _source: "socket",
  });
  const triggerEventClass = triggerEvents({
    ...builderContext,
    _source: "socket",
  });

  const wsEmit = useCallback(
    (event, data) => {
      if (isConnected) {
        const message = JSON.stringify({ type: event, ...data });
        socket.send(message);
      } else {
        console.warn("Socket not connected. Message not sent:", { event, data });
      }
    },
    [isConnected]
  );

  useEffect(() => {
    if (isConnected) {
      wsEmit("builderConnect", { builder });
    }
  }, [isConnected]);

  useEffect(() => {
    const handleOpen = () => {
      setIsConnected(true);
      socket.builder = builder;
      notify(`Builder Socket Connected`);

      console.log(new Date().getTime(), "Builder Socket Connected");

      const hash = new Date().getTime().toString().split("").reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0);

      const color = Array.from({ length: 3 }, (_, i) =>
        ((hash >> (i * 8)) & 0xff).toString(16).padStart(2, "0")
      )
        .reverse()
        .join("");

      builderContext.setBgColor("#" + color);
    };

    const handleMessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      switch (parsedMessage.type) {
        case "connectSuccessful": () => { }; break;
        case "userDisconnected":
          triggerEventClass.handleUserDisconnect(parsedMessage);
          break;
        case "mouseMoved":
          triggerEventClass.viewPeerPointers(parsedMessage);
          break;
        case "nodeUpdate":
          socketEventClass.handleNodesChange(parsedMessage);
          break;
        case "nodeCreate":
          socketEventClass.handleNodesCreate(parsedMessage);
          break;
        // case "nodeDelete":
        //   socketEventClass.handleNodesDelete(parsedMessage);
        //   break;
        case "edgeDelete":
          socketEventClass.handleEdgesDelete(parsedMessage.edge);
          break;
        case "edgeCreate":
          console.log("edge data created")
          socketEventClass.handleEdgesCreate(parsedMessage.edge);
          break;
        case "edgeUpdate":
          socketEventClass.handleEdgesChange(parsedMessage);
          break;
        case "onConnect":
          socketEventClass.handleConnectChange(parsedMessage);
          break;
        case "updateField":
          let paramName = parsedMessage?.edge ? "targets" : "inputData";
          const newNodes = builderContext.nodes.map((node) => {
            if (node.id === parsedMessage.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  [paramName]: parsedMessage.data,
                },
              };
            }
            return node;
          });
          builderContext.setNodes(newNodes);
          break;
        default:
          console.log("Unknown message type:", parsedMessage.type);
          break;
      }
    };

    const handleClose = () => {
      console.log(new Date().getTime(), "WebSocket connection closed");
      setIsConnected(false);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        socket = createWebSocket();
        setupWebSocketHandlers();
      }, 3000);
    };

    const handleError = (error) => {
      console.log("WebSocket error:", error);
      setTimeout(() => {
        socket = createWebSocket();
        setupWebSocketHandlers();
      }, 3000);
    };

    const setupWebSocketHandlers = () => {
      socket.addEventListener("open", handleOpen);
      socket.addEventListener("message", handleMessage);
      socket.addEventListener("close", handleClose);
      socket.addEventListener("error", handleError);
    };

    setupWebSocketHandlers();

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);
    };
  }, [builder, builderContext, socketEventClass, triggerEventClass, wsEmit]);

  // Assign the wsEmit to socket so it can be used externally
  socket.wsEmit = wsEmit;

  return null; // or any JSX you might need to render
};

// Export the socket instance for other classes to use
export { socket };
