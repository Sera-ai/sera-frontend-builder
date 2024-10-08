import React, { useState, memo } from "react";

import FunctionHeaderComponent from "../headers/header.function";
import TagComponent from "../headers/header.tag";
import InputFieldComponent from "../fields/field.input";

export default memo((node) => {
  // Default states
  return (
    <div className={`apiNode`}>
      <TagComponent data={0} />
      <FunctionHeaderComponent
        left={null}
        data={{ function: "event", title: "Create Event" }}
      />
      <InputFieldComponent
        data={node.data}
        left
        node={node}
        id={node.id}
        placeholder={"Event Name"}
      />
    </div>
  );
});
