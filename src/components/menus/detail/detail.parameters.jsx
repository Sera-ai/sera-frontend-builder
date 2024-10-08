import React, { memo, useState } from "react";
import circlesLogo from "../../../assets/icons/tabler_circles.svg";
import chevronDown from "../../../assets/icons/tabler_chevron-down.svg";
import { useAppContext } from "../../../AppContext";
import { socketEvents } from "../../../events/events.socket";

export default memo(({ nodeDetails, nodes, edges }) => {
  //grab entrypoint id
  const nodeId = nodeDetails.id;
  const GetParams = ({ input }) => {
    console.log("nd", nodeDetails.data[input]);
    const fields = flattenObject(nodeDetails.data[input]) ?? [];
    console.log("fields", fields);

    const returnables =
      fields.map((field) => {
        const step2 = nodes
          .filter((node) => node.id !== nodeId)
          .flatMap((node) => {
            const nodeObj = node.data[input === "in" ? "out" : "in"] ?? {};
            const relevantFields = flattenObject(nodeObj) ?? [];
            return relevantFields
              .filter((field2) => field2.schema.type === field.schema.type)
              .map((field2) => {
                return {
                  name: field2.name,
                  type: field.schema.type,
                  id: node.id,
                };
              });
          });

        return (
          <Detail
            field={field}
            options={step2}
            edges={edges}
            nodeId={nodeId}
            input={input}
            nodeDetails={nodeDetails}
          />
        );
      }) ?? [];

    return returnables.length > 0 ? returnables : <EmptyDetail data={"None"} />;
  };

  return (
    <div className="detailsMenuComponent">
      <div className="detailsOverview">
        <div className="functionText">
          <div className="nodeTitle">Input Parameters</div>
          <div className="nodeSubtitle">Inputs to Block</div>
        </div>
        <GetParams input={"in"} />
      </div>
      <div className="detailsOverview">
        <div className="functionText">
          <div className="nodeTitle">Output Parameters</div>
          <div className="nodeSubtitle">Outputs to Block</div>
        </div>
        <GetParams input={"out"} />
      </div>
    </div>
  );
});

function getHex(type) {
  switch (type) {
    case "integer":
      return "#a456e5";
    case "number":
      return "#a456e5";
    case "flow":
      return "#ffffff";
    case "string":
      return "#2bb74a";
    default:
      return "#ffffff80";
  }
}

const Detail = ({ field, options = [], edges, nodeId, input, nodeDetails }) => {
  const type = field ? field.schema.type : null;
  const isInput = input == "in" ? "target" : "source";
  const isntInput = input == "in" ? "source" : "target";
  const socketEventClass = socketEvents({
    ...useAppContext(),
    _source: "detail",
  });

  const edges2 = edges.filter(
    (edge) =>
      edge[isInput] === nodeId &&
      (edge.sourceHandle.includes(field.name) ||
        edge.targetHandle.includes(field.name))
  );

  const edge = edges2[0];

  console.log(field.name, edge);
  console.log(field.name, edges2);

  return (
    <div className={`detailParameterBox`}>
      <GetImage hex={getHex(type)} />
      <div className="detailParameterFrame">
        <div className="detailFont">
          <span style={{ color: getHex(type) }}>{field.name} (</span>
          {type ?? "None"}
          <span style={{ color: getHex(type) }}>)</span>
        </div>
        <div className="detailDropdown">
          <select
            className="detailFont detailFontCase"
            value={
              edge ? `${edge.sourceHandle}-${type}-${edge[isntInput]}` : "none"
            }
            disabled={type == null}
            onChange={(e) =>
              changeData({
                e,
                handleConnectChange: socketEventClass.handleConnectChange,
                nodeId,
                input,
                edge,
                fieldName: field.name,
                hex: getHex(type),
              })
            }
          >
            <GetOptions data={[...options, { name: "none" }]} edges={edges} />
          </select>
        </div>
      </div>
    </div>
  );
};

const GetOptions = ({ data }) => {
  return data.map((d) => {
    return (
      <option
        className="dropdownOption"
        value={d.name == "none" ? "none" : `${d.name}-${d.type}-${d.id}`}
      >
        {d.name == "none" ? "Not Connected" : `${d.name} (${d.type}) [${d.id}]`}
      </option>
    );
  });
};

