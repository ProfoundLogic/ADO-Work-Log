import JobsRow from "./JobsRow";

export default function JobsTable({ currentItems, columns }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Jobs Log
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Lists all DB robot jobs run
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="rounded-md bg-indigo-600 mx-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {}}
          >
            Refresh DB Jobs Log
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-4 lg:px-6">
            <table className="min-w-full divide-y divide-gray-300 mb-4">
              <thead>
                <tr className="divide-x divide-gray-200">
                  {columns.map((column) => (
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 first:pl-0 last:pr-0 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                      key={column}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.map((job) => (
                  <JobsRow key={job.id} job={job} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
