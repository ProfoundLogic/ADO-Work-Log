import { AuthenticatedTemplate } from "@azure/msal-react";
import { useState, useEffect } from "react";

import SignedOut from "../SignedOut";
import Navbar from "../Navbar";
import Paginator from "../Paginator";
import HoursTable from "./HoursTable";

const createDateBrackets = () => {
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const daysToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  const dateBrackets = [];
  for (let i = 0; i < 8; i++) {
    const startOfWeek = new Date();

    startOfWeek.setDate(today.getDate() - daysToMonday - i * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() - daysToMonday - i * 7 + 4);
    endOfWeek.setHours(23, 59, 59, 999);

    dateBrackets.push({
      start: startOfWeek.toISOString(),
      end: endOfWeek.toISOString(),
    });
  }

  return dateBrackets.reverse();
};

export default function HoursPage() {
  const [rowData, setrowData] = useState([]);
  const dateBrackets = createDateBrackets();

  useEffect(() => {
    fetch("http://localhost/timecards")
      .then((response) => response.json())
      .then((timecards) => {
        const employees = timecards.reduce((acc, curr) => {
          if (!acc.includes(curr.user)) {
            acc.push(curr.user);
          }
          return acc;
        }, []);

        const firstStartDate = new Date(dateBrackets[0].start);

        const filteredTimecards = timecards.filter(
          (timeCard) => new Date(timeCard.created) > firstStartDate
        );

        const timecardsWithEmployees = employees.reduce((acc, curr) => {
          const timecardsForEmployee = filteredTimecards.filter((timecard) => {
            return timecard.user === curr;
          });

          const totalHours =
            timecardsForEmployee.reduce((acc, curr) => {
              acc += curr.minutesLogged;
              return acc;
            }, 0) / 60;

          const employeeDateBrackets = [];
          dateBrackets.forEach((bracket) => {
            const hoursInBracket =
              timecardsForEmployee
                .filter(
                  (timecard) =>
                    new Date(timecard.created) > new Date(bracket.start) &&
                    new Date(timecard.created) < new Date(bracket.end)
                )
                .reduce((acc, curr) => {
                  acc += curr.minutesLogged;
                  return acc;
                }, 0) / 60;

            employeeDateBrackets.push(hoursInBracket);
          });

          return [
            ...acc,
            { user: curr, hours: employeeDateBrackets, totalHours: totalHours },
          ];
        }, []);

        const sortedData = timecardsWithEmployees.sort(
          (a, b) => a.totalHours < b.totalHours
        );

        setrowData(sortedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <SignedOut />
      <AuthenticatedTemplate>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between flex-col">
                <Paginator
                  items={rowData}
                  itemsPerPage={20}
                  Component={HoursTable}
                  columns={[
                    "Name",
                    ...dateBrackets.map(
                      (bracket) => `${bracket.start.split("T")[0]}`
                    ),
                    "Total Hours",
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedTemplate>
    </>
  );
}
