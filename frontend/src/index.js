import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";

const configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENTID,
  },
};

const pca = new PublicClientApplication(configuration);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <MsalProvider instance={pca}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
