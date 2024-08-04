import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocViewer() {
  const [apiDocsViewer, setApiDocsViewer] = useState(null);
  const apiDoc = useLoaderData();
    
  console.log("apiDoc");
  console.log(apiDoc);

  //   useEffect(() => {
  //     console.log("test");
  //     console.log("REMOV!");
  //     //add stopLight component to page on load
  //     const myScriptElement = document.createElement("script");
  //     myScriptElement.setAttribute(
  //       "src",
  //       "https://unpkg.com/@stoplight/elements/web-components.min.js"
  //     ); // Set the source URL
  //     document.head.appendChild(myScriptElement); // Append to the head or body
  //   }, [0]);
  return (
    <div className="apiDocViewer">
      <SwaggerUI spec={apiDoc} />;
    </div>
  );
}
