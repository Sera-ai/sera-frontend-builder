export const newNodeDefault = (type) => {
  const typeMapping = {
    integerNode: "integer",
    stringNode: "string",
    arrayNode: "array",
    scriptNode: "script",
  };

  const ntype = {
    integerNode: "functionNode",
    stringNode: "functionNode",
    arrayNode: "functionNode",
    scriptNode: "scriptNode",
  };

  const functionType = typeMapping[type];

  if (!functionType) return;

  const targetName = type == "scriptNode" ? "targets" : "target";
  const sourceName = type == "scriptNode" ? "sources" : "source";

  const target =
    type == "scriptNode"
      ? []
      : {};

  return {
    data: {
      function: functionType,
      [targetName]: target,
      [sourceName]: target,
      nodeType: 0,
      headerType: 0,
      inputData: null,
    },
    id: generateRandomString(),
    type: ntype[type],
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
