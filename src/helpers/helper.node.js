export const newNodeDefault = (input) => {
  console.log(input)
  const type = JSON.parse(input);
  const typeMapping = {
    integerNode: "integer",
    stringNode: "string",
    arrayNode: "array",
    booleanNode: "boolean",
    scriptNode: "script",
    eventNode: "event",
    toastNode: "toast",
    sendEventNode: "event",
    fetchIntegrationNode: "fetchIntegration",
    pushIntegrationNode: "pushIntegration",
    fetchIntegrationDeployNode: "fetchIntegration"
  };

  const ntype = {
    integerNode: "functionNode",
    stringNode: "functionNode",
    arrayNode: "functionNode",
    booleanNode: "booleanNode",
    scriptNode: "scriptNode",
    eventNode: "eventNode",
    toastNode: "toastNode",
    sendEventNode: "sendEventNode",
    fetchIntegrationNode: "fetchIntegrationNode",
    pushIntegrationNode: "pushIntegrationNode",
    fetchIntegrationDeployNode: "fetchIntegrationDeployNode"
  };

  const functionType = typeMapping[type.type];

  if (!functionType) return;

  const targetName = type.type == "scriptNode" ? "targets" : "target";
  const sourceName = type.type == "scriptNode" ? "sources" : "source";

  const target = type.type == "scriptNode" ? [] : {};

  let customInput = null
  if (type.type == "fetchIntegrationNode"){
    customInput = {}
    customInput["host"] = "replace-host-string"
    customInput["method"] = "GET"
  }

  return {
    data: {
      function: functionType,
      [targetName]: target,
      [sourceName]: target,
      nodeType: 0,
      headerType: 0,
      inputData: type.name || customInput,
    },
    id: generateRandomString(),
    type: ntype[type.type],
    width: 108,
    height: 52,
    className: "apiNode Server",
    position: {
      x: 150,
      y: 30,
    },
    selected: false,
    positionAbsolute: {
      x: 150,
      y: 30,
    },
    dragging: false,
  };
};

export const generateRandomString = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};
