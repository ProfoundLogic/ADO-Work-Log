import { create } from "zustand";
import { devtools } from "zustand/middleware";
import workItems from "./all_cleaned.json";

type State = {
  selectedNameFilter: string;
  workItems: any[];
  profileImageURL: string;
  getFilteredWorkItems: () => any[];
  setSelectedNameFilter: (name: string) => void;
  setProfileImageURL: (url: string) => void;
  getNameFilterOptions: () => string[];
}

export const useStore = create(
  devtools<State>((set, get) => ({
    selectedNameFilter: "",
    workItems: workItems || [],
    profileImageURL: "",
    getFilteredWorkItems: () => {
      const workItems = get().workItems;
      const selectedNameFilter = useStore.getState().selectedNameFilter;
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
    },
    setSelectedNameFilter: (name) => {
      set((state) => ({ selectedNameFilter: name }))
    },
    setProfileImageURL: (url) => set({ profileImageURL: url }),
    getNameFilterOptions: () => {
      return workItems.reduce((acc:string[], workItem) => {
        if (!acc.includes(workItem.assignedTo)) {
          acc.push(workItem.assignedTo);
        }
        return acc;
      }, []);
    },
    getMostRecentWorkItem: () => {
      const workItems = get().workItems;
      return workItems.sort(
        (a, b) => new Date(a.lastUpdated) < new Date(b.lastUpdated)
      )[0];
    }
  }))
);