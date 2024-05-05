export const getTodaysDate = () => {
  const today = new Date();
  // Set start of day to 00:00:00
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
  );
  // Set end of day to 23:59:59
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
  );


  return {
    startOfDay: startOfDay,
    endOfDay: endOfDay,
  };
};
