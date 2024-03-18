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

const App = () => {
  return (
    <AppProvider>
      <Core />
    </AppProvider>
  );
};

export default App;
