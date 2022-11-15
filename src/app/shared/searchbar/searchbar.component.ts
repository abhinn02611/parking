import {
  Component,
  OnInit,
  OnChanges,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';
import * as moment from 'moment';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit, OnChanges {
  @Input() filter: any;
  @Output() onFilterChange = new EventEmitter();

  pageCount = 0;
  range = [];
  constructor(private i18n: NzI18nService) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log('gfv', changes);
  }

  ngOnInit() {
    this.i18n.setLocale(en_US);
  }

  getTotalPage(total, limit) {
    this.pageCount = Math.ceil(total / limit);
    return this.pageCount;
  }

  onClickApply() {
    this.filter.page = 1;
    if (this.range.length > 0) {
      this.filter.from = moment(this.range[0]).format('YYYY-MM-DD');
      this.filter.to = moment(this.range[1]).format('YYYY-MM-DD');
    }
    this.onFilterChange.emit(this.filter);
  }
}
