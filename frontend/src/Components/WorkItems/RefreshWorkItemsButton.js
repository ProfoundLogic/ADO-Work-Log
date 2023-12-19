export default function RefreshWorkItemsButton() {
  const refreshWorkItems = () => {
    fetch("http://localhost:80/refresh")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <button
      type="button"
      className="rounded-md bg-indigo-600 mx-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onclick={() => refreshWorkItems()}
    >
      Refresh Work Items
    </button>
  );
}
