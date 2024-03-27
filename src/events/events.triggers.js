// customFunctions.js
import { addEdge } from "reactflow";
import { newNodeDefault } from "../helpers/helper.node";
import { socket } from "../helpers/socket";
import { backendEvents } from "./events.backend";
import { socketEvents } from "./events.socket";

export const triggerEvents = (builderContext) => {
  const backendEventClass = backendEvents({
    ...builderContext,
    _source: "component",
  });
  const socketEventClass = socketEvents({
    ...builderContext,
    _source: "component",
  });

  const viewPeerPointers = (data) => {
    const childElement =
      builderContext.flowRef.current.children[0].children[0].children[0].querySelector(
        `#A${data.id}`
      );
    if (childElement) {
      childElement.style.left = data.x + "px";
      childElement.style.top = data.y + "px";
    } else {
      const newDiv = document.createElement("div");
      const iElem = document.createElement("i");
      iElem.className = "fa fa-mouse-pointer";
      newDiv.appendChild(iElem);

      const toolTip = document.createElement("div");
      toolTip.innerText = data.id;
      toolTip.className = "mouseToolTip";
      newDiv.appendChild(toolTip);

      newDiv.className = "mouse";
      newDiv.style.color = data.color;
      newDiv.style.left = data.x + "px";
      newDiv.style.top = data.y + "px";
      newDiv.id = `A${data.id}`;

      builderContext.flowRef.current.children[0].children[0].children[0].appendChild(
        newDiv
      );
    }
  };

  const handleUserDisconnect = (data) => {
    const childElement =
      builderContext.flowRef.current.children[0].children[0].children[0].querySelector(
        `#A${data}`
      );
    if (childElement) {
      childElement.remove();
    }
  };

  const onMouseMove = (event) => {
    const bounds = builderContext.flowRef.current.getBoundingClientRect();
    const position = builderContext.rfi.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    socket.emit("mouseMove", {
      x: position.x,
      y: position.y,
      color: builderContext.bgColor,
    });
  };

  const loadRFI = async (instance) => {
    backendEventClass.fetchData();
    builderContext.setReactFlowInstance(instance);
  };

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    const pane = builderContext.flowRef.current.getBoundingClientRect();
    builderContext.setMenu({
      id: node.id,
      top: event.clientY,
      left: event.clientX - 330,
      right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
      bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
    });
  };

  const onConnectEnd = (event) => {
    const pane = builderContext.flowRef.current.getBoundingClientRect();
    false &&
      builderContext.setPaneMenu({
        top: event.clientY,
        left: event.clientX - 330,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
  };

  const onConnectStart = (event) => {
    console.log(event.target.classList);
    let getColorClass = null;
    Object.keys(event.target.classList).map((key) => {
      if (event.target.classList[key].includes("Edge"))
        getColorClass = event.target.classList[key];
    });

    if (getColorClass) {
      const element = document.querySelector(`.${getColorClass}`);
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        console.log("Background Color: ", rgbToHex(computedStyle.borderColor));
        builderContext.setConnectionLineColor(
          rgbToHex(computedStyle.borderColor)
        );
      }
    }

    builderContext.setConnecting(true);
  };

  const onPaneContextMenu = (event) => {
    event.preventDefault();
    const pane = builderContext.flowRef.current.getBoundingClientRect();
    builderContext.setPaneMenu({
      top: event.clientY,
      left: event.clientX - 330,
      right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
      bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
    });
  };

  const onDrop = async (event) => {
    event.preventDefault();
    const rfb = builderContext.wrapperRef.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    if (typeof type === "undefined" || !type) {
      return;
    }
    const position = builderContext.rfi.project({
      x: event.clientX - rfb.left,
      y: event.clientY - rfb.top,
    });
    let newNode = newNodeDefault(type);
    newNode.position = position;
    socketEventClass.handleNodesCreate(newNode);
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onPaneClick = () => {
    builderContext.setMenu(null);
    builderContext.setPaneMenu(null);
    builderContext.setNodeDetails(null);
  };

  const onConnect = (params) => {
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

      console.log(sourceColorClass);
      console.log(targetColorClass);
      if (sourceColorClass === targetColorClass) {
        let lineColor = "#fff";
        if (targetColorClass) {
          const element = document.querySelector(`.${targetColorClass}`);
          if (element) {
            const computedStyle = window.getComputedStyle(element);
            lineColor = rgbToHex(computedStyle.borderColor);
          }
        }

        backendEventClass.createEdge({
          ...params,
          animated: sourceColorClass == "nullEdge",
          style: { stroke: lineColor },
        });
      } else if (targetColorClass == "anyEdge") {
        let lineColor = "#fff";
        const element = document.querySelector(`.${sourceColorClass}`);
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          lineColor = rgbToHex(computedStyle.borderColor);
        }

        backendEventClass.createEdge({
          ...params,
          animated: sourceColorClass == "nullEdge",
          style: { stroke: lineColor },
        });
      } else if (sourceColorClass == "anyEdge") {
        let lineColor = "#fff";
        const element = document.querySelector(`.${targetColorClass}`);
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          lineColor = rgbToHex(computedStyle.borderColor);
        }

        backendEventClass.createEdge({
          ...params,
          animated: sourceColorClass == "nullEdge",
          style: { stroke: lineColor },
        });
      } else {
        console.log("it dont be matchin");
      }
    } else {
      console.log("Div not found");
    }
  };

  return {
    viewPeerPointers,
    handleUserDisconnect,
    onMouseMove,
    loadRFI,
    onNodeContextMenu,
    onConnectEnd,
    onConnectStart,
    onPaneContextMenu,
    onDrop,
    onDragOver,
    onPaneClick,
    onConnect,
  };
};

function rgbToHex(rgb) {
  // Extend the regex to optionally match the alpha component
  const regex = /rgba?\((\d+), (\d+), (\d+)(?:, [\d.]+)?\)/;
  const match = rgb.match(regex);

  if (!match) {
    throw new Error("Invalid RGB(A) color format");
  }

  // Extract the Red, Green, and Blue components
  let red = parseInt(match[1]);
  let green = parseInt(match[2]);
  let blue = parseInt(match[3]);

  // Check if the color is black, and adjust to white if it is
  if (red === 0 && green === 0 && blue === 0) {
    red = 255;
    green = 255;
    blue = 255;
  }

  // Convert each component to hexadecimal and pad with zeros if needed
  const redHex = red.toString(16).padStart(2, "0");
  const greenHex = green.toString(16).padStart(2, "0");
  const blueHex = blue.toString(16).padStart(2, "0");

  // Combine the hexadecimal values to form the final hex color code
  const hexColor = `#${redHex}${greenHex}${blueHex}`;

  return hexColor;
}
