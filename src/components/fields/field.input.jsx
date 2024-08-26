import React, { memo, useState } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
import { socket } from "../../helpers/socket";

export default memo(
  ({
    data,
    node,
    id,
    placeholder = "Input",
    left = false,
    noFlow = false,
    disabled = false,
    nodeDataField = null,
    textChangeCallback = () => {},
  }) => {
    const [inputFieldData, setInputFieldData] = useState({
      target: data.target ?? { id: null, type: null, title: null },
      source: data.source ?? { id: null, type: null, title: null },
      nodeType: data.nodeType ?? "flow",
      inputData: data.inputData ?? null,
    });

    let newDataSpecific;
    if (nodeDataField) {
      newDataSpecific = {};
    }

    const updateNodeInternals = useUpdateNodeInternals();

    const updateField = (newData) => {
      let existingData = data;
      let inputField = inputFieldData;

      if (nodeDataField) newDataSpecific[nodeDataField] = newData;
      if (!nodeDataField) newDataSpecific = newData;

      existingData.inputData = nodeDataField;
      inputField.inputData = existingData.inputData;

      setInputFieldData(inputField);
      updateNodeInternals(id, { data: existingData });
      console.log("node", node)
      socket.wsEmit("updateField", {
        id: id,
        data: newData,
        node: node,
        field: "data.inputData" + (nodeDataField ? `.${nodeDataField}` : "")
      });
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
          defaultValue={
            nodeDataField
              ? inputFieldData.inputData?.[nodeDataField]
              : inputFieldData.inputData
          }
          disabled={disabled}
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
    return (
      <div className="nodeHeaderContentDetailsTag nodeContentField">
        {!noFlow && left && (
          <div className={`nodeHeaderHandle handleLeft`}>
            <LeftHandle />
          </div>
        )}
        {data.nodeType == 0 && <NodeFieldTitle node={data.target} />}

        <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}></div>

        {(data.nodeType == 1 || data.nodeType == 0) && !noFlow && !left && (
          <div className={`nodeHeaderHandle handleRight`}>
            <RightHandle />
          </div>
        )}
      </div>
    );
  }
);
