import { useState, useEffect } from "react";
import { AuthenticatedTemplate } from "@azure/msal-react";

import SignedOut from "../SignedOut";
import Navbar from "../Navbar";
import Paginator from "../Paginator";
import JobsTable from "./JobsTable";

export default function JobsPage() {
  const [rowData, setrowData] = useState([]);

  useEffect(() => {
    fetch("http://localhost/jobs/list")
      .then((response) => response.json())
      .then((jobs) => {
        setrowData(jobs);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Navbar />
      <SignedOut />
      <AuthenticatedTemplate>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between flex-col">
                <Paginator
                  items={rowData}
                  itemsPerPage={20}
                  Component={JobsTable}
                  columns={["ID", "Name", "Progress", "Created"]}
                />
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
    </>
  );
}
