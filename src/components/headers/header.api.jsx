import React, { memo } from "react";
import apiLogo from "../../assets/icons/ph_link-bold.png";
import add from "../../assets/icons/add.png";
import remove from "../../assets/icons/remove.png";
import { Handle, Position } from "reactflow";

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />

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
      <div>
        <div style={{ backgroundColor: data.color }} className={`nodeHeader`}>
          <div className="nodeHeaderDetails">
            {handleData.headerType != 1 && handleData.headerType != 3 && (
              <Handle
                type="target"
                position={Position.Left}
                id={handleData.id}
                className={`ioHandle nullEdge`}
              />
            )}

            <div style={{ fontWeight: "400" }}>{data.host}</div>
            <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}></div>
            <img
              onClick={() => {
                toggleItems.length == 0
                  ? changeToggle(properArray)
                  : changeToggle([]);
              }}
              style={{ height: 11, cursor: "pointer" }}
              src={toggleItems.length != 0 ? remove : add}
            />
          </div>
        </div>
        <div className="nodeHeaderContent">
          <div className="nodeHeaderContentDetails">
            <div style={{ fontSize: 8, color: "#ffffff70" }}>
              {data.path.replace(/\//g, " / ")}
            </div>
            <img style={{ height: 8 }} src={apiLogo} />
          </div>
        </div>
      </div>
    );
  }
);
