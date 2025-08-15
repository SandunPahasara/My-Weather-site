import { format } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const formatDay = (date: Date): string => {
  return format(date, 'EEE');
};