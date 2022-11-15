import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'form-rates',
  templateUrl: './formrates.component.html',
  styleUrls: ['./formrates.component.scss'],
})
export class FormRateComponent implements OnInit {
  @Input() inputModel: any;
  @Input() numberOnly = false;
  @Input() hideDelete = false;
  @Input() rates = [];
  @Output() inputModelChange = new EventEmitter<any>();
  @Output() deleteRate = new EventEmitter<any>();

  startHour = '';
  endHour = '';
  rate = '';
  tax = '18';
  total = '';
  new = false;
  status = false;
  id = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputModel && changes.inputModel.currentValue) {
      const newVal = changes.inputModel.currentValue;
      this.startHour = newVal.startHour;
      this.endHour = newVal.endHour;
      this.rate = newVal.rate;
      this.tax = newVal.tax;
      this.total = newVal.total;
      this.new = newVal.new;
      this.status = newVal.status;
      this.id = newVal.id;
    }
  }

  constructor() {}

  ngOnInit() {}

  updateTotal = (e = null) => {
    if (this.rate && isNaN(parseInt(this.rate)) == false) {
      this.total = (
        parseFloat(this.rate) +
        (parseFloat(this.rate) * parseFloat(this.tax)) / 100
      ).toFixed(2);
    } else {
      this.total = '';
    }
    this.inputModelChange.emit({
      startHour: this.startHour,
      endHour: this.endHour,
      rate: this.rate,
      tax: this.tax,
      total: this.total,
      new: this.new,
      status: this.status,
      id: this.id,
    });
  };
}
