import { format } from 'date-fns';

export function formatDate(date: Date | number | string, token?: string) {
  return format(new Date(date), token ?? 'M/d/yy');
}
