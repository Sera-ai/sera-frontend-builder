import React, { memo } from "react";

export default memo(({ data, color, title = null }) => {
  if (data == 0 && title == null) {
    return null;
  } else {
    return (
      <div
        style={{ borderWidth: 1, borderStyle: "solid", borderColor: color }}
        className={`nodeTag ${tagData(data)}`}
      >
        <a>{title ? title : tagData(data)}</a>
      </div>
    );
  }
});

const tagData = (data) => {
  switch (data) {
    case 1:
      return "client";
    case 2:
      return "request";
    case 3:
      return "response";
    case 4:
      return "client";
  }
};
