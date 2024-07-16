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
  const { getNodeStruc, playbookId } = useAppContext();
  // Default states
  const [functionHeaderData, setFunctionHeaderData] = useState({
    function: node.type,
  });

  const [items, setItems] = useState([]);
  const [toggleItems, changeToggle] = useState(["Event Data"]);

  useEffect(() => {
    async function getStruc() {
      try {
        const res = await getNodeStruc(playbookId, node.data?.inputData);
        setItems(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getStruc();
  }, []);

  const FieldItems = () => {
    return Object.keys(items).map((fieldName, int) => {
      console.log(items)
      console.log(fieldName)
      console.log(items[fieldName])
      return Object.keys(items[fieldName]).map((fieldItem)=>{
        console.log(fieldItem)
        return (
          <FlowComponent
            data={{
              target: {
                id: `${fieldName}.${fieldItem}`,
                type: typeof items[fieldName][fieldItem],
                title: `${fieldName}.${fieldItem}`,
              },
              source: {
                id: `${fieldName}.${fieldItem}`,
                type: typeof items[fieldName][fieldItem],
                title: `${fieldName}.${fieldItem}`,
              },
              nodeType: 0,
            }}
          />
        );
      })
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
                strokeWidth="1.33333"
              />
              <path
                d="M8 4.6665H8.00667"
                stroke="#ffffff80"
                strokeWidth="1.33333"
                strokeLinecap="round"
              />
              <path
                d="M6.66675 7.33325H8.00008V10.6666M6.66675 10.6666H9.33341"
                stroke="#ffffff80"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
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
        <div className="nodeToggleHeader">{"Event Data"}</div>

        <div
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            overflow: "hidden",
            gap: 5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FieldItems />
        </div>
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
