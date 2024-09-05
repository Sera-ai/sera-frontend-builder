import React, { useState, memo, useEffect, useMemo } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

import FlowComponent from "../fields/field.flow";
import FunctionHeaderComponent from "../headers/header.function";
import TagComponent from "../headers/header.tag";
import InputFieldComponent from "../fields/field.input";
import { LeftIcon } from "../../../../../src/assets/assets.svg";

export const FetchIntegration = memo((node) => {
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");

  console.log(node);

  return (
    <div className={`nodeContainer GET-Node`}>
      <TagComponent data={0} />
      <FunctionHeaderComponent
        customIcon={<div className="pl-1"></div>}
        left={null}
        data={{ function: "fetchIntegration", title: "(Fetch) Integration" }}
      />
      <div key={32} className={`nodeContentContainer`}>
        <div className="nodeContentParent">
          <div style={{ fontSize: 8, color: "#fff" }}>
            Integration Name (Optional)
          </div>
          <InputFieldComponent
            data={node.data}
            node={node}
            id={node.id}
            placeholder={""}
            nodeDataField={"name"}
            noFlow
          />
        </div>
        <div className="nodeContentParent">
          <div style={{ fontSize: 8, color: "#fff" }}>Integration Host</div>
          <InputFieldComponent
            data={node.data}
            node={node}
            id={node.id}
            placeholder={"http://192.168.1.1"}
            nodeDataField={"host"}
            noFlow
            disabled
          />
        </div>
        <div className="nodeContentParent">
          <div style={{ fontSize: 8, color: "#fff" }}>Integration Endpoint</div>
          <InputFieldComponent
            data={node.data}
            node={node}
            id={node.id}
            placeholder={"/"}
            nodeDataField={"endpoint"}
            noFlow
          />
        </div>
        <div className="nodeContentParent">
          <div style={{ fontSize: 8, color: "#fff" }}>Integration Method</div>
          <InputFieldComponent
            data={node.data}
            node={node}
            id={node.id}
            placeholder={"GET"}
            nodeDataField={"method"}
            noFlow
            disabled
          />
        </div>
      </div>

      <div key={64} className={`nodeContentContainer`}>
        <div className="nodeContentParent">
          <div className="flowComponentHolder">
            <div style={{ fontSize: 8, color: "#fff" }}>Header (Setup)</div>
            <InputFieldComponent
              data={node.data}
              node={node}
              id={node.id}
              placeholder={`{"key":"value"}`}
              nodeDataField={"header-setup"}
              noFlow
            />
          </div>
        </div>
        <div className="nodeContentParent">
          <div className="flowComponentHolder">
            <div style={{ fontSize: 8, color: "#fff" }}>Header (Input)</div>
            <InputFieldComponent
              data={node.data}
              node={node}
              id={node.id}
              placeholder={`["key"]`}
              nodeDataField={"header-input"}
              noFlow
            />
          </div>
        </div>
      </div>

      <div key={11} className={`nodeContentContainer`}>
        <div className="nodeContentParent">
          <div className="flowComponentHolder">
            <div style={{ fontSize: 8, color: "#fff" }}>Query (Input)</div>
            <InputFieldComponent
              data={node.data}
              node={node}
              id={node.id}
              placeholder={`["key"]`}
              nodeDataField={"query-input"}
              noFlow
            />
          </div>
        </div>
      </div>

      <div key={22} className={`nodeContentContainer`}>
        <div className="nodeContentParent">
          <div className="flowComponentHolder">
            <div style={{ fontSize: 8, color: "#fff" }}>Body (Output)</div>
            <InputFieldComponent
              data={node.data}
              node={node}
              id={node.id}
              placeholder={`{"key":"type"}`}
              nodeDataField={"body-output"}
              noFlow
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export const PushIntegration = memo((node) => {
  const [outParam, setOutParams] = useState([]);

  const targetHandles = useMemo(
    () =>
      outParam.map((param, index) => {
        return (
          <div key={index} className={`nodeHeaderContentDetailsTag ${"maxi"}`}>
            <Handle
              type="source"
              position={Position.Left}
              id={`${param}`}
              className={`anyEdge ioHandle`}
            />
            <div style={{ fontSize: 10, color: "#fff" }}>{param}</div>
            <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}></div>
          </div>
        );
      }),
    [outParam]
  );

  return (
    <div className={`apiNode`}>
      <TagComponent data={0} />
      <FunctionHeaderComponent
        left={null}
        data={{ function: "fetchIntegration", title: "(Fetch) Integration" }}
      />
      <div key={32} className={`nodeHeaderContentDetailsTag ${"maxi"}`}>
        <div style={{ fontSize: 10, color: "#ffffff70", flex: 1 }}></div>
        <div style={{ fontSize: 10, color: "#fff" }}>Connect Parameter</div>
        <Handle
          type="source"
          position={Position.Left}
          id={`connect-add`}
          className={`anyEdge ioHandle`}
        />
      </div>
      {targetHandles}
    </div>
  );
});

export const fetchIntegrationDeployNode = memo((node) => {
  const [refData, setRefData] = useState(null);
  useEffect(() => {
    const getNodeStruc = async () => {
      try {
        const response = await fetch(
          `https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/getNode?id=${node.data.linked}`,
          {
            headers: {
              "x-sera-service": "be_builder",
              "X-Forwarded-For": "backend.sera",
            },
          }
        );
        const jsonData = await response.json();
        if (jsonData) {
          if (!jsonData.issue) {
            console.log("jsonData", jsonData);
            setRefData(jsonData);
          }
        } else {
          console.log("No Integration Node Data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getNodeStruc();
  }, []);

  const getHeaderInput = () => {
    const headerInputs = JSON.parse(
      refData?.data?.inputData?.["header-input"] || `{}`
    );
    if (!headerInputs || Object.keys(headerInputs).length == 0) return;
    console.log(headerInputs);
    return (
      <div key={64} className={`nodeContentContainer`}>
        <div className="nodeContentParent">
          <div className="flowComponentHolder">
            <div style={{ fontSize: 8, color: "#fff" }}>Header (Input)</div>
            {headerInputs.map((header) => (
              <FlowComponent
                data={{
                  target: {
                    id: `${refData.id}-[${header}]-target-${node.id}`,
                    type: "string",
                    title: header,
                  },
                  source: {
                    id: `${refData.id}-[${header}]-source-${node.id}`,
                    type: "string",
                    title: header,
                  },
                  nodeType: 2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getQueryInput = () => {
    const queryInputs = JSON.parse(
      refData?.data?.inputData?.["query-input"] || `{}`
    );
    if (!queryInputs || Object.keys(queryInputs).length == 0) return;

    return (
      <div key={11} className={`nodeContentContainer`}>
        <div className="nodeContentParent">
          <div className="flowComponentHolder">
            <div style={{ fontSize: 8, color: "#fff" }}>Query (Input)</div>
            {queryInputs.map((query) => (
              <FlowComponent
                data={{
                  target: {
                    id: `${refData.id}-[${query}]-target-${node.id}`,
                    type: "string",
                    title: query,
                  },
                  source: {
                    id: `${refData.id}-[${query}]-source-${node.id}`,
                    type: "string",
                    title: query,
                  },
                  nodeType: 2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getBodyOutput = () => {
    const bodyOutputs = JSON.parse(
      refData?.data?.inputData?.["body-output"] || `{}`
    );
    if (!bodyOutputs || Object.keys(bodyOutputs).length == 0) return;

    return (
      <div key={22} className={`nodeContentContainer`}>
        <div className="nodeContentParent">
          <div className="flowComponentHolder">
            <div style={{ fontSize: 8, color: "#fff" }}>Body (Output)</div>
            {Object.keys(bodyOutputs).map((bodyObject) => (
              <FlowComponent
                data={{
                  target: {
                    id: `${refData.id}-[${bodyObject}]-target-${node.id}`,
                    type: bodyOutputs[bodyObject],
                    title: bodyObject,
                  },
                  source: {
                    id: `${refData.id}-[${bodyObject}]-source-${node.id}`,
                    type: bodyOutputs[bodyObject],
                    title: bodyObject,
                  },
                  nodeType: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`nodeContainer GET-Node`}>
      <TagComponent data={0} />
      <FunctionHeaderComponent
        customIcon={<div className="pl-1"></div>}
        left={"both"}
        data={{
          function: "fetchIntegration",
          title: `${
            refData?.data?.inputData?.name ??
            refData?.data?.inputData?.host + refData?.data?.inputData?.endpoint
          }`,
        }}
      />
      {getHeaderInput()}
      {getQueryInput()}
      {getBodyOutput()}
    </div>
  );
});
