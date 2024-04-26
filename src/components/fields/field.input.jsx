import React, { memo, useState } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
import { socket } from "../../helpers/socket";

export default memo(
  ({ data, node, id, placeholder = "Input", left = false }) => {
    console.log("id", id);
    const [inputFieldData, setInputFieldData] = useState({
      target: data.target ?? { id: null, type: null, title: null },
      source: data.source ?? { id: null, type: null, title: null },
      nodeType: data.nodeType ?? "flow",
      inputData: data.inputData ?? null,
    });

    console.log("data", node);

    const updateNodeInternals = useUpdateNodeInternals();

    const updateField = (newData) => {
      console.log("updateField", id);
      let dataUpdate = data;
      dataUpdate.inputData = newData;
      let updateData = inputFieldData;
      updateData.inputData = dataUpdate.inputData;
      setInputFieldData(updateData);
      console.log("dataUpdate", dataUpdate.inputData);
      updateNodeInternals(id, { data: dataUpdate });
      socket.emit("updateField", { id: id, value: newData, node: node });
    };

    const NodeFieldTitle = () => {
      return (
        <input
          id={`inputfor-${id}`}
          onChange={(e) => updateField(e.target.value)}
          onClickCapture={(e) => e.preventDefault()}
          onClick={(e) => e.preventDefault()}
          className="inlineTextBox"
          type={data.function == "string" ? "text" : "integer"}
          placeholder={placeholder}
          defaultValue={inputFieldData.inputData}
        />
      );
    };

    const LeftHandle = () => {
      return (
        <Handle
          type="target"
          position={Position.Left}
          id={
            "seraFunction" +
            data.function.replace(/^./, (str) => str.toUpperCase())
          }
          className={`ioHandle anyEdge`}
        />
      );
    };

    const RightHandle = () => {
      return (
        <Handle
          type="source"
          position={Position.Right}
          id={
            "seraFunction" +
            data.function.replace(/^./, (str) => str.toUpperCase())
          }
          className={`ioHandle ${data.function}Edge`}
        />
      );
    };

    <tr>
      <td>
        {(data.nodeType == 1 || data.nodeType == 2) && <LeftHandle />}
        {data.nodeType == 0 && <NodeFieldTitle node={data.source} />}
      </td>
      <td className={(data.nodeType == 1 || data.nodeType == 0) && "endHandle"}>
        {(data.nodeType == 1 || data.nodeType == 0) && <RightHandle />}
        {data.nodeType == 2 && <NodeFieldTitle node={data.target} />}
      </td>
    </tr>;

    return (
      <div className="nodeHeaderContentDetails">
        {left && <LeftHandle />}
        {data.nodeType == 0 && <NodeFieldTitle node={data.target} />}

        <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}></div>

        {(data.nodeType == 1 || data.nodeType == 0) && !left && <RightHandle />}
      </div>
    );
  }
);
