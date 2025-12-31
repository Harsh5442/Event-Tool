// src/utils/helpers.ts
import { parseISO, format, isValid } from 'date-fns';

export const formatDate = (dateString: string | undefined, formatString = 'PP') => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatString) : dateString;
  } catch (e) {
    console.error("Could not parse date:", dateString, e);
    return dateString;
  }
};

export const formatTime = (dateString: string | undefined, formatString = 'HH:mm a') => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatString) : dateString;
  } catch (e) {
    console.error("Could not parse time:", dateString, e);
    return dateString;
  }
};

export const getDayOfWeek = (dateString: string | undefined) => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'EEEE') : dateString;
  } catch (e) {
    console.error("Could not parse date:", dateString, e);
    return dateString;
  }
};

export const calculateDayNumber = (startDate: string, currentDate: string): number => {
  try {
    const start = parseISO(startDate);
    const current = parseISO(currentDate);
    if (!isValid(start) || !isValid(current)) return 1;
    
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Day 1, Day 2, etc.
  } catch (e) {
    console.error("Could not calculate day number:", e);
    return 1;
  }
};