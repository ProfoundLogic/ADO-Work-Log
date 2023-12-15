import useStore, { getFilteredWorkItems } from "../../store.js";
import { getOneWorkDayAgo } from "../../utils.js";

export default function CopyToClipboardButton() {
  const selectedNameFilter = useStore((state) => state.selectedNameFilter);
  const filteredWorkItems = getFilteredWorkItems();
  const oneWorkDayAgo = getOneWorkDayAgo();

  const copyToClipboard = () => {
    const template = filteredWorkItems
      .filter((x) => {
        return new Date(x.lastUpdated) > oneWorkDayAgo;
      })
      .reduce((acc, workItem) => {
        const url = `https://dev.azure.com/ProfoundLogic/Transformation/_workitems/edit/${workItem.id}`;

        return (
          acc +
          `* [${workItem.id}](${url}) - ${workItem.title} - ${workItem.state}\n`
        );
      }, "*Yesterday:*\n")
      .concat("*Today*:\n*Blockers*:\n\n*16th Minute:*");

    navigator.clipboard.writeText(template);
  };

  return (
    <button
      onClick={() => copyToClipboard()}
      disabled={!selectedNameFilter}
      className="rounded-md bg-indigo-600 mx-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Copy Standup Template to Clipboard
    </button>
  );
}
