import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert "10:00 AM" to 24-hour format
export const convertTo24HourFormat = (time: string) => {
  const [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/)!.slice(1);
  let hours24 = parseInt(hours, 10);
  if (period === "PM" && hours24 !== 12) hours24 += 12;
  if (period === "AM" && hours24 === 12) hours24 = 0;
  return `${hours24.toString().padStart(2, "0")}:${minutes}`;
};


export const convertToIST = (date: any, time24: string) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.error("Invalid date provided:", date);
    return null; // Prevents crash
  }

  if (!time24 || !/^\d{2}:\d{2}$/.test(time24)) {
    console.error("Invalid time format:", time24);
    return null; // Prevents crash
  }

  const [hours, minutes] = time24.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    console.error("Invalid hour or minute values:", hours, minutes);
    return null; // Prevents crash
  }

  // Clone the date object
  const dateTime = new Date(date);

  // Set hours and minutes
  dateTime.setHours(hours, minutes, 0, 0);

  // Convert to IST format manually (avoiding UTC shift)
  const istOffset = 5.5 * 60 * 60 * 1000; // IST Offset in milliseconds
  const istTime = new Date(dateTime.getTime() + istOffset);

  // Return ISO format but in IST timezone
  return istTime.toISOString().replace("Z", "+05:30");
};



// Format in IST without UTC conversion
export const formatISTDateTime = (date: Date, time24: string) => {
  console.log(date, time24, 'from formatISTDateTime');
  return `${date.toISOString().split("T")[0]}T${time24}:00+05:30`; // ✅ Appends IST offset
};
