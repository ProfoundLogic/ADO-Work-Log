import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

import "./index.css";
import WorkItemsPage from "./Components/WorkItems/WorkItemsPage";
import ErrorPage from "./error-page";
import HoursPage from "./Components/Hours/HoursPage";
import JobsPage from "./Components/Jobs/JobsPage";

const configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENTID,
  },
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <WorkItemsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/hours",
    element: <HoursPage />,
  },
  {
    path: "/jobs",
    element: <JobsPage />,
  },
]);

const pca = new PublicClientApplication(configuration);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <MsalProvider instance={pca}>
      <RouterProvider router={router} />
    </MsalProvider>
  </React.StrictMode>
);
