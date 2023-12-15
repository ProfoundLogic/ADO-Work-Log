import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { classNames } from "../../utils.js";
import useStore from "../../store.js";

export default function WorkItemRevisionFilters() {
  const selectedNameFilter = useStore((state) => state.selectedNameFilter);
  const nameFilterOptions = useStore((state) => state.getNameFilterOptions());
  const setSelectedNameFilter = useStore(
    (state) => state.setSelectedNameFilter
  );

  return (
    <>
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Filters
      </h2>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {selectedNameFilter || "Filter by Assignee"}
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {nameFilterOptions.map((nameFilterOption) => (
                <Menu.Item key={nameFilterOption}>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedNameFilter(nameFilterOption)}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm w-full text-left"
                      )}
                    >
                      {nameFilterOption}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <button
        onClick={() => setSelectedNameFilter("")}
        className="mx-2 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Clear Filters
      </button>
    </>
  );
}
