export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const formatDates = (dateString, includeTime = false) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = String(date.getFullYear()).substr(-2);

  let formattedDate = month + "/" + day + "/" + year;

  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    formattedDate += ` ${hours}:${minutes}`;
  }

  return formattedDate;
};

export const getOneWorkDayAgo = () => {
  let date = new Date();
  let dayOfWeek = date.getDay();
  let daysToSubtract = 1;

  // If current day is Monday, subtract 3 days to get to Friday
  if (dayOfWeek === 1) daysToSubtract += 2;

  date.setHours(0, 0, 0, 0);

  date.setDate(date.getDate() - daysToSubtract);
  return date;
};
