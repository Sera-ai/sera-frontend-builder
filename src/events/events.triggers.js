// customFunctions.js
import { socket } from '../helpers/socket';


import { newNodeDefault } from "../helpers/helper.node";

export const viewPeerPointers = (data, ref) => {
    const childElement = ref.current.children[0].children[0].children[0].querySelector(`#A${data.id}`);
    if (childElement) {
        childElement.style.left = data.x + 'px';
        childElement.style.top = data.y + 'px';
    } else {
        const newDiv = document.createElement('div');
        const iElem = document.createElement('i');
        iElem.className = 'fa fa-mouse-pointer';
        newDiv.appendChild(iElem);

        const toolTip = document.createElement('div');
        toolTip.innerText = data.id;
        toolTip.className = "mouseToolTip";
        newDiv.appendChild(toolTip);

        newDiv.className = "mouse";
        newDiv.style.color = data.color;
        newDiv.style.left = data.x + 'px';
        newDiv.style.top = data.y + 'px';
        newDiv.id = `A${data.id}`;

        ref.current.children[0].children[0].children[0].appendChild(newDiv);
    }
};

export const handleUserDisconnect = (data, ref) => {
    const childElement = ref.current.children[0].children[0].children[0].querySelector(`#A${data}`);
    if (childElement) {
        childElement.remove();
    }
};

export const onMouseMove = (ref, rfi, socket, bgColor, event) => {
    const bounds = ref.current.getBoundingClientRect();
    const position = rfi.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
    });
    socket.emit('mouseMove', { x: position.x, y: position.y, color: bgColor });
};

export const loadRFI = async (instance, setReactFlowInstance, fetchData) => {
    fetchData(window.location.pathname)

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
    false && setPaneMenu({
        top: event.clientY,
        left: event.clientX - 330,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
    });
};

