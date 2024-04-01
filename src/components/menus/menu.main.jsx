import React, { memo } from "react";
import Collapsible from "react-collapsible";
import stringLogo from "../../assets/icons/tabler_text-recognition.svg";
import booleanLogo from "../../assets/icons/radix-icons_component-boolean.png";
import integerLogo from "../../assets/icons/tabler_decimal.svg";
import arrayLogo from "../../assets/icons/tabler_brackets-contain.svg";
import { EventIcon } from "../../../../../src/assets/assets.svg";

export default memo(({ oas, type }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(nodeType)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      {type == "event" && <EventNodes onDragStart={onDragStart} />}
      <GenericNodes onDragStart={onDragStart} />
    </aside>
  );
});

const GenericNodes = ({ onDragStart }) => {
  return (
    <Collapsible
      contentOuterClassName="nodeCategoryContainer"
      contentInnerClassName="nodeCategoryInner"
      triggerClassName="text-xs uppercase px-4"
      triggerOpenedClassName="text-xs uppercase px-4"
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
          <div>
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
          <div>
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
          <div>
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
          <div>
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
          <div>
            <img src={booleanLogo} />
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
          <div>
            <img src={booleanLogo} />
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

const EventNodes = ({ onDragStart }) => {
  return (
    <Collapsible
      contentOuterClassName="nodeCategoryContainer"
      contentInnerClassName="nodeCategoryInner"
      triggerClassName="text-xs uppercase px-4"
      triggerOpenedClassName="text-xs uppercase px-4"
      trigger="Event Nodes"
      open
      transitionTime={100}
    >
      <div className="scrollContainer" style={{ maxHeight: 240 }}>
        <div
          className="dndnode"
          onDragStart={(event) =>
            onDragStart(event, { type: "eventNode", name: "seraStart" })
          }
          draggable
        >
          <div>
            <EventIcon size={"16"} />
          </div>
          <div>
            <div className="nodeTitle">Sera Start</div>
            <div className="nodeSubtitle">Event for when Sera launches</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) =>
            onDragStart(event, {
              type: "eventNode",
              name: "seraUserInteraction",
            })
          }
          draggable
        >
          <div>
            <EventIcon size={"16"} />
          </div>
          <div>
            <div className="nodeTitle">User Interaction</div>
            <div className="nodeSubtitle">
              Event for user interacting in Sera
            </div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) =>
            onDragStart(event, {
              type: "eventNode",
              name: "seraPlatformResource",
            })
          }
          draggable
        >
          <div>
            <EventIcon size={"16"} />
          </div>
          <div>
            <div className="nodeTitle">Platform Resource</div>
            <div className="nodeSubtitle">Event for Sera host resource</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) =>
            onDragStart(event, { type: "eventNode", name: "seraRoundTripTime" })
          }
          draggable
        >
          <div>
            <EventIcon size={"16"} />
          </div>
          <div>
            <div className="nodeTitle">Round-trip Time</div>
            <div className="nodeSubtitle">Event for proxy speeds</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) =>
            onDragStart(event, { type: "eventNode", name: "seraOasCreate" })
          }
          draggable
        >
          <div>
            <EventIcon size={"16"} />
          </div>
          <div>
            <div className="nodeTitle">OAS Create</div>
            <div className="nodeSubtitle">Event for creating OAS</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) =>
            onDragStart(event, { type: "eventNode", name: "seraOasManualChange" })
          }
          draggable
        >
          <div>
            <EventIcon size={"16"} />
          </div>
          <div>
            <div className="nodeTitle">OAS Manual Change</div>
            <div className="nodeSubtitle">Event for user changed OAS</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) =>
            onDragStart(event, { type: "eventNode", name: "seraOasLearnedChange" })
          }
          draggable
        >
          <div>
            <EventIcon size={"16"} />
          </div>
          <div>
            <div className="nodeTitle">OAS Learn Change</div>
            <div className="nodeSubtitle">Event for learning mode change</div>
          </div>
        </div>
        <div
          className="dndnode"
          onDragStart={(event) =>
            onDragStart(event, { type: "eventNode", name: "seraOasDelete" })
          }
          draggable
        >
          <div>
            <EventIcon size={"16"} />
          </div>
          <div>
            <div className="nodeTitle">OAS Delete</div>
            <div className="nodeSubtitle">Event for deleting OAS</div>
          </div>
        </div>
      </div>
    </Collapsible>
  );
};
