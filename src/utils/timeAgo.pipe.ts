import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    const now = moment();
    const date = moment(value);
    const diff = now.diff(date, 'minutes');

    if (diff < 60) {
      return `${diff} minutes ago`;
    } else if (diff < 24 * 60) {
      return `${Math.floor(diff / 60)} hours ago`;
    } else {
      return `${Math.floor(diff / (24 * 60))} days ago`;
    }
  }
}
