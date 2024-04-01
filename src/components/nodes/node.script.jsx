import React, { useState, memo, useEffect, useMemo } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { getConnectedEdges } from "reactflow";
import FieldFlow from "../fields/field.flow";

import FunctionHeaderComponent from "../headers/header.function";
import TagComponent from "../headers/header.tag";
import JsonViewerFull from "../../../../../src/pages/subpages/events/partials/Partials.Events.JsonViewerFull";

import { socket } from "../../helpers/socket";
import { useAppContext } from "../../AppContext";

export default memo(({ data, id }) => {
  // Default states
  const updateNodeInternals = useUpdateNodeInternals();

  const [functionHeaderData, setFunctionHeaderData] = useState({
    function: data.function,
  });
  const { edges } = useAppContext();
  const defaultScript = `function main(){\n//write your code here\n\n//return your variables below\nreturn []\n}\n\n//execute the script\nmain();`;

  const [script, updateScript] = useState(
    data.inputData == null ||
      data.inputData == undefined ||
      data.inputData == ""
      ? defaultScript
      : data.inputData
  );
  const [variables, updateVariables] = useState(
    "//Connect nodes to create variables"
  );
  const [outParam, setOutParams] = useState([]);

  const [lines, updateLines] = useState([
    data.targets.map((target, int) => {
      return int + 1;
    }),
  ]);

  useEffect(() => {
    const ReleventEdges2 = edges.filter(
      (edge) => edge.targetHandle == `flow-target-${id}-scriptAccept`
    );

    let newScript2 = `//Connect nodes to create variables\n`;

    ReleventEdges2.map((edge) => {
      newScript2 = newScript2 + `let ${normalizeVarName(edge.sourceHandle)}\n`;
    });
    updateVariables(newScript2);

    //React flow bug, when dynamically placing the handles the listener event doesn't trigger but with a no delay timeout it works...
    setTimeout(() => {
      setOutParams(parseReturnStatement(script));
      updateNodeInternals(id);
    }, 0);
  }, []);

  useEffect(() => {
    const ReleventEdges = edges.filter(
      (edge) => edge.targetHandle == `flow-target-${id}-scriptAccept`
    );

    let newScript = `//Connect nodes to create variables\n`;
    ReleventEdges.map((edge) => {
      newScript = newScript + `let ${normalizeVarName(edge.sourceHandle)}\n`;
    });

    updateVariables(newScript);
  }, [edges]);

  useEffect(() => {
    if (data.inputData != script && data.inputData != null) {
      updateScript(data.inputData);
      setOutParams(parseReturnStatement(data.inputData));
      updateNodeInternals(id);
    }
  }, [data.inputData]);

  const updateField = (newData) => {
    setOutParams(parseReturnStatement(newData));
    updateNodeInternals(id);

    socket.emit("updateField", {
      id: id,
      data: newData,
      field: "data.inputData",
    });
  };

  const targetHandles = useMemo(
    () =>
      outParam.map((param, index) => {
        return (
          <div key={index} className={`nodeHeaderContentDetailsTag ${"maxi"}`}>
            <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}></div>

            <div style={{ fontSize: 10, color: "#fff" }}>{param}</div>
            <Handle
              type="source"
              position={Position.Right}
              id={`flow-source-${id}-${param}`}
              className={`anyEdge ioHandle`}
            />
          </div>
        );
      }),
    [outParam]
  );

  return (
    <div className="scriptNode flex flex-col">
      <FunctionHeaderComponent
        id={id}
        data={functionHeaderData}
        fullFlow={true}
        left={true}
      />
      <div className="flex flex-grow flex-row">
        <div className="flex w-[15px]">
          <Handle
            type="target"
            position={Position.Left}
            id={`flow-target-${id}-scriptAccept`}
            className={`scriptHandle anyEdge flex flex-grow`}
          />
        </div>
        <div className="flex-grow">
          <JsonViewerFull
            oas={variables}
            main={true}
            height={100}
            editable={false}
          />
          <JsonViewerFull
            oas={script}
            main={true}
            lines={lines}
            updateField={updateField}
          />
        </div>
        <div className="flex flex-col" key={outParam.join("-")}>
          <>
            <FieldFlow
              top="maxi"
              data={{
                target: {
                  id: `flow-target-${id}-start`,
                  type: null,
                  title: "Start",
                },
                source: {
                  id: `flow-source-${id}-continue`,
                  type: null,
                  title: "Continue",
                },
                nodeType: 0,
              }}
            />
            <FieldFlow
              top="maxi"
              data={{
                target: {
                  id: `flow-target-${id}-start`,
                  type: null,
                  title: "start",
                },
                source: {
                  id: `flow-source-${id}-reject`,
                  type: null,
                  title: "Failure",
                },
                nodeType: 0,
              }}
            />
            <div className="divider"></div>
          </>
          {targetHandles}
        </div>
      </div>
    </div>
  );
});

function normalizeVarName(name) {
  // Replace invalid characters with underscores and remove parentheses
  let normalized = name.replace(/-/g, "_").replace(/[()]/g, "");

  // Ensure the name starts with a valid character
  if (!/^[a-zA-Z_$]/.test(normalized[0])) {
    normalized = "_" + normalized;
  }

  // Replace any sequence of characters that are not letters, numbers, or underscores with an underscore
  normalized = normalized.replace(/[^a-zA-Z0-9_$]/g, "_");

  return normalized;
}

function parseReturnStatement(code) {
  // Extract the last return statement from the main function
  const returnPattern =
    /function main\(\) \{[\s\S]*return \[([^\]]*)\];?[\s\S]*\}/;
  const match = code.match(returnPattern);
  if (!match) return [];

  // Extract elements from the return statement
  const returnContents = match[1];
  const elementsPattern = /"([^"]*)"|'([^']*)'|([a-zA-Z_]\w*)|(\d+(\.\d+)?)/g;
  let elementsMatch;
  const elements = [];

  while ((elementsMatch = elementsPattern.exec(returnContents)) !== null) {
    // Add the matched string, number, or variable name to the elements array
    const element =
      elementsMatch[1] ||
      elementsMatch[2] ||
      elementsMatch[3] ||
      elementsMatch[4];
    elements.push(element);
  }

  return elements;
}
