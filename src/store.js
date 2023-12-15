import { create } from "zustand";
import workItems from "./all_cleaned.json";

const store = create((get, set) => ({
  selectedNameFilter: "",
  workItems: workItems,
  profileImageURL: "",
  setSelectedNameFilter: (name) => {
    set({ selectedNameFilter: name });
  },
  setWorkItems: (workItems) => set({ workItems }),
  getNameFilterOptions: () => {
    return workItems.reduce((acc, workItem) => {
      if (!acc.includes(workItem.assignedTo)) {
        acc.push(workItem.assignedTo);
      }
      return acc;
    }, []);
  },
  setProfileImageURL: (url) => set({ profileImageURL: url }),
}));

export default store;

export const getFilteredWorkItems = () => {
  const workItems = store((state) => state.workItems);
  const selectedNameFilter = store((state) => state.selectedNameFilter);

  const returnVal = Object.values(
    workItems
      .filter((workItem) => {
        if (selectedNameFilter === "") {
          return true;
        }
        return workItem.assignedTo === selectedNameFilter;
      })
      .reduce((acc, workItem) => {
        if (
          !acc[workItem.id] ||
          acc[workItem.id].revision < workItem.revision
        ) {
          acc[workItem.id] = workItem;
        }
        return acc;
      }, {})
  ).sort((a, b) => new Date(a.lastUpdated) < new Date(b.lastUpdated));
  return returnVal;
};

export const getMostRecentWorkItem = () => {
  const workItems = store((state) => state.workItems);
  return workItems.sort(
    (a, b) => new Date(a.lastUpdated) < new Date(b.lastUpdated)
  )[0];
};
