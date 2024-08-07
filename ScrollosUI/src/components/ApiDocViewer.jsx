import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocViewer() {
  // const [apiDocsViewer, setApiDocsViewer] = useState(null);
  const apiDoc = useLoaderData();
  console.log("RUNS!")
  // setClientUserData()
  return (
    <div className="apiDocViewer">
      <SwaggerUI spec={apiDoc} />;
    </div>
  );
}
