import React from "react";
// import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import Home from "./components/Home.jsx";
import Discover from "./components/Discover-components/Discover.jsx";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import Navbar from "./components/Navbar.jsx";
import ApiDocViewer from "./components/ApiDocViewer.jsx";
import UserNavBar from "./components/Discover-components/UserNavBar.jsx";

import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

// import { API } from "@stoplight/elements";
// import "@stoplight/elements/styles.min.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "about",
    element: (
      <>
        <Navbar />
        <div>About!</div>
      </>
    ),
  },
  {
    path: "discover/:userID",
    element: (
      <>
        {/* <UserNavBar /> */}
        <Discover />
      </>
    ),
    loader: async ({ params }) => {
      const loadedDocs = await fetch(
        "http://localhost:3001/read/limitResults/30"
      ).then((res) => res.json());
      const userData = await fetch(
        `http://localhost:3001/user/${params.userID}`
      ).then((res) => res.json());
      return { loadedDocs, userData };
    },
  },
  {
    path: "signin",
    element: (
      <>
        <Signin />
      </>
    ),
  },
  {
    path: "signup",
    element: (
      <>
        <Signup />
      </>
    ),
  },
  {
    path: "ApiDocViewer/:apiID",
    loader: async ({ params }) => {
      return fetch(`http://localhost:3001/read/getId/${params.apiID}`);
      // ({ params }) => {
      //   return params.apiID;
    },
    element: (
      <>
        <ApiDocViewer />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
