import { format, parseISO } from 'date-fns';

export function formatDate(date: Date | number | string, token?: string) {
  let d = new Date(date);
  if (typeof date === 'string') d = parseISO(date);
  return format(d, token ?? 'M/d/yy');
}
