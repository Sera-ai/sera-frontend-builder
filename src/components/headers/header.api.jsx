import React, { memo } from "react";
import apiLogo from "../../assets/icons/ph_link-bold.png";
import add from "../../assets/icons/add.png";
import remove from "../../assets/icons/remove.png";
import { Handle, Position } from "reactflow";
import {
  BuilderIcon,
  InventoryIcon,
} from "../../../../../src/assets/assets.svg";

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />

const urlText = (type) => {
  switch (type) {
    case 1:
      return "(Client)";
    case 2:
      return "(Server)";
    case 3:
      return "(Server)";
    case 4:
      return "(Client)";
  }
};

export default memo(
  ({
    data,
    handleData,
    isConnectable,
    toggleItems,
    changeToggle,
    properArray,
  }) => {
    return (
      <>
        <div
          style={{
            backgroundColor: `${data.color[0]}`,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: `${data.color[1]}`,
          }}
          className={`nodeHeader`}
        >
          {handleData.headerType != 1 && handleData.headerType != 3 && (
            <div
              className="nodeHeaderHandle"
              style={{ borderColor: data.color[1], borderRightWidth: 1 }}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={handleData.target.id}
                className={`ioHandle nullEdge`}
              />
            </div>
          )}

          <div style={{ fontWeight: "400" }} className="pl-2">
            {data.host} {urlText(handleData.headerType)}
          </div>
          <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}></div>

          {handleData.headerType != 2 && handleData.headerType != 4 && (
            <div
              className="nodeHeaderHandle"
              style={{ borderColor: data.color[1], borderLeftWidth: 1 }}
            >
              <Handle
                type="source"
                position={Position.Right}
                id={handleData.source.id}
                className={`ioHandle nullEdge`}
              />
            </div>
          )}
        </div>
        <div className="nodeHeaderContent">
          <div className="nodeFieldText">{data.path.replace(/\//g, " / ")}</div>
          <div style={{ color: "#ffffff70", flex: 1 }}></div>
          <div className="nodeHeaderHandle noBG handleRight">
            {<InventoryIcon size="12" color="#3076FF" />}
          </div>
        </div>
      </>
    );
  }
);
