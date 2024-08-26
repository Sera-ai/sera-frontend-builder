import React, { memo } from "react";
import integerLogo from "../../assets/icons/tabler_decimal.svg";
import stringLogo from "../../assets/icons/tabler_text-recognition.svg";
import arrayLogo from "../../assets/icons/tabler_brackets-contain.svg";
import booleanLogo from "../../assets/icons/radix-icons_component-boolean.png";
import { EventIcon, ToastIcon, ScriptIcon } from "../../../../../src/assets/assets.svg";
import { Handle, Position } from "reactflow";

export default memo(({ data, left = false, title = "", customIcon }) => {
  const apiLogo = {
    integerLogo: integerLogo,
    stringLogo: stringLogo,
    arrayLogo: arrayLogo,
    booleanLogo: booleanLogo,
    eventLogo: booleanLogo,
  };

  const headerText = (varfunction) => {
    switch (varfunction) {
      case "eventNode":
        return "Event Start";
      case "script":
        return title
      default:
        return data.title || varfunction;
    }
  };

  const getIcon = () => {
    switch (data.function) {
      case "eventNode":
        return <EventIcon size={"16"} />;
      case "toast":
        return <ToastIcon />;
      case "script":
        return <ScriptIcon size={"16"} />;
      default:
        return (
          <img
            style={{ height: 12 }}
            className="pl-2"
            src={apiLogo[data.function + "Logo"]}
          />
        );
    }
  };
  return (
    <div
      className={`nodeHeader ${data.function}BG`}
      style={{
        backgroundColor: `#ffffff10`,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: `#ffffff80`,
      }}
    >
      {left && (
        <div
          className="nodeHeaderHandle"
          style={{ borderColor: "#ffffff50", borderRightWidth: 1 }}
        >
          <Handle
            type="target"
            position={Position.Left}
            id={`sera.sera_start`}
            className={`ioHandle nullEdge`}
          />
        </div>
      )}
      {customIcon ? customIcon : getIcon()}
      <div className="functionTitle">{headerText(data.function)}</div>
      <div className="flex flex-grow" />
      {left == false && (
        <div
          className="nodeHeaderHandle"
          style={{ borderColor: "#ffffff50", borderLeftWidth: 1 }}
        >
          <Handle
            type="source"
            position={Position.Right}
            id={`sera_end`}
            className={`ioHandle nullEdge`}
          />
        </div>
      )}
    </div>
  );
});
