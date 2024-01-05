import { useEffect, useState } from "react";
import { AuthenticatedTemplate } from "@azure/msal-react";

import SignedOut from "../SignedOut";
import WorkItemsTable from "./WorkItemsTable";
import WorkItemsHeader from "./WorkItemsHeader";
import WorkItemsActionBar from "./WorkItemsActionBar";

import Navbar from "../Navbar";
import { useStore } from "../../store";

// Rehome the work items page here and rename
export default function WorkItemsPage() {
  const [workItems, setWorkItems] = useState([]);
  const [filteredWorkItems, setFilteredWorkItems] = useState([]);
  const { selectedNameFilter } = useStore();

  useEffect(() => {
    fetch("http://localhost/workitems/list")
      .then((response) => response.json())
      .then((rawWorkItems) => {
        setWorkItems(rawWorkItems);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedNameFilter !== "") {
      setFilteredWorkItems(
        workItems.filter((workItem) => {
          return workItem.assignedTo === selectedNameFilter;
        })
      );
    } else {
      setFilteredWorkItems(workItems);
    }
  }, [selectedNameFilter, workItems]);

  return (
    <>
      <Navbar />
      <SignedOut />
      <AuthenticatedTemplate>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <WorkItemsHeader />
            <WorkItemsActionBar />
            <WorkItemsTable itemsPerPage={25} workItems={filteredWorkItems} />
          </div>
        </div>
      </AuthenticatedTemplate>
    </>
  );
}
