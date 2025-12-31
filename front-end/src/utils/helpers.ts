// src/utils/helpers.ts
import { parseISO, format, isValid, differenceInDays } from 'date-fns';

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
    
    const diffDays = differenceInDays(current, start);
    return diffDays + 1; // Day 1, Day 2, etc.
  } catch (e) {
    console.error("Could not calculate day number:", e);
    return 1;
  }
};

export const formatDateRange = (startDate: string | undefined, endDate: string | undefined): string => {
  if (!startDate || !endDate) return '';
  const start = formatDate(startDate, 'MMM dd');
  const end = formatDate(endDate, 'MMM dd, yyyy');
  return `${start} - ${end}`;
};

export const isEventUpcoming = (startDate: string | undefined): boolean => {
  if (!startDate) return false;
  try {
    const date = parseISO(startDate);
    return isValid(date) && new Date(date) > new Date();
  } catch (e) {
    return false;
  }
};

export const isEventPassed = (endDate: string | undefined): boolean => {
  if (!endDate) return false;
  try {
    const date = parseISO(endDate);
    return isValid(date) && new Date(date) < new Date();
  } catch (e) {
    return false;
  }
};