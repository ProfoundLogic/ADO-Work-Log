import WorkItemRevisionFilters from "./WorkItemRevisionFilters.js";
import CopyToClipboardButton from "./CopyToClipboardButton.js";
import RefreshWorkItemsButton from "./RefreshWorkItemsButton.js";

export default function WorkItemsActionBar() {
  return (
    <div className="my-1">
      <WorkItemRevisionFilters />
      <div className="float-right">
        <CopyToClipboardButton />
        <RefreshWorkItemsButton />
      </div>
    </div>
  );
}
