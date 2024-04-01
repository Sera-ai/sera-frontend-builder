import React, { useState, memo } from "react";
import { Handle, Position } from "reactflow";

import FunctionHeaderComponent from "../headers/header.function";
import TagComponent from "../headers/header.tag";
import InputFieldComponent from "../fields/field.input";

export default memo((node) => {
  // Default states
  console.log("node function", node);
  const [functionHeaderData, setFunctionHeaderData] = useState({
    function: node.data.function,
  });

  console.log("node", node);

  return (
    <div className={`apiNode`}>
      <TagComponent data={0} />
      <FunctionHeaderComponent data={{ function: "boolean", title: "Create Eevent" }} />
      <div className="p-1">
        <table className="outTable ">
          <tbody>
            <InputFieldComponent
              data={node.data}
              left
              node={node}
              id={node.id}
              placeholder={"Event Name"}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
});
