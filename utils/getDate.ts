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

  return {
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString(),
  };
};

export const getStartEndDates = (dateStr?: string) => {
  let date = new Date();
  if (dateStr !== undefined) {
    try {
      date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string. Falling back to current date.');
        date = new Date();
      }
    } catch (error) {
      console.error('Error parsing date string:', error);
      date = new Date();
    }
  }
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
  );
  const endOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
  );

  return {
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString(),
  };
};
