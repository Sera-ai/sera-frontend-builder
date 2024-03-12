// customFunctions.js
import { socket } from "../helpers/socket";

import { newNodeDefault } from "../helpers/helper.node";

export const viewPeerPointers = (data, ref) => {
  const childElement =
    ref.current.children[0].children[0].children[0].querySelector(
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

    ref.current.children[0].children[0].children[0].appendChild(newDiv);
  }
};

export const handleUserDisconnect = (data, ref) => {
  const childElement =
    ref.current.children[0].children[0].children[0].querySelector(`#A${data}`);
  if (childElement) {
    childElement.remove();
  }
};

export const onMouseMove = (ref, rfi, socket, bgColor, event) => {
  const bounds = ref.current.getBoundingClientRect();
  const position = rfi.project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  });
  socket.emit("mouseMove", { x: position.x, y: position.y, color: bgColor });
};

export const loadRFI = async (instance, setReactFlowInstance, fetchData) => {
  fetchData(window.location.pathname);

  setReactFlowInstance(instance);
};

export const onNodeContextMenu = (event, node, ref, setMenu) => {
  event.preventDefault();
  const pane = ref.current.getBoundingClientRect();
  setMenu({
    id: node.id,
    top: event.clientY,
    left: event.clientX - 330,
    right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
    bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
  });
};

export const onConnectEnd = (event, node, ref, setPaneMenu) => {
  const pane = ref.current.getBoundingClientRect();
  false &&
    setPaneMenu({
      top: event.clientY,
      left: event.clientX - 330,
      right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
      bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
    });
};

export const onConnectStart = (
  event,
  setConnecting,
  setConnectionLineColor
) => {
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
      setConnectionLineColor(rgbToHex(computedStyle.borderColor));
    }
  }

  setConnecting(true);
};

export const onPaneContextMenu = (event, ref, setPaneMenu) => {
  event.preventDefault();
  const pane = ref.current.getBoundingClientRect();
  setPaneMenu({
    top: event.clientY,
    left: event.clientX - 330,
    right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
    bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
  });
};

export const onDrop = async (event, rfw, rfi, handleNodesCreate, setNodes, createNode) => {
  event.preventDefault();
  const rfb = rfw.current.getBoundingClientRect();
  const type = event.dataTransfer.getData("application/reactflow");
  if (typeof type === "undefined" || !type) {
    return;
  }
  const position = rfi.project({
    x: event.clientX - rfb.left,
    y: event.clientY - rfb.top,
  });
  let newNode = newNodeDefault(type);
  newNode.position = position;
  handleNodesCreate({ newNode, setNodes, createNode });
};

export const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

export const onPaneClick = (
  connecting,
  setMenu,
  setPaneMenu,
  setConnecting,
  setDetails
) => {
  if (!connecting) {
    setMenu(null);
    setPaneMenu(null);
    setDetails(null);
  } else {
    setConnecting(false);
  }
};

export const onConnect = (params, setEdges, addEdge) => {
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

    if (sourceColorClass === targetColorClass) {
      let lineColor = "#fff";
      if (targetColorClass) {
        const element = document.querySelector(`.${targetColorClass}`);
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          lineColor = rgbToHex(computedStyle.borderColor);
        }
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: sourceColorClass == "nullEdge",
            style: { stroke: lineColor },
          },
          eds
        )
      );
    }
    if (targetColorClass == "anyEdge") {
      let lineColor = "#fff";
      if (targetColorClass) {
        const element = document.querySelector(`.${sourceColorClass}`);
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          lineColor = rgbToHex(computedStyle.borderColor);
        }
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: sourceColorClass == "nullEdge",
            style: { stroke: lineColor },
          },
          eds
        )
      );
    } else {
      console.log("it dont be matchin");
    }
  } else {
    console.log("Div not found");
  }
};

function rgbToHex(rgb) {
  // Ensure the input string is in the correct format (e.g., "rgb(255, 0, 0)")
  console.log(rgb);
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
