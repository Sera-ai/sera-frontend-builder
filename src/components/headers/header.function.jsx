import React, { memo } from "react";
import integerLogo from "../../assets/icons/tabler_decimal.svg";
import stringLogo from "../../assets/icons/tabler_text-recognition.svg";
import arrayLogo from "../../assets/icons/tabler_brackets-contain.svg";
import booleanLogo from "../../assets/icons/radix-icons_component-boolean.png";
import { EventIcon } from "../../../../../src/assets/assets.svg";

export default memo(({ data, name = null, isConnectable }) => {
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
        return varfunction;
    }
  };
  return (
    <div className={`nodeHeader ${data.function}BG`}>
      <div>
        <div className="nodeHeaderDetails">
          {data.function ? <EventIcon size={"16"}/> : <img style={{ height: 16 }} src={apiLogo[data.function + "Logo"]} />}
          <div className="functionTitle">{headerText(data.function)}</div>
        </div>
      </div>
    </div>
  );
});
