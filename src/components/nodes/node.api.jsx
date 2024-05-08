import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
import FlowComponent from "../fields/field.flow";
import ApiHeaderComponent from "../headers/header.api";
import TagComponent from "../headers/header.tag";
import {
  BuilderIcon,
  CaratIcon,
  InventoryIcon,
} from "../../../../../src/assets/assets.svg";

export default memo((node) => {
  const data = node.data;
  const fieldKey =
    node.data.headerType == 1 || node.data.headerType == 3 ? "out" : "in";

  let properArray = Object.keys(data[fieldKey]);
  properArray.sort((a, b) => {
    // Ensure "Status Codes" always comes first
    if (a === "Status Codes") return -1;
    if (b === "Status Codes") return 1;

    // Ensure "header" comes after "Status Codes" but before other keys
    if (a === "header") return -1;
    if (b === "header") return 1;

    if (a === "headers") return -1;
    if (b === "headers") return 1;

    // Optional: Sort the rest of the array alphabetically
    return a.localeCompare(b);
  });

  const [toggleItems, changeToggle] = useState(properArray);
  const [toggleLogs, toggleLog] = useState([]);

  const FieldItems = ({ collapsed, fieldData }) => {
    return fieldData.map((fieldItem, int) => {
      return (
        <FlowComponent
          data={{
            target: {
              id: fieldItem.name,
              type: fieldItem.schema.type,
              title: fieldItem.name,
            },
            source: {
              id: fieldItem.name,
              type: fieldItem.schema.type,
              title: fieldItem.name,
            },
            nodeType: data.header.type,
          }}
        />
      );
    });
  };

  const getCategories = () => {
    return properArray.map((field) => {
      const category = field;
      if (data[fieldKey][field].length == 0) return;
      return (
        <div
          className="nodeContentParent"
          style={{ maxHeight: toggleItems.includes(category) ? undefined : 24 }}
        >
          <div
            className="nodeToggleHeader"
            onClick={() => {
              const isCategoryIncluded = toggleItems.includes(category);
              const newToggleItems = isCategoryIncluded
                ? toggleItems.filter((item) => item !== category) // Remove category if it's already included
                : [...toggleItems, category]; // Add category using spread syntax for immutability
              changeToggle(newToggleItems);
            }}
          >
            <CaratIcon open={toggleItems.includes(category)} />
            {category}
            <div style={{ color: "#ffffff70", flex: 1 }}></div>
            {!toggleItems.includes(category) && (
              <div className="nodeHeaderHandle noBG handleRight">
                {<BuilderIcon size="12" color="#ffffff80" />}
              </div>
            )}
          </div>

          <div
            className={`flowComponentHolder ${toggleItems.includes(category) ? "" : "nodeStackedItems"}`}
          >
            {data && (
              <FieldItems
                collapsed={toggleItems.includes(category)}
                fieldData={data[fieldKey][field]}
              />
            )}
          </div>
        </div>
      );
    });
  };

  const getColor = (type) => {
    switch (type) {
      case "GET":
        return "#2bb74a";
      case "POST":
        return "#FF7A00";
    }
  };

  return (
    <div className="nodeContainer">
      <ApiHeaderComponent
        data={{
          method: data.header.method,
          host: data.header.host,
          path: data.header.path,
          color: getColor(data.header.method),
        }}
        handleData={{
          target: {
            id: `sera_start`,
            type: null,
            title: "start",
          },
          source: {
            id: `sera_end`,
            type: null,
            title: "Continue",
          },
          headerType: data.headerType,
        }}
        toggleItems={toggleItems}
        properArray={properArray}
      />

      {/*<img
            onClick={() => {
              toggleItems.length == 0
                ? changeToggle(properArray)
                : changeToggle([]);
            }}
            style={{ height: 11, cursor: "pointer" }}
            src={toggleItems.length != 0 ? remove : add}
          />*/}

      <div className="nodeContentContainer">
        <div
          className="nodeContentParent"
          style={{ maxHeight: toggleLogs.includes("logs") ? undefined : 24 }}
        >
          <div
            className="nodeToggleHeader"
            onClick={() => {
              const isCategoryIncluded = toggleLogs.includes("logs");
              const newToggleItems = isCategoryIncluded
                ? toggleLogs.filter((item) => item !== "logs") // Remove category if it's already included
                : [...toggleLogs, "logs"]; // Add category using spread syntax for immutability
              toggleLog(newToggleItems);
            }}
            style={{
              color: "#ffbcf4",
            }}
          >
            <CaratIcon open={toggleLogs.includes("logs")} />
            Logging
          </div>

          <div
            className="flowComponentHolder"
            style={{
              overflow: "hidden",
              maxHeight: toggleLogs.includes("logs") ? undefined : 0,
              position: toggleLogs.includes("logs") ? "initial" : "absolute",
            }}
          >
            <FlowComponent
              data={{
                target: {
                  id: `log-flow-target-${node.id}`,
                  type: "log",
                  title: "Success",
                },
                source: {
                  id: `log-flow-source-${node.id}`,
                  type: "log",
                  title: "Success",
                },
                nodeType: 0,
              }}
            />
            <FlowComponent
              data={{
                target: {
                  id: `log-flow-target-${node.id}`,
                  type: "log",
                  title: "Failure",
                },
                source: {
                  id: `log-flow-source-${node.id}`,
                  type: "log",
                  title: "Failure",
                },
                nodeType: 0,
              }}
            />
          </div>
        </div>

        {getCategories()}
      </div>
    </div>
  );
});
