// customFunctions.js
import { socket } from "../helpers/socket";

export const backendEvents = (builderContext = {}) => {
  const { setOas, setIssue, setNodes, setEdges, builder, builderType } =
    builderContext;
  const fetchData = async (path = window.location.pathname) => {
    // try {
    //   const response = await fetch(
    //     `/manage/endpoint/?path=${encodeURIComponent(
    //       path.replace("/builder", "")
    //     )}`,
    //     { headers: { "x-sera-service": "be_builder" } }
    //   );
    //   const jsonData = await response.json();
    //   if (!jsonData.issue) {
    //     //setNodes(jsonData.builder.nodes);
    //     //setEdges(jsonData.builder.edges);

    //     //setOas(jsonData.oas);
    //   } else {
    //     setIssue(jsonData.issue);
    //     console.log("something went wrong");
    //   }
    //   return jsonData

    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }

    socket.emit("builderConnect", builder);
    socket.builder = builder;
  };

  const createData = async (data) => {
    if (data.error == "NoEndpoint") {
      const builder_id = await createBuilder(data);
      const created = await createEndpoint(builder_id);

      if (created) {
        setIssue(null);
        fetchData(window.location.pathname);
      } else {
        alert("something went wrong2");
      }
    }

    if (data.error == "NoBuilder") {
      const builder_id = await createBuilder(data);
      const created = await updateEndpoint(builder_id);
      if (created) {
        setIssue(null);
        fetchData();
      } else {
        alert("something went wrong1");
      }
    }
  };

  function createEndpoint(builder_id) {
    const urli = "https:/" + window.location.pathname.replace("builder/", "");
    const parsed = new URL(urli);

    const lastSlashIndex = parsed.pathname.lastIndexOf("/");
    const path = parsed.pathname.substring(0, lastSlashIndex); // "boop/boop"
    const method = parsed.pathname.substring(lastSlashIndex + 1).toUpperCase(); // "boop"

    const data2 = {
      hostname: parsed.host.split(":")[0],
      endpoint: path,
      method: method,
      builder_id,
    };

    const url = `/manage/endpoint/create`;
    console.log(JSON.stringify(data2));
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
      },
      body: JSON.stringify(data2),
    })
      .then((response) => response.json()) // assuming server responds with json
      .then((data) => {
        return true;
      })
      .catch((error) => {
        console.error("Error:", error);
        return false;
      });
  }

  function updateEndpoint(builderId) {
    const urli = "https:/" + window.location.pathname.replace("builder/", "");
    const parsed = new URL(urli);

    const lastSlashIndex = parsed.pathname.lastIndexOf("/");
    const path = parsed.pathname.substring(0, lastSlashIndex); // "boop/boop"
    const method = parsed.pathname.substring(lastSlashIndex + 1).toUpperCase(); // "boop"

    const data2 = {
      hostname: parsed.host.split(":")[0],
      endpoint: path,
      method: method,
      builder_id: builderId,
    };

    const url = `/manage/endpoint/update`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
      },
      body: JSON.stringify(data2),
    })
      .then((response) => response.json()) // assuming server responds with json
      .then((data) => {
        return true;
      })
      .catch((error) => {
        console.error("Error:", error);
        return false;
      });
  }

  function createBuilder() {
    const urli = "https:/" + window.location.pathname.replace("builder/", "");
    const parsed = new URL(urli);

    const lastSlashIndex = parsed.pathname.lastIndexOf("/");
    const path = parsed.pathname.substring(0, lastSlashIndex); // "boop/boop"
    const method = parsed.pathname.substring(lastSlashIndex + 1).toUpperCase(); // "boop"

    const data2 = {
      hostname: parsed.host.split(":")[0],
      path: path,
      method: method,
    };

    const url = `/manage/builder/create`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
      },
      body: JSON.stringify(data2),
    })
      .then((response) => response.json()) // assuming server responds with json
      .then((data) => {
        return data._id;
      })
      .catch((error) => console.error("Error:", error));
  }

  const createNode = (data) => {
    const url = `/manage/endpoint/node?type=${builderType}`;
    console.log("creatnode", data);
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  const deleteNode = (data) => {
    const url = `/manage/endpoint/node?type=${builderType}`;

    return fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  const createEdge = (data) => {
    const url = `/manage/endpoint/edge?type=${builderType}`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  const removeEdge = (data) => {
    const url = `/manage/endpoint/edge?type=${builderType}`;

    return fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  const updateEdge = (data) => {
    const url = `/manage/endpoint/edge`;

    return fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  return {
    createData,
    deleteNode,
    createNode,
    fetchData,
    createEdge,
    removeEdge,
    updateEdge,
  };
};
