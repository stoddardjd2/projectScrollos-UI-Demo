import React from "react";
// import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import Home from "./components/Home.jsx";
import Discover from "./components/Discover-components/Discover.jsx";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import Navbar from "./components/Navbar.jsx";
import ApiDocViewer from "./components/ApiDocViewer/ApiDocViewer.jsx";
import UserNavBar from "./components/Discover-components/UserNavBar.jsx";
import ErrorPage from "./components/Discover-components/ErrorPage.jsx";
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
    errorElement: <ErrorPage />,
  },
  {
    path: "about",
    element: (
      <>
        <Navbar />
        <div>About!</div>
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "discover/:userID/:searchQuery?",
    element: (
      <>
        {/* <UserNavBar /> */}
        <Discover  />
      </>
    ),
    errorElement: <ErrorPage />,

    loader: async ({ params }) => {
      const searchQuery = params.searchQuery

      const loadedLastViewModeObj = await fetch(
        `http://localhost:3001/getLastViewMode/${params.userID}`
      ).then((res) => res.json());
      const loadedLastViewMode = loadedLastViewModeObj.lastViewMode;

      // const loadedDocs = await fetch(
      //   "http://localhost:3001/read/limitResults/20"
      // ).then((res) => res.json());

      const userData = await fetch(
        `http://localhost:3001/user/${params.userID}`
      ).then((res) => res.json());

      const allDocIdObjs = await fetch(
        `http://localhost:3001/getAllDocIds`
      ).then((res) => res.json());

      let allDocIds = [];
      allDocIdObjs.map((idObj) => {
        allDocIds.push(idObj._id);
      });
      return { userData, allDocIds, loadedLastViewMode, searchQuery};
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
    path: "ApiDocViewer/:apiID/:userID",
    loader: async ({ params }) => {
      const apiDoc = await fetch(
        `http://localhost:3001/read/getId/${params.apiID}`
      ).then((res) => res.json());
      const userData = await fetch(
        `http://localhost:3001/user/${params.userID}`
      ).then((res) => res.json());

      return { apiDoc, userData };
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
