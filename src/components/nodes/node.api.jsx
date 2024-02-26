import React, { memo, useState } from "react";
import { Handle, Position } from "reactflow";

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
import FlowComponent from "../fields/field.flow";
import ApiHeaderComponent from "../headers/header.api";
import TagComponent from "../headers/header.tag";

export default memo((node) => {
  const [showHeader, setShowHeader] = useState(true);
  const [showParameters, setShowParameters] = useState(true);

  const data = node.data;

  const fieldKey =
    node.data.headerType == 1 || node.data.headerType == 3 ? "out" : "in";

  const FieldItems = ({ collapsed, fieldData }) => {
    console.log("data", data);
    if (!data) return;
    return Object.keys(data.fields[fieldKey]).map((fieldName, int) => {
      if (!fieldName.includes("__")) {
        const field = data.fields[fieldKey][fieldName];
        return (
          <div style={{ marginTop: !collapsed ? -16 : null }}>
            <FlowComponent
              data={{
                target: {
                  id: `flow-target-${node.id}-${fieldName}`,
                  type: field.type,
                  title: fieldName,
                },
                source: {
                  id: `flow-source-${node.id}-${fieldName}`,
                  type: field.type,
                  title: fieldName,
                },
                nodeType: data.header.type,
              }}
            />
          </div>
        );
      }
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
      />
      {data.headerType != 2 && data.headerType != 4 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FlowComponent
            top="maxi"
            data={{
              target: {
                id: `flow-target-${node.id}-start`,
                type: null,
                title: "Success",
              },
              source: {
                id: `flow-source-${node.id}-end`,
                type: null,
                title: "end",
              },
              nodeType: data.header.type,
            }}
          />
          <div className="divider"></div>
          <FlowComponent
            top="maxi"
            data={{
              target: {
                id: `fail-flow-target-${node.id}`,
                type: null,
                title: "Failure",
              },
              source: {
                id: `fail-flow-source-${node.id}`,
                type: null,
                title: "Failure",
              },
              nodeType: data.header.type,
            }}
          />
        </div>
      )}

      {
        <>
          <div>
            <div
              style={{
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 5,
                fontSize: 8,
                backgroundColor: "#ffffff10",
              }}
              onClick={() => setShowHeader(!showHeader)}
            >
              Request Headers
            </div>

            <div
              style={{
                paddingTop: showHeader ? 5 : 0,
                paddingBottom: showHeader ? 5 : 0,
                overflow: "hidden",
                maxHeight: showHeader ? undefined : 0,
              }}
            >
              {data && <FieldItems collapsed={showHeader} fieldData={data}/>}
            </div>
          </div>
        </>
      }
      {
        <>
          <div>
            <div
              style={{
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 5,
                fontSize: 8,
                backgroundColor: "#ffffff10",
              }}
              onClick={() => setShowParameters(!showParameters)}
            >
              Parameters
            </div>

            <div
              style={{
                paddingTop: showParameters ? 5 : 0,
                paddingBottom: showParameters ? 5 : 0,
                overflow: "hidden",
                maxHeight: showParameters ? undefined : 0,
              }}
            >
              {data && <FieldItems collapsed={showParameters} fieldData={data}/>}
            </div>
          </div>
        </>
      }

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
