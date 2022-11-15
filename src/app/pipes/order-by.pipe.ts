import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(array: Array<any>, orderField: string, orderType: boolean): Array<string> {
    try {
      array = array.sort((a: any, b: any) => {
        const ae = ((a[orderField]) ? a[orderField] : '').toString().toLowerCase();
        const be = ((b[orderField]) ? b[orderField] : '').toString().toLowerCase();
        if (ae === '' && be === '') { return 0; }
        if (ae === '' && be !== '') { return orderType ? 1 : -1; }
        if (ae !== '' && be === '') { return orderType ? -1 : 1; }
        if (ae === be) { return 0; }
        return orderType ? (ae > be ? -1 : 1) : (be > ae ? -1 : 1);
      });
    } catch (e) { }
    return array;
  }
}