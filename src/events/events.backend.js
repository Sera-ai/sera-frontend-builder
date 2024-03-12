// customFunctions.js
import { socket } from "../helpers/socket";

export const fetchData = async (setNodes, setEdges, setOas, setIssue, path) => {
  try {
    const response = await fetch(
      `/manage/endpoint/?path=${encodeURIComponent(
        path.replace("/builder", "")
      )}`,
      { headers: { "x-sera-service": "be_builder" } }
    );
    const jsonData = await response.json();
    if (!jsonData.issue) {
      setNodes(jsonData.builder.nodes);
      setEdges(jsonData.builder.edges);
      socket.emit("builderConnect", jsonData.builderId);
      socket.builder = jsonData.builderId;
      setOas(jsonData.oas);
    } else {
      setIssue(jsonData.issue);
      console.log("something went wrong");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const createData = async (data, fetchData, setIssue) => {
  if (data.error == "NoEndpoint") {
    const builder_id = await createBuilder(data);
    const created = await createEndpoint(data, builder_id);

    if (created) {
      setIssue(null);
      fetchData(window.location.pathname);
    } else {
      alert("something went wrong");
    }
  }

  if (data.error == "NoBuilder") {
    const builder_id = await createBuilder(data);
    const created = await updateEndpoint(data, builder_id);
    if (created) {
      setIssue(null);
      fetchData(window.location.pathname);
    } else {
      alert("something went wrong");
    }
  }
};

function createEndpoint(data, builder_id) {
  const urli = "https:/" + window.location.pathname.replace("builder/", "");
  const parsed = new URL(urli);

  const lastSlashIndex = parsed.pathname.lastIndexOf("/");
  const path = parsed.pathname.substring(0, lastSlashIndex); // "boop/boop"
  const method = parsed.pathname.substring(lastSlashIndex + 1).toUpperCase(); // "boop"

  const data2 = {
    hostname: parsed.host.split(":")[0],
    endpoint: path,
    method: method,
    builder_id: builder_id,
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

function updateEndpoint(data, builder_id) {
  const urli = "https:/" + window.location.pathname;
  const parsed = new URL(urli);

  const lastSlashIndex = parsed.pathname.lastIndexOf("/");
  const path = parsed.pathname.substring(0, lastSlashIndex); // "boop/boop"
  const method = parsed.pathname.substring(lastSlashIndex + 1).toUpperCase(); // "boop"

  const data2 = {
    hostname: parsed.host.split(":")[0],
    endpoint: path,
    method: method,
    builder_id: builder_id,
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

function createBuilder(data) {
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

export const createNode = (data) => {
  const urli = "https:/" + window.location.pathname.replace("builder/", "");
  const parsed = new URL(urli);

  const lastSlashIndex = parsed.pathname.lastIndexOf("/");
  const path = parsed.pathname.substring(0, lastSlashIndex); // "boop/boop"
  const method = parsed.pathname.substring(lastSlashIndex + 1).toUpperCase(); // "boop"

  const url = `/manage/endpoint/node/create`;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-sera-service": "be_builder",
      "x-sera-builder": socket.builder,
    },
    body: JSON.stringify(data),
  }).catch((error) => console.error("Error:", error));
};
