import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
const intervals = [
  { label: 'Y', seconds: 31536000 },
  { label: 'M', seconds: 2592000 },
  { label: 'D', seconds: 86400 },
  { label: 'H', seconds: 3600 },
  { label: 'Mi', seconds: 60 },
  { label: 'S', seconds: 1 }
];
@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {
  transform(date: string, orderField: string, orderType: boolean): string {
    try {
      const formattedDate = moment(date).format('ddd DD MMM YY hh:mmA');
      if (date) {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        const interval = intervals.find(i => i.seconds < seconds);
        if (interval) {
          const count = Math.floor(seconds / interval.seconds);
          return `${formattedDate} (${count}${interval.label})`;
        }

      }

      return '--  ';

    } catch (e) {
      console.log('err', e)
    }
    return date;
  }
}