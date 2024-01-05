import { formatDates } from "../../utils.js";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import ReactPaginate from "react-paginate";
import { useState } from "react";

import { useStore } from "../../store";

function WorkItemTableRows({ workItems }) {
  return workItems.map((workItem, index) => (
    <tr
      key={index}
      onClick={() =>
        (window.location.href = `https://dev.azure.com/ProfoundLogic/Transformation/_workitems/edit/${workItem.id}`)
      }
      className="cursor-pointer hover:bg-gray-50"
    >
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {workItem.id}
      </td>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {workItem.revision}
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">{workItem.title}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {workItem.assignedTo}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {workItem.state}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {formatDates(workItem.lastUpdated)}
      </td>
    </tr>
  ));
}

export default function WorkItemsTable({ itemsPerPage, workItems }) {
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = workItems.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(workItems.length / itemsPerPage);

  const selectedNameFilter = useStore((state) => state.selectedNameFilter);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % workItems.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Revision
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Assignee
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  State
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <WorkItemTableRows workItems={currentItems} />
            </tbody>
          </table>
        </div>{" "}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {itemOffset > 0 ? 0 : itemOffset + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {currentItems.length + itemOffset}
                </span>{" "}
                of <span className="font-medium">{workItems.length}</span>{" "}
                results
              </p>
            </div>
            <ReactPaginate
              breakLabel="..."
              containerClassName="isolate inline-flex -space-x-px rounded-md shadow-sm"
              nextLabel={<ChevronRightIcon className="h-5 w-5" />}
              nextLinkClassName="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              pageRangeDisplayed={3}
              pageLinkClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              breakLinkClassName="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
              activeLinkClassName="z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              previousLabel={<ChevronLeftIcon className="h-5 w-5" />}
              previousLinkClassName="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              renderOnZeroPageCount={null}
              onClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
