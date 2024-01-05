import { useEffect, useState } from "react";
import { formatDates } from "../../utils";

export default function WorkItemsHeader() {
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetch("http://localhost/workitems/lastupdated")
      .then((response) => response.json())
      .then((lastUpdatedRes) => {
        if (lastUpdatedRes.length) {
          const date = lastUpdatedRes[0].lastUpdated;
          setLastUpdated(date);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
          Work Items Dashboard
        </h2>
      </div>
      <div className="float-right text-l font-bold leading-7 text-gray-900 sm:truncate sm:text-m sm:tracking-tight py-1">
        Work Items Last Updated:
        <span className="font-normal">
          {lastUpdated ? " " + formatDates(lastUpdated) : " No Results"}
        </span>
      </div>
    </div>
  );
}