const changeData = ({
  e,
  handleConnectChange,
  nodeId,
  input,
  edge,
  fieldName,
  hex,
}) => {
  if (e.target.value != "none") {
    console.log(e.target.value);
    console.log(edge);
    const targetData = e.target.value.split("-");

    const lastElement = targetData.splice(-1, 1)[0];
    const secondOfLast = targetData.splice(-1, 1)[0]; // splice returns an array of removed elements
    const dropDownFieldName = targetData.join("-");

    console.log(lastElement);

    const source = input == "in" ? lastElement : nodeId;
    const sourceHandle = input == "in" ? dropDownFieldName : fieldName;
    const target = input == "in" ? nodeId : lastElement;
    const targetHandle = input == "in" ? fieldName : dropDownFieldName;

    let updateEdge = {};
    if (edge) updateEdge = edge;
    if (edge) updateEdge.id = edge.id;
    if (!edge) updateEdge.animated = false;
    if (!edge) updateEdge.style = { stroke: hex };
    updateEdge.source = source;
    updateEdge.sourceHandle = sourceHandle;
    updateEdge.target = target;
    updateEdge.targetHandle = targetHandle;

    console.log("updateEdge", updateEdge);

    handleConnectChange(updateEdge, edge == undefined);
  } else {
    console.log("boop");
  }
};

function flattenObject(obj) {
  const result = [];
  if (obj) {
    const objKeys = Object.keys(obj);
    if (objKeys)
      objKeys.map((key) => {
        obj[key].map((field) => {
          result.push(field);
        });
      });
  }

  return result;
}

const EmptyDetail = () => {
  return (
    <div className={`detailParameterBox`}>
      <GetImage hex={"#ffffff"} />
      <div className="detailParameterFrame">
        <div className="detailFont">
          None Available <span style={{ color: "#fff" }}>(</span>
          {"None"}
          <span style={{ color: "#fff" }}>)</span>
        </div>
        <div className="detailDropdown">
          <select
            className="detailFont detailFontCase"
            value={null}
            disabled={true} /*onChange={handleChange}*/
          ></select>
        </div>
      </div>
    </div>
  );
};

const GetImage = ({ hex }) => {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="tabler:circles">
        <path
          id="Vector"
          d="M5.33317 5.16667C5.33317 5.87391 5.61412 6.55219 6.11422 7.05229C6.61432 7.55238 7.29259 7.83333 7.99984 7.83333C8.70708 7.83333 9.38536 7.55238 9.88546 7.05229C10.3856 6.55219 10.6665 5.87391 10.6665 5.16667C10.6665 4.45942 10.3856 3.78115 9.88546 3.28105C9.38536 2.78095 8.70708 2.5 7.99984 2.5C7.29259 2.5 6.61432 2.78095 6.11422 3.28105C5.61412 3.78115 5.33317 4.45942 5.33317 5.16667ZM1.6665 11.8333C1.6665 12.5406 1.94746 13.2189 2.44755 13.719C2.94765 14.219 3.62593 14.5 4.33317 14.5C5.04041 14.5 5.71869 14.219 6.21879 13.719C6.71889 13.2189 6.99984 12.5406 6.99984 11.8333C6.99984 11.1261 6.71889 10.4478 6.21879 9.94772C5.71869 9.44762 5.04041 9.16667 4.33317 9.16667C3.62593 9.16667 2.94765 9.44762 2.44755 9.94772C1.94746 10.4478 1.6665 11.1261 1.6665 11.8333ZM8.99984 11.8333C8.99984 12.5406 9.28079 13.2189 9.78089 13.719C10.281 14.219 10.9593 14.5 11.6665 14.5C12.3737 14.5 13.052 14.219 13.5521 13.719C14.0522 13.2189 14.3332 12.5406 14.3332 11.8333C14.3332 11.1261 14.0522 10.4478 13.5521 9.94772C13.052 9.44762 12.3737 9.16667 11.6665 9.16667C10.9593 9.16667 10.281 9.44762 9.78089 9.94772C9.28079 10.4478 8.99984 11.1261 8.99984 11.8333Z"
          stroke={hex}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
