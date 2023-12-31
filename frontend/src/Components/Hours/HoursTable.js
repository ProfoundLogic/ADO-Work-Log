import RefreshTimecardsButton from "./RefreshHoursButton";
import { useState, useEffect } from "react";
import { formatDates } from "../../utils";

export default function HoursTable({ currentItems, columns }) {
  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    fetch("http://localhost/timecards/lastupdated")
      .then((response) => response.json())
      .then((lastUpdatedRes) => {
        if (lastUpdatedRes.length) {
          const date = lastUpdatedRes[0].created;
          setLastUpdated(date);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentItems]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Time Card Breakdown by Employee
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Summarizes the timecard data by employee for the last 2 months.
            Brackets by week.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Last Updated On:{" "}
            {lastUpdated ? " " + formatDates(lastUpdated) : " No Results"}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <RefreshTimecardsButton />
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-4 lg:px-6">
            <table className="min-w-full divide-y divide-gray-300">
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
                {currentItems.map((employee) => (
                  <tr key={employee.user} className="divide-x">
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                      {employee.user}
                    </td>
                    {employee.hours.map((hours, index) => (
                      <td
                        className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0 text-right"
                        key={`${employee.user}-${index}`}
                      >
                        {+hours.toFixed(2)}
                      </td>
                    ))}
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0 text-right">
                      {+employee.totalHours.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
