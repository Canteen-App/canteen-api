export const checkPreOrder = (dateStr) => {
  if (dateStr) {
    // Convert the input string to a Date object
    const inputDate = new Date(dateStr);

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Calculate 7 days from tomorrow
    const sevenDaysFromTomorrow = new Date(tomorrow);
    sevenDaysFromTomorrow.setDate(sevenDaysFromTomorrow.getDate() + 7);

    // Check if the input date is within 7 days from tomorrow
    if (inputDate >= tomorrow && inputDate <= sevenDaysFromTomorrow) {
      return inputDate.toISOString(); // Return the input date string in ISO-8601 format if it's within the range
    } else {
      return undefined; // Return undefined if the input date is not within the range
    }
  }

  return undefined;
};
