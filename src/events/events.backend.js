// customFunctions.js

export const backendEvents = (builderContext = {}) => {
  const { setOas, setIssue, setNodes, setEdges, builder, builderType } =
    builderContext;
  const fetchData = () => { }



  const createData = async (data) => {
    if (data.error == "NoEndpoint") {
      const builder_id = await createBuilder(data);
      const created = await createEndpoint(builder_id);

      if (created) {
        setIssue(null);
      } else {
        alert("No Endpoint");
      }
    }

    if (data.error == "NoBuilder") {
      const builder_id = await createBuilder(data);
      const created = await updateEndpoint(builder_id);
      if (created) {
        setIssue(null);
      } else {
        alert("No Builder");
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

    const url = `https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/create`;
    console.log(JSON.stringify(data2));
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "X-Forwarded-For": "backend.sera"
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

    const url = `https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/update`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "X-Forwarded-For": "backend.sera"
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

    const url = `https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/create`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "X-Forwarded-For": "backend.sera"
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
    const url = `https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/node?type=${builderType}`;
    console.log("creatnode", data);
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
        "X-Forwarded-For": "backend.sera"
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  const deleteNode = (data) => {
    const url = `https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/node/delete?type=${builderType}`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
        "X-Forwarded-For": "backend.sera"
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  const createEdge = (data) => {
    const url = `https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/edge?type=${builderType}`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
        "X-Forwarded-For": "backend.sera"
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  const removeEdge = (data) => {
    const url = `https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/edge/delete?type=${builderType}`;
    console.log("sending")
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
        "X-Forwarded-For": "backend.sera"
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  const updateEdge = (data) => {
    const url = `https://${window.location.hostname}:${__BE_ROUTER_PORT__}/manage/builder/edge`;

    return fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-sera-service": "be_builder",
        "x-sera-builder": builder,
        "X-Forwarded-For": "backend.sera"
      },
      body: JSON.stringify(data),
    }).catch((error) => console.error("Error:", error));
  };

  return {
    createData,
    deleteNode,
    fetchData,
    createNode,
    createEdge,
    removeEdge,
    updateEdge,
  };
};
