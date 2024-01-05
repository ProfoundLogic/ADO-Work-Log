import axios from "axios";

export default function RefreshTimecardsButton() {
  const refreshTimecards = () => {
    axios
      .get("http://localhost/timecards/refresh")
      // eslint-disable-next-line no-restricted-globals
      .then((response) => location.reload())
      .catch((error) => console.error("Error:", error));
  };

  return (
    <button
      type="button"
      className="rounded-md bg-indigo-600 mx-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => refreshTimecards()}
    >
      Refresh Time Cards
    </button>
  );
}
