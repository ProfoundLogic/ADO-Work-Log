import { Fragment, useEffect, useState } from "react";
import workItems from "./all_cleaned.json";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useAccount,
} from "@azure/msal-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [selectedNameFilter, setSelectedNameFilter] = useState("");

  const nameFilterItems = workItems.reduce((acc, workItem) => {
    if (!acc.includes(workItem.assignedTo)) {
      acc.push(workItem.assignedTo);
    }
    return acc;
  }, []);

  const filteredWorkItems = Object.values(
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

  const formatDates = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = String(date.getFullYear()).substr(-2);

    return month + "/" + day + "/" + year;
  };
  const getOneWorkDayAgo = () => {
    let date = new Date();
    let dayOfWeek = date.getDay();
    let daysToSubtract = 1;

    // If current day is Monday, subtract 3 days to get to Friday
    if (dayOfWeek === 1) daysToSubtract += 2;

    date.setHours(0, 0, 0, 0);

    date.setDate(date.getDate() - daysToSubtract);
    return date;
  };
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

  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    if (account && inProgress === "none") {
      instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: account,
      });
    }
  }, [account, instance, inProgress]);

  const handleLogin = () => {
    instance.loginRedirect();
  };

  return (
    <>
      <UnauthenticatedTemplate>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div>You need to sign in first!</div>
          <button
            className={classNames(
              !selectedNameFilter
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700",
              "mx-2 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            )}
            onClick={() => handleLogin()}
          >
            Login
          </button>
        </div>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Work Item Revisions
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all work items with their revisions from the last
                  work week.
                </p>
              </div>
            </div>
            <div>
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
                      {nameFilterItems.map((nameFilterItem) => (
                        <Menu.Item key={nameFilterItem}>
                          {({ active }) => (
                            <button
                              onClick={() =>
                                setSelectedNameFilter(nameFilterItem)
                              }
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm w-full text-left"
                              )}
                            >
                              {nameFilterItem}
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
              <button
                onClick={() => copyToClipboard()}
                disabled={!selectedNameFilter}
                className={classNames(
                  !selectedNameFilter
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700",
                  "mx-2 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                )}
              >
                Copy Standup Template to Clipboard
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to sign out?"))
                    instance.logoutRedirect();
                }}
                className={classNames(
                  !selectedNameFilter
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700",
                  "mx-2 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                )}
              >
                Sign out
              </button>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                          Revision
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Assignee
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          State
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredWorkItems.map((workItem, index) => (
                        <tr
                          key={index}
                          onClick={() =>
                            (window.location.href = `https://dev.azure.com/ProfoundLogic/Transformation/_workitems/edit/${workItem.id}`)
                          }
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {workItem.id}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {workItem.revision}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {workItem.title}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {workItem.assignedTo}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {workItem.state}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDates(workItem.lastUpdated)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
    </>
  );
}
