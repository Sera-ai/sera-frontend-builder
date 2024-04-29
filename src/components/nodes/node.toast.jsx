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
        left={true}
        data={{ function: "toast", title: "Create Toast" }}
      />
      <div className="p-1 pl-2" style={{ fontSize: 10 }}>
        Creates a toast notification
      </div>
    </div>
  );
});
