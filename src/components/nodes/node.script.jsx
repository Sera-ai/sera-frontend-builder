import React, { useState, memo, useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { getConnectedEdges } from "reactflow";

import FunctionHeaderComponent from "../headers/header.function";
import TagComponent from "../headers/header.tag";
import JsonViewerFull from "../../../../pages/subpages/issues/partials/Partials.Issues.JsonViewerFull";

import { socket } from "../../helpers/socket";

export default memo(({ data, id }) => {
  // Default states
  const [functionHeaderData, setFunctionHeaderData] = useState({
    function: data.function,
  });

  const [script, updateScript] = useState(data.inputData ?? defaultScript);
  const [lines, updateLines] = useState([
    data.targets.map((target, int) => {
      return int + 1;
    }),
  ]);
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
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
    newScript = newScript + data.inputData;
    updateScript(newScript);
  }, [data]);

  const defaultScript = `function customScript(){
    //write your code here


    //return your variables below
    return []
}`;

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
        <div className="flex max-w-[15px] flex-grow">
          <Handle
            type="target"
            position={Position.Left}
            id={"scriptHandle"}
            className={`scriptHandle anyEdge flex flex-grow`}
          />
        </div>
        <div className="flex flex-grow">
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
