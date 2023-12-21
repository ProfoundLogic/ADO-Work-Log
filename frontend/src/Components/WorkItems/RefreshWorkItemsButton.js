import axios from "axios";

export default function RefreshWorkItemsButton() {
  const refreshWorkItems = () => {
    console.log("sending request");
    axios
      .post("http://localhost/refresh")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <button
      type="button"
      className="rounded-md bg-indigo-600 mx-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => refreshWorkItems()}
    >
      Refresh Work Items
    </button>
  );
}
