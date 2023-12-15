import useStore from "./store.js";

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const formatDates = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = String(date.getFullYear()).substr(-2);

  return month + "/" + day + "/" + year;
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

export const callMsGraph = async (token) => {
  const setProfileImageURL = useStore.getState().setProfileImageURL;

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  // Add additional fields here
  return fetch(`https://graph.microsoft.com/v1.0/me/photo/$value`, {
    method: "GET",
    headers,
  }).then(async (response) => {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setProfileImageURL(url);
  });
};
