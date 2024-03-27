import React, { useState, memo } from "react";
import { Handle, Position } from "reactflow";

import FunctionHeaderComponent from "../headers/header.function";
import FlowComponent from "../fields/field.flow";
import TagComponent from "../headers/header.tag";
import InputFieldComponent from "../fields/field.input";
import apiLogo from "../../assets/icons/ph_link-bold.png";
import { useAppContext } from "../../AppContext";
import { useEffect } from "react";

export default memo((node) => {
  const { getNodeStruc } = useAppContext();
  // Default states
  const [functionHeaderData, setFunctionHeaderData] = useState({
    function: node.type,
  });

  const [items, setItems] = useState([]);
  const [toggleItems, changeToggle] = useState(["Event Data"]);

  useEffect(() => {
    async function getStruc() {
      try {
        const res = await getNodeStruc("sera-default", node.data?.inputData);
        setItems(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getStruc();
  }, []);

  const FieldItems = ({ collapsed = true }) => {
    return Object.keys(items).map((fieldItem, int) => {
      return (
        <div style={{ marginTop: !collapsed ? -16 : null }}>
          <FlowComponent
            data={{
              target: {
                id: `flow-target-${node.id}-(${fieldItem})`,
                type: items[fieldItem],
                title: fieldItem,
              },
              source: {
                id: `flow-source-${node.id}-(${fieldItem})`,
                type: items[fieldItem],
                title: fieldItem,
              },
              nodeType: 0,
            }}
          />
        </div>
      );
    });
  };

  return (
    <div className="apiNode greenBD">
      <FunctionHeaderComponent data={functionHeaderData} />
      <div className="nodeHeaderContent">
        <div className="nodeHeaderContentDetails">
          <div style={{ fontSize: 8, color: "#ffffff" }}>
            On {camelCaseToCapitalizedSpace(node.data?.inputData)}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
          >
            <g clip-path="url(#clip0_1953_1883)">
              <path
                d="M8.00004 14.6666C11.6819 14.6666 14.6667 11.6818 14.6667 7.99992C14.6667 4.31802 11.6819 1.33325 8.00004 1.33325C4.31814 1.33325 1.33337 4.31802 1.33337 7.99992C1.33337 11.6818 4.31814 14.6666 8.00004 14.6666Z"
                stroke="#ffffff80"
                stroke-width="1.33333"
              />
              <path
                d="M8 4.6665H8.00667"
                stroke="#ffffff80"
                stroke-width="1.33333"
                stroke-linecap="round"
              />
              <path
                d="M6.66675 7.33325H8.00008V10.6666M6.66675 10.6666H9.33341"
                stroke="#ffffff80"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1953_1883">
                <rect width="16" height="16" fill="#ffffff80" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div>
        <div
          className="nodeToggleHeader"
          onClick={() => {
            const isCategoryIncluded = toggleItems.includes("Event Data");
            const newToggleItems = isCategoryIncluded
              ? toggleItems.filter((item) => item !== "Event Data") // Remove category if it's already included
              : [...toggleItems, "Event Data"]; // Add category using spread syntax for immutability
            changeToggle(newToggleItems);
          }}
        >
          {"Event Data"}
        </div>

        <div
          style={{
            paddingTop: toggleItems.includes("Event Data") ? 5 : 0,
            paddingBottom: toggleItems.includes("Event Data") ? 5 : 0,
            overflow: "hidden",
            maxHeight: toggleItems.includes("Event Data") ? undefined : 0,
          }}
        >
          <FieldItems collapsed={toggleItems.includes("Event Data")} />
        </div>
      </div>
      <div
        style={{
          paddingTop: 1,
          paddingBottom: 1,
          textAlign: "center",
          fontSize: 7,
          borderTopWidth: 1,
          borderTopColor: "#141414",
          borderTopStyle: "solid",
          backgroundColor: "#00000030",
          cursor: "pointer",
        }}
      >
        Edit Event Structure
      </div>
    </div>
  );
});

function camelCaseToCapitalizedSpace(str) {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);

    // If uppercase letter and not the first character
    if (char === char.toUpperCase() && i > 0) {
      result += " ";
    }

    // If first character and it's a letter
    if (i === 0 && /[a-zA-Z]/.test(char)) {
      result += char.toUpperCase();
    } else {
      result += char;
    }
  }

  return result;
}
