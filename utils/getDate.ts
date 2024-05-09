export const getTodaysDate = () => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
  );

  // Convert to local time
  const localStartOfDay = new Date(
    startOfDay.getTime() - startOfDay.getTimezoneOffset() * 60000,
  );
  const localEndOfDay = new Date(
    endOfDay.getTime() - endOfDay.getTimezoneOffset() * 60000,
  );

  return {
    startOfDay: localStartOfDay.toISOString(),
    endOfDay: localEndOfDay.toISOString(),
  };
};