export const onConnectStart = (event, setConnecting, setConnectionLineColor) => {
    console.log(event.target.classList)
    let getColorClass = null
    Object.keys(event.target.classList).map((key) => {
        if (event.target.classList[key].includes("Edge")) getColorClass = event.target.classList[key];
    })

    if (getColorClass) {
        const element = document.querySelector(`.${getColorClass}`);
        if (element) {
            const computedStyle = window.getComputedStyle(element);
            console.log("Background Color: ", rgbToHex(computedStyle.borderColor));
            setConnectionLineColor(rgbToHex(computedStyle.borderColor))
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

export const onDrop = async (event, rfw, rfi, handleNodesCreate) => {
    event.preventDefault();
    const rfb = rfw.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    if (typeof type === 'undefined' || !type) { return; }
    const position = rfi.project({
        x: event.clientX - rfb.left,
        y: event.clientY - rfb.top,
    });

    try {

        const fitType = type.replace("Node", "")
        const data = { "out": { "__type": `__${fitType}` } }

        const url = `http://localhost:${__BE_ROUTER_PORT__}/manage/node/create`;

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())  // assuming server responds with json
            .then(data => {
                const newNode = { id: data._id, node_id: data.node_id, type: "functionNode", position, data: newNodeDefault(type, data.node_id) };
                console.log("newNode", newNode)
                handleNodesCreate(newNode);
            })
            .catch(error => { console.error('Error:', error); return false });

    } catch (error) {
        console.error('Error fetching data:', error);
    }


};

export const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
};

export const onPaneClick = (connecting, setMenu, setPaneMenu, setConnecting, setDetails) => {
    if (!connecting) {
        setMenu(null);
        setPaneMenu(null);
        setDetails(null)
    } else {
        setConnecting(false);
    }
};

export const onConnect = (params, setEdges, addEdge) => {
    const sourceDiv = document.querySelector(`div[data-handleid="${params.sourceHandle}"]`);
    const targetDiv = document.querySelector(`div[data-handleid="${params.targetHandle}"]`);

    if (sourceDiv && targetDiv) {
        let sourceColorClass = null
        Object.keys(sourceDiv.classList).map((key) => {
            if (sourceDiv.classList[key].includes("Edge")) sourceColorClass = sourceDiv.classList[key];
        })

        let targetColorClass = null
        Object.keys(targetDiv.classList).map((key) => {
            if (targetDiv.classList[key].includes("Edge")) targetColorClass = targetDiv.classList[key];
        })

        if (sourceColorClass === targetColorClass) {

            let lineColor = "#fff"
            if (targetColorClass) {
                const element = document.querySelector(`.${targetColorClass}`);
                if (element) {
                    const computedStyle = window.getComputedStyle(element);
                    lineColor = rgbToHex(computedStyle.borderColor);
                }
            }

            setEdges((eds) => addEdge({ ...params, animated: sourceColorClass == "nullEdge", style: { stroke: lineColor } }, eds));

        } else {
            console.log("it dont be matchin")
        }

    } else {
        console.log("Div not found");
    }
};

export const fetchData = async (setNodes, setEdges, setOas, setIssue, path) => {
    try {
        const response = await fetch(`http://localhost:${__BE_ROUTER_PORT__}/manage/getEndpoint?path=${encodeURIComponent(path)}`);
        const jsonData = await response.json();
        if (!jsonData.issue) {
            console.log("nop",jsonData.builder.nodes)
            setNodes(jsonData.builder.nodes);
            setEdges(jsonData.builder.edges);
            socket.emit("builderConnect", jsonData.endpoint.builder_id)
            setOas(jsonData.oas)
        } else {
            setIssue(jsonData.issue)
            console.log("something went wrong")
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


export const createData = async (data, fetchData, setIssue) => {
    if (data.error == "NoEndpoint") {
        console.log("ho")

        const builder_id = await createBuilder(data)
        console.log(builder_id)

        const created = await createEndpoint(data, builder_id)
        if (created) {
            setIssue(null)
            fetchData(window.location.pathname)
        } else {
            alert("something went wrong")
        }
    }

    if (data.error == "NoBuilder") {
        const builder_id = await createBuilder(data)
        const created = await updateEndpoint(data, builder_id)
        if (created) {
            setIssue(null)
            fetchData(window.location.pathname)
        } else {
            alert("something went wrong")
        }
    }
    //if no builder, create builder default state and update the endpoint
    //if no endpoint, create the builder default state and create the endpoint with the builder id
}


function createEndpoint(data, builder_id) {
    console.log("gk")
    const urli = "https:/" + window.location.pathname
    const parsed = new URL(urli)
    const oasUrl = `${parsed.protocol}//${parsed.host}`

    const lastSlashIndex = parsed.pathname.lastIndexOf('/');
    const path = parsed.pathname.substring(0, lastSlashIndex);   // "boop/boop"
    const method = (parsed.pathname.substring(lastSlashIndex + 1)).toUpperCase(); // "boop"

    const data2 = {
        hostname: parsed.host.split(":")[0],
        endpoint: path,
        method: method,
        builder_id: builder_id
    };

    const url = `http://localhost:${__BE_ROUTER_PORT__}/manage/endpoint/create`;
    console.log(JSON.stringify(data2))
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data2)
    })
        .then(response => response.json())  // assuming server responds with json
        .then(data => { return true })
        .catch(error => { console.error('Error:', error); return false });
}

function updateEndpoint(data, builder_id) {
    const urli = "https:/" + window.location.pathname
    const parsed = new URL(urli)
    const oasUrl = `${parsed.protocol}//${parsed.host}`

    const lastSlashIndex = parsed.pathname.lastIndexOf('/');
    const path = parsed.pathname.substring(0, lastSlashIndex);   // "boop/boop"
    const method = (parsed.pathname.substring(lastSlashIndex + 1)).toUpperCase(); // "boop"

    const data2 = {
        hostname: parsed.host.split(":")[0],
        endpoint: path,
        method: method,
        builder_id: builder_id
    };

    const url = `http://localhost:${__BE_ROUTER_PORT__}/manage/endpoint/update`;

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data2)
    })
        .then(response => response.json())  // assuming server responds with json
        .then(data => { return true })
        .catch(error => { console.error('Error:', error); return false });
}

function createBuilder(data) {

    const urli = "https:/" + window.location.pathname
    const parsed = new URL(urli)
    const oasUrl = `${parsed.protocol}//${parsed.host}`

    const lastSlashIndex = parsed.pathname.lastIndexOf('/');
    const path = parsed.pathname.substring(0, lastSlashIndex);   // "boop/boop"
    const method = (parsed.pathname.substring(lastSlashIndex + 1)).toUpperCase(); // "boop"

    const data2 = {
        hostname: parsed.host.split(":")[0],
        path: path,
        method: method
    };

    const url = `http://localhost:${__BE_ROUTER_PORT__}/manage/builder/create`;

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data2)
    })
        .then(response => response.json())  // assuming server responds with json
        .then(data => { return data._id })
        .catch(error => console.error('Error:', error));
}

function rgbToHex(rgb) {
    // Ensure the input string is in the correct format (e.g., "rgb(255, 0, 0)")
    const regex = /rgb\((\d+), (\d+), (\d+)\)/;
    const match = rgb.match(regex);

    if (!match) {
        throw new Error('Invalid RGB color format');
    }

    // Extract the Red, Green, and Blue components
    const red = parseInt(match[1]);
    const green = parseInt(match[2]);
    const blue = parseInt(match[3]);

    // Convert each component to hexadecimal and pad with zeros if needed
    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');

    // Combine the hexadecimal values to form the final hex color code
    const hexColor = `#${redHex}${greenHex}${blueHex}`;

    return hexColor;
}