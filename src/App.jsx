import React from "react";

import "reactflow/dist/style.css";
import "./assets/css/nodes/node.css";
import "./assets/css/sidebar.css";
import "./assets/css/mouse.css";
import "./assets/css/menu/detail.css";
import "./assets/css/index.css";

import { useSocket } from "./helpers/socket";
import { AppProvider, useAppContext } from "./AppContext";
import FlowComponent from "./components/flow.component";
import "@fortawesome/fontawesome-svg-core/styles.css";

const Core = () => {
  const builderContext = useAppContext(); // Access context

  // Refs
  useSocket(builderContext);
  return (
    <div className="sera-flow" style={{ height: "100%", width: "100%" }}>
      <FlowComponent />
    </div>
  );
};

const App = ({ type = "builder", nodes, edges, oas, builderId, getNodeStruc, playbook }) => {
  console.warn(edges)
  return (
    <AppProvider
      type={type}
      initialEdges={edges}
      initialNodes={nodes}
      initialOas={oas}
      builderId={builderId}
      getNodeStruc={getNodeStruc}
      playbook={playbook}
    >
      <Core />
    </AppProvider>
  );
};

export default App;
