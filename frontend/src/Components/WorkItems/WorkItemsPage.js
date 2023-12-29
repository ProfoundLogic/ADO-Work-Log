import { AuthenticatedTemplate } from "@azure/msal-react";

import SignedOut from "../SignedOut";
import WorkItemsTable from "./WorkItemsTable";
import WorkItemsHeader from "./WorkItemsHeader";
import WorkItemsActionBar from "./WorkItemsActionBar";

import Navbar from "../Navbar";

// Rehome the work items page here and rename
export default function WorkItemsPage() {
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
