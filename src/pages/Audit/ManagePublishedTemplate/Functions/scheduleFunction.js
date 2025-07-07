
export async function getCurrentOrNextShift(scheduled_shift) {
    let moment1 = require('moment-timezone');
    const now = moment1().tz("Asia/Kolkata");
    const currentTime = now.format("HH:mm");

    console.log(`Current Time in IST: ${currentTime}`);
  
    for (const shift of scheduled_shift) {
      console.log(currentTime,'currentTime')
      if (currentTime >= shift.start && currentTime <= shift.end) {
        return { message: "Current shift found", shift };
      }
    }
  
    const nextShift = scheduled_shift.find(shift => currentTime < shift.start);
    if (nextShift) {
      return { message: "No current shift, next upcoming shift", shift: nextShift };
    }
  
    return { message: "No shifts available", shift: null };

}


export async function isCurrentDate(dateToCheck) {
    const currentDate = new Date();
    return dateToCheck.getFullYear() === currentDate.getFullYear() &&
        dateToCheck.getMonth() === currentDate.getMonth() &&
        dateToCheck.getDate() === currentDate.getDate();
};





export async function getCurrentIndianTimeDup(desiredDate, desiredHours, desiredMinutes, useNextDay) {
    // Parse the desired date (or use the current date if not provided)
    const currentUTC = desiredDate ? new Date(desiredDate) : new Date();

    const istOffset = 5.5 * 60 * 60 * 1000;

    const currentIST = new Date(currentUTC.getTime() + istOffset);

    currentIST.setHours(desiredHours);
    currentIST.setMinutes(desiredMinutes);
    currentIST.setSeconds(0); // Set seconds to zero if not specified

    if (useNextDay) {
        currentIST.setDate(currentIST.getDate() + 1);
    }

    // Format the output in ISO format
    const year = currentIST.getFullYear();
    const month = String(currentIST.getMonth() + 1).padStart(2, '0');
    const day = String(currentIST.getDate()).padStart(2, '0');
    const hours = String(currentIST.getHours()).padStart(2, '0');
    const minutes = String(currentIST.getMinutes()).padStart(2, '0');
    const seconds = String(currentIST.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
}




export async function getSpecificDayDateFrom (dayName, fromDate) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
  
    // Parse the fromDate (if provided) or default to today
    const startDate = fromDate ? new Date(fromDate) : new Date();
    const startIndex = startDate.getDay(); // Get day index of the starting date
    const targetIndex = daysOfWeek.indexOf(dayName); // Find the index of the target day
  
    if (targetIndex === -1) {
      throw new Error("Invalid day name provided."); // Handle invalid day names
    }
  
    // Calculate days until the target day
    const daysUntilTarget =
      startIndex <= targetIndex
        ? targetIndex - startIndex
        : 7 - startIndex + targetIndex;
  
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + daysUntilTarget);
  
    // Format the date as YYYY-MM-DDTHH:mm
    const formattedDate = targetDate.toISOString().split("T")[0];
    console.log(formattedDate,'formattedDate')
    return formattedDate;
  };



  export async function getQuarterForDate(dateString,quarterRanges) {
     
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Convert input date to a Date object
    const inputDate = new Date(dateString);
    if (isNaN(inputDate)) return "Invalid date";
  
    // Extract the month index from the input date
    const monthIndex = inputDate.getMonth(); // 0-based index
    const monthName = months[monthIndex];
  
    // Find the corresponding quarter range
    const quarter = quarterRanges.find(q => {
      const startIndex = months.indexOf(q.start);
      const endIndex = months.indexOf(q.end);
      return monthIndex >= startIndex && monthIndex <= endIndex;
    });
  
    return quarter || "Unknown Quarter";
  }


  export async function getFirstDateOfMonth(range) {
   
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const now = new Date();
    const currentMonthIndex = now.getMonth(); // Current month index (0-11)
  
    const startMonthIndex = months.indexOf(range.start);
    const endMonthIndex = months.indexOf(range.end);
  
    if (startMonthIndex === -1 || endMonthIndex === -1) {
      return "Invalid month in range";
    }
  
    let isInRange = false;
  
    // ✅ Check if the current month is within the given range
    if (startMonthIndex <= endMonthIndex) {
      // Case 1: Same year range (e.g., January - March)
      isInRange =
        currentMonthIndex >= startMonthIndex && currentMonthIndex <= endMonthIndex;
    } else {
      // Case 2: Cross-year range (e.g., November - February)
      isInRange =
        currentMonthIndex >= startMonthIndex || currentMonthIndex <= endMonthIndex;
    }
  
    let year = now.getFullYear();
  
    // ✅ If the range has already passed this year, move to next year
    if (!isInRange && endMonthIndex < currentMonthIndex) {
      year += 1; // Move to next year
    }
  
    // ✅ Get the last date of the month before the `start` month
    const prevMonthIndex = startMonthIndex === 0 ? 11 : startMonthIndex - 1; // Previous month
    const prevMonthYear = startMonthIndex === 0 ? year - 1 : year; // Handle year change if previous month is December
  
    // ✅ Get the last date of the previous month correctly
    const lastDateOfPrevMonth = new Date(Date.UTC(prevMonthYear, prevMonthIndex + 1, 0, 18, 30, 0)); // Corrected time at 18:30:00
  
    return lastDateOfPrevMonth.toISOString();

  }


  export async function getNthDateOfCurrentMonth(n) {
    const now = new Date();
    now.setDate(n);
    now.setHours(0, 0, 0, 0); 
    const formattedDateWithTime = now.toISOString();
    return formattedDateWithTime;
  }



