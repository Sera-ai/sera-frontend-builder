import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
import FlowComponent from "../fields/field.flow";
import ApiHeaderComponent from "../headers/header.api";
import TagComponent from "../headers/header.tag";

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
        <div style={{ marginTop: !collapsed ? -16 : null }}>
          <FlowComponent
            data={{
              target: {
                id: `flow-target-${node.id}-(${fieldItem.name})`,
                type: fieldItem.schema.type,
                title: fieldItem.name,
              },
              source: {
                id: `flow-source-${node.id}-(${fieldItem.name})`,
                type: fieldItem.schema.type,
                title: fieldItem.name,
              },
              nodeType: data.header.type,
            }}
          />
        </div>
      );
    });
  };

  const getCategories = () => {
    return properArray.map((field) => {
      const category = field;
      if (data[fieldKey][field].length == 0) return;
      return (
        <div>
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
            {category}
          </div>

          <div
            style={{
              paddingTop: toggleItems.includes(category) ? 5 : 0,
              paddingBottom: toggleItems.includes(category) ? 5 : 0,
              overflow: "hidden",
              maxHeight: toggleItems.includes(category) ? undefined : 0,
            }}
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
    <>
      <TagComponent
        data={data.headerType}
        color={getColor(data.header.method)}
      />
      <ApiHeaderComponent
        data={{
          method: data.header.method,
          host: data.header.host,
          path: data.header.path,
          color: getColor(data.header.method),
        }}
        handleData={{
          headerType: data.headerType,
          id: `flow-target-${node.id}-start`,
          type: null,
          title: null,
        }}
        changeToggle={changeToggle}
        toggleItems={toggleItems}
        properArray={properArray}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {data.headerType != 2 && data.headerType != 4 && (
          <>
            <FlowComponent
              top="maxi"
              data={{
                target: {
                  id: `flow-target-${node.id}-start`,
                  type: null,
                  title: "start",
                },
                source: {
                  id: `flow-source-${node.id}-end`,
                  type: null,
                  title: "Continue",
                },
                nodeType: data.header.type,
              }}
            />
            <div className="divider"></div>
          </>
        )}

        <div>
          <div
            className="nodeToggleHeader"
            onClick={() => {
              const isCategoryIncluded = toggleLogs.includes("logs");
              const newToggleItems = isCategoryIncluded
                ? toggleLogs.filter((item) => item !== "logs") // Remove category if it's already included
                : [...toggleLogs, "logs"]; // Add category using spread syntax for immutability
              toggleLog(newToggleItems);
            }}
            style={{ color: "#ffbcf4" }}
          >
            Logging
          </div>

          <div
            style={{
              overflow: "hidden",
              maxHeight: toggleLogs.includes("logs") ? undefined : 0,
            }}
          >
            <FlowComponent
              top="maxi"
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
            <div className="divider"></div>
            <FlowComponent
              top="maxi"
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
      </div>

      {getCategories()}

      <div
        style={{
          paddingTop: 1,
          paddingBottom: 1,
          textAlign: "center",
          fontSize: 7,
          borderTopWidth: 1,
          borderTopColor: "#141414",
          borderTopStyle: "solid",
          backgroundColor: "#ffffff30",
          cursor: "pointer",
        }}
      >
        Edit Endpoint
      </div>
    </>
  );
});
