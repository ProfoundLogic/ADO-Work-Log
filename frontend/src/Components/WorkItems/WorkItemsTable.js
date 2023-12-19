import { formatDates } from "../../utils.js";
import { getFilteredWorkItems } from "../../store.js";

export default function WorkItemsTable() {
  const filteredWorkItems = getFilteredWorkItems();

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
              {filteredWorkItems.map((workItem, index) => (
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
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {workItem.title}
                  </td>
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
              ))}
            </tbody>
          </table>
        </div>{" "}
      </div>
    </div>
  );
}
