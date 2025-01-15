// utility functions for getting the date and setMidnight date

// function to get JST date
export function getJSTDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );
}

// function to set JST midnight
export function setJSTMidnight(date) {
  const jstDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );
  jstDate.setHours(0, 1, 0, 0);
  return jstDate;
}
