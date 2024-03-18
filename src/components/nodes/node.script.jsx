import React, { useState, memo, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { getConnectedEdges } from "reactflow";

import FunctionHeaderComponent from "../headers/header.function";
import TagComponent from "../headers/header.tag";
import JsonViewerFull from "../../../../../src/pages/subpages/events/partials/Partials.Events.JsonViewerFull";

import { socket } from "../../helpers/socket";

export default memo(({ data, id }) => {
  // Default states
  const [functionHeaderData, setFunctionHeaderData] = useState({
    function: data.function,
  });
  const defaultScript = `function customScript(){
    //write your code here


    //return your variables below
    return []
}`;
  const initVar =
    data?.targets?.length > 0
      ? "//Connect nodes to create variables\n" + data.targets.join("\n")
      : "//Connect nodes to create variables";

  const [script, updateScript] = useState(
    data.inputData == null ||
      data.inputData == undefined ||
      data.inputData == ""
      ? defaultScript
      : data.inputData
  );
  const [variables, updateVariables] = useState(initVar);
  const [lines, updateLines] = useState([
    data.targets.map((target, int) => {
      return int + 1;
    }),
  ]);

  console.log(script);
  console.log(variables);

  useEffect(() => {
    if (data?.targets?.length > 0) {
      console.log([
        data.targets.map((target, int) => {
          return int + 1;
        }),
      ]);
      console.log("change");
      console.log(data);
      const targets = [];
      let newScript = ``;
      data.targets.map((target) => {
        if (!targets.includes(target)) {
          newScript =
            newScript +
            `let ${target}
`;
          targets.push(target);
        }
      });
      updateVariables(newScript);
    }
  }, [data.targets]);

  useEffect(() => {
    if (data.inputData != script && data.inputData != null) {
      updateScript(data.inputData);
    }
  }, [data.inputData]);

  const dynamicHandlesLeft = () => {
    return data?.targets?.map((target) => {
      return (
        <Handle
          type="target"
          position={Position.Left}
          id={target}
          className={`ioHandle anyEdge`}
        />
      );
    });
  };

  const updateField = (newData) => {
    socket.emit("updateField", {
      id: id,
      data: newData,
      field: "data.inputData",
    });
  };

  return (
    <div className="scriptNode flex flex-col">
      <TagComponent data={0} />
      <FunctionHeaderComponent data={functionHeaderData} />
      <div className="flex flex-grow flex-row">
        <div className="flex max-w-[15px]">
          <Handle
            type="target"
            position={Position.Left}
            id={"scriptHandle"}
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
      </div>
    </div>
  );
});
