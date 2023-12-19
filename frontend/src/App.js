import { AuthenticatedTemplate } from "@azure/msal-react";

import SignedOut from "./Components/SignedOut.js";
import WorkItemsTable from "./Components/WorkItems/WorkItemsTable.js";
import Navbar from "./Components/Navbar.js";
import WorkItemsHeader from "./Components/WorkItems/WorkItemsHeader.js";
import WorkItemsActionBar from "./Components/WorkItems/WorkItemsActionBar.js";

export default function App() {
  return (
    <>
      <Navbar />
      <SignedOut />
      <AuthenticatedTemplate>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <WorkItemsHeader />
            <WorkItemsActionBar />
            <WorkItemsTable />
          </div>
        </div>
      </AuthenticatedTemplate>
    </>
  );
}
