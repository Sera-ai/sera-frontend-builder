import React, { memo } from "react";
import integerLogo from "../../assets/icons/tabler_decimal.svg";
import stringLogo from "../../assets/icons/tabler_text-recognition.svg";
import arrayLogo from "../../assets/icons/tabler_brackets-contain.svg";
import booleanLogo from "../../assets/icons/radix-icons_component-boolean.png";
import { EventIcon, ToastIcon } from "../../../../../src/assets/assets.svg";
import { Handle, Position } from "reactflow";

export default memo(({ data, left = false }) => {
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
      default:
        return (
          <img style={{ height: 16 }} src={apiLogo[data.function + "Logo"]} />
        );
    }
  };
  return (
    <div className={`nodeHeader ${data.function}BG`}>
      <div className="nodeHeaderDetails">
        {left && (
          <Handle
            type="target"
            position={Position.Left}
            id={`sera_start`}
            className={`ioHandle nullEdge`}
          />
        )}
        {getIcon()}
        <div className="functionTitle">{headerText(data.function)}</div>
        <div className="flex flex-grow" />
        {left == false && (
          <Handle
            type="source"
            position={Position.Right}
            id={`sera_end`}
            className={`ioHandle nullEdge`}
          />
        )}
      </div>
    </div>
  );
});
