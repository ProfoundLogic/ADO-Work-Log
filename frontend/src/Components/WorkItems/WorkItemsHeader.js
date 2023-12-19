import { getMostRecentWorkItem } from "../../store";
import { formatDates } from "../../utils";
export default function WorkItemsHeader() {
  const lastUpdated = formatDates(getMostRecentWorkItem().lastUpdated);
  console.log(lastUpdated);
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight py-1">
          Work Items Dashboard
        </h2>
      </div>
      <div className="float-right text-l font-bold leading-7 text-gray-900 sm:truncate sm:text-m sm:tracking-tight py-1">
        Work Items Last Updated:
        <span className="font-normal">{lastUpdated}</span>
      </div>
    </div>
  );
}
