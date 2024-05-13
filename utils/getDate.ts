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

export const getStartEndDates = (dateStr?: string) => {
  let date = new Date();

  // Parse the input date string if provided
  if (dateStr !== undefined) {
    try {
      date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // Invalid date string, fallback to current date
        console.warn('Invalid date string. Falling back to current date.');
        date = new Date();
      }
    } catch (error) {
      console.error('Error parsing date string:', error);
      // Fallback to current date if an error occurs during parsing
      date = new Date();
    }
  }

  // Construct start and end of day objects
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

  // Adjust to local time
  const localStartOfDay = new Date(
    startOfDay.getTime() - startOfDay.getTimezoneOffset() * 60000,
  );
  const localEndOfDay = new Date(
    endOfDay.getTime() - endOfDay.getTimezoneOffset() * 60000,
  );

  // Return the start and end dates in local time
  return {
    startOfDay: localStartOfDay.toISOString(),
    endOfDay: localEndOfDay.toISOString(),
  };
};
