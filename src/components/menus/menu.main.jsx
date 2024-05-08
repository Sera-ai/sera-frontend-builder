import React, { memo, useState, useEffect } from "react";
import Collapsible from "react-collapsible";
import stringLogo from "../../assets/icons/tabler_text-recognition.svg";
import booleanLogo from "../../assets/icons/radix-icons_component-boolean.png";
import integerLogo from "../../assets/icons/tabler_decimal.svg";
import arrayLogo from "../../assets/icons/tabler_brackets-contain.svg";
import {
  EventIcon,
  ScriptIcon,
  ToastIcon,
} from "../../../../../src/assets/assets.svg";
import { useAppContext } from "../../AppContext";

export default memo(({ type, playbook }) => {
  const { getNodeStruc, playbookId } = useAppContext();
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function getStruc() {
      try {
        const res = await getNodeStruc(playbookId);
        console.log(res);
        setItems(res);
      } catch (e) {
        console.log(e);
      }
    }
    if (type == "event") {
      getStruc();
    }
  }, []);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeType)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      {type == "event" && (
        <EventNodes onDragStart={onDragStart} eventNodeList={items} />
      )}
      {type == "event" && <EventFunctionNodes onDragStart={onDragStart} />}
      <GenericNodes onDragStart={onDragStart} />
    </aside>
  );
});

const GenericNodes = ({ onDragStart }) => {
  return (
    <Collapsible
      contentOuterClassName="nodeCategoryContainer"
      contentInnerClassName="nodeCategoryInner"
      triggerClassName="text-xs  px-4"
      triggerOpenedClassName="text-xs  px-4"
      trigger="Function Nodes"
      open
      transitionTime={100}
    >
      <div className="scrollContainer" style={{ maxHeight: 240 }}>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, { type: "stringNode" })}
          draggable
        >
          <div className="dndnodeicon handleLeft stringBorder">
            <img src={stringLogo} />
          </div>
          <div className="functionText">
            <div className="nodeTitle">Create String</div>
            <div className="nodeSubtitle">Node to define a static string</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, { type: "integerNode" })}
          draggable
        >
          <div className="dndnodeicon handleLeft integerBorder">
            <img src={integerLogo} />
          </div>
          <div>
            <div className="nodeTitle">Create integer</div>
            <div className="nodeSubtitle">Node to define a static integer</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, { type: "arrayNode" })}
          draggable
        >
          <div className="dndnodeicon handleLeft arrayBorder">
            <img src={arrayLogo} />
          </div>
          <div>
            <div className="nodeTitle">Create Array</div>
            <div className="nodeSubtitle">Node to define a static array</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, { type: "booleanNode" })}
          draggable
        >
          <div className="dndnodeicon handleLeft booleanBorder">
            <img src={booleanLogo} />
          </div>
          <div className="functionText">
            <div className="nodeTitle">Create Boolean</div>
            <div className="nodeSubtitle">Node to define a static boolean</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, { type: "scriptNode" })}
          draggable
        >
          <div className="dndnodeicon handleLeft scriptBorder">
            <ScriptIcon />
          </div>
          <div>
            <div className="nodeTitle">Create Script</div>
            <div className="nodeSubtitle">Node for custom script</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, { type: "sendEventNode" })}
          draggable
        >
          <div className="dndnodeicon handleLeft eventBorder">
            <EventIcon />
          </div>
          <div>
            <div className="nodeTitle">Create Event</div>
            <div className="nodeSubtitle">Node for event logs</div>
          </div>
        </div>
      </div>
    </Collapsible>
  );
};

const EventFunctionNodes = ({ onDragStart }) => {
  return (
    <Collapsible
      contentOuterClassName="nodeCategoryContainer"
      contentInnerClassName="nodeCategoryInner"
      triggerClassName="text-xs  px-4"
      triggerOpenedClassName="text-xs  px-4"
      trigger="Event Function Nodes"
      open
      transitionTime={100}
    >
      <div className="scrollContainer" style={{ maxHeight: 240 }}>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, { type: "toastNode" })}
          draggable
        >
          <div className="dndnodeicon handleLeft eventBorder">
            <ToastIcon />
          </div>
          <div className="functionText">
            <div className="nodeTitle">Create Toast</div>
            <div className="nodeSubtitle">Create popup notification</div>
          </div>
        </div>
      </div>
    </Collapsible>
  );
};

const EventNodes = ({ onDragStart, eventNodeList }) => {
  return (
    <Collapsible
      contentOuterClassName="nodeCategoryContainer"
      contentInnerClassName="nodeCategoryInner"
      triggerClassName="text-xs  px-4"
      triggerOpenedClassName="text-xs  px-4"
      trigger="Event Start Nodes"
      open
      transitionTime={100}
    >
      <div className="scrollContainer" style={{ maxHeight: 240 }}>
        <GetEventNodeList
          onDragStart={onDragStart}
          eventNodeList={eventNodeList}
        />
      </div>
    </Collapsible>
  );
};

const GetEventNodeList = ({ onDragStart, eventNodeList }) => {
  return eventNodeList.map((eventNode) => {
    return (
      <div
        className="dndnode"
        onDragStart={(event) =>
          onDragStart(event, { type: "eventNode", name: eventNode.type })
        }
        draggable
      >
        <div className="dndnodeicon handleLeft eventBorder">
          <EventIcon size={"16"} />
        </div>
        <div>
          <div className="nodeTitle">{eventNode.type}</div>
          <div className="nodeSubtitle">{eventNode.description}</div>
        </div>
      </div>
    );
  });
};
