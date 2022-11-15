import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { getISOWeek } from 'date-fns';
import * as moment from 'moment';

import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { ACTIONS } from 'src/app/classes/appSettings';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() filter: any;
  @Output() onFilterChange = new EventEmitter();

  pageCount = 0;
  range = [];
  constructor(private i18n: NzI18nService) {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {
    this.i18n.setLocale(en_US);
  }

  onClickNext() {
    if (this.filter.page != this.pageCount) {
      this.filter.page = this.filter.page + 1;
      this.onFilterChange.emit(this.filter);
    }
  }

  onClickBack() {
    if (this.filter.page > 1) {
      this.filter.page = this.filter.page - 1;
      this.onFilterChange.emit(this.filter);
    }
  }

  onPaginationEnter() {
    this.onFilterChange.emit(this.filter);
  }

  getTotalPage(total, limit) {
    this.pageCount = Math.ceil(total / limit);
    return this.pageCount;
  }

  openDD(index) {
    this.filter.dropdowns[index].open = true;
  }

  closeDD(index) {
    this.filter.dropdowns[index].open = false;
  }

  selectOption(index, option) {
    this.filter.dropdowns[index].value = option.value;
    this.filter.dropdowns[index].label = option.label;
    this.closeDD(index);
  }

  onClickApply() {
    this.filter.page = 1;
    if (this.range.length > 0) {
      this.filter.from = moment(this.range[0]).format('YYYY-MM-DD');
      this.filter.to = moment(this.range[1]).format('YYYY-MM-DD');
    }
    this.onFilterChange.emit(this.filter);
  }

  onClearFilter() {
    this.filter.page = 1;
    this.range = [];
    this.filter.from = null;
    this.filter.to = null;
    this.filter.query = '';
    for (let dd of this.filter.dropdowns) {
      dd.value = null;
      dd.label = null;
    }
    this.onFilterChange.emit(this.filter);
  }
}
