import React, { memo } from "react";
import { Handle, Position } from "reactflow";

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />

export default memo(({ data, top = ""}) => {
  const LeftHandle = () => {
    return (
      <Handle
        type="target"
        position={Position.Left}
        id={data.target.id}
        className={`ioHandle ${data.target.type}Edge`}
      />
    );
  };

  const RightHandle = () => {
    return (
      <Handle
        type="source"
        position={Position.Right}
        id={data.source.id}
        className={`ioHandle ${data.source.type}Edge`}
      />
    );
  };

  return (
    <div className={`nodeHeaderContentDetailsTag ${top}`}>
      {(data.nodeType == 1 || data.nodeType == 2) && <LeftHandle />}
      {data.nodeType == 2 && (
        <div style={{ fontSize: 10, color: "#fff" }}>{data.source.title}</div>
      )}

      <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}></div>

      {data.nodeType == 0 && (
        <div style={{ fontSize: 10, color: "#fff" }}>{data.target.title}</div>
      )}
      {(data.nodeType == 1 || data.nodeType == 0) && <RightHandle />}
    </div>
  );
});
