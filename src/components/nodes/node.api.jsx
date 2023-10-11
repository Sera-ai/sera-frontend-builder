import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

//<input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
import FlowComponent from '../fields/field.flow';
import ApiHeaderComponent from '../headers/header.api';
import TagComponent from '../headers/header.tag';

export default memo((node) => {
  const data = node.data
  console.log(node)

  const fieldKey = node.data.headerType == 1 || node.data.headerType == 3 ? "out" : "in"


  const FieldItems = () => {
    console.log("data", data)
    if (!data) return
    return Object.keys(data.fields[fieldKey]).map((fieldName) => {
      if (!fieldName.includes("__")) {
        const field = data.fields[fieldKey][fieldName]
        return (<FlowComponent
          data={{
            target: { id: `flow-target-${node.id}-${fieldName}`, type: field.type, title: fieldName },
            source: { id: `flow-source-${node.id}-${fieldName}`, type: field.type, title: fieldName },
            nodeType: data.header.type,
          }} />)
      }
    })
  }

  const getColor = (type) => {
    switch (type) {
      case "GET": return "#2bb74a";
      case "POST": return "#FF7A00";
    }
  }

  return (
    <>
      <TagComponent data={data.headerType} color={getColor(data.header.method)} />
      <ApiHeaderComponent
        data={{
          method: data.header.method,
          host: data.header.host,
          path: data.header.path,
          color: getColor(data.header.method)
        }} />


      <div style={{ marginBottom: 10, paddingRight: 5, paddingLeft: 5 }}>
        <FlowComponent
          data={{
            target: { id: `flow-target-${node.id}-start`, type: null, title: "start" },
            source: { id: `flow-source-${node.id}-end`, type: null, title: "end" },
            nodeType: data.header.type,
          }} />

        {(data.headerType == 3 || data.headerType == 1) && false && (
          <FlowComponent
            data={{
              target: { id: `fail-flow-target-${node.id}`, type: null, title: "Failure" },
              source: { id: `fail-flow-source-${node.id}`, type: null, title: "Failure" },
              nodeType: data.header.type,
            }} />
        )}


      </div>

      {
        (
          <div>
            <div style={{
              paddingTop: 2,
              paddingBottom: 4,
              paddingLeft: 5,
              paddingRight: 5,
              fontSize: 8,
              borderTopWidth: 1,
              borderTopColor: "#ffffff20",
              borderTopStyle: "solid",
              backgroundColor: "#ffffff10"
            }}>
              Variables
            </div>

            <div style={{ padding: 5 }} className="outTable">
              {data
               && <FieldItems />}
            </div>
          </div>
        )
      }

      <div style={{
        paddingTop: 1,
        paddingBottom: 1,
        textAlign: "center",
        fontSize: 7,
        borderTopWidth: 1,
        borderTopColor: "#141414",
        borderTopStyle: "solid",
        backgroundColor: "#ffffff10",
        cursor: "pointer"
      }}>
        + Add Undefined Variable
      </div>

    </>
  );
});
