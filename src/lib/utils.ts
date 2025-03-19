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

// Format in IST without UTC conversion
export const formatISTDateTime = (date: Date, time24: string) => {
  return `${date.toISOString().split("T")[0]}T${time24}:00+05:30`; // ✅ Appends IST offset
};
