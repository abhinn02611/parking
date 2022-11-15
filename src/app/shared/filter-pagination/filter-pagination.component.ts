import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-pagination',
  templateUrl: './filter-pagination.component.html',
  styleUrls: ['./filter-pagination.component.scss'],
})
export class FilterPaginationComponent implements OnInit {
  @Input() filter: any;
  @Output() onFilterChange = new EventEmitter();

  pageCount = 0;
  range = [];
  constructor() {}

  ngOnInit(): void {}

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

  onClickNext() {
    if (this.filter.page != this.pageCount) {
      this.filter.page = this.filter.page + 1;
      this.onFilterChange.emit(this.filter);
    }
  }
}
