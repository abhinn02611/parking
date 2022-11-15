import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'form-rates-pass',
  templateUrl: './formrates-pass.component.html',
  styleUrls: ['./formrates-pass.component.scss']
})
export class FormRatePassComponent implements OnInit {

  @Input() inputModel: any;
  @Input() numberOnly = false;
  @Input() hideDelete = false;
  @Output() inputModelChange = new EventEmitter<any>();
  @Output() deleteRate = new EventEmitter<any>();

  type = '';
  rate = '';
  tax = '18';
  amount = '';
  status = false;
  id = '';

  ngOnChanges(changes: SimpleChanges) {
    console.log('hideDelete', this.hideDelete);
    if (changes.inputModel && changes.inputModel.currentValue) {
      const newVal = changes.inputModel.currentValue;
      this.type = newVal.type;
      this.rate = newVal.rate;
      this.tax = newVal.tax;
      this.amount = newVal.amount;
      this.status = newVal.status;
      this.id= newVal.id;
    }
  }

  constructor() {

  }

  ngOnInit() {

  }

  updateTotal = (e = null) => {
    if(this.rate && isNaN(parseInt(this.rate)) == false) {
      this.amount = (parseFloat(this.rate) + (parseFloat(this.rate) * parseFloat(this.tax) /100)).toFixed(2);
    }else{
      this.amount = '';
    }
    this.inputModelChange.emit({
      type: this.type,
      rate: this.rate,
      tax: this.tax,
      amount: this.amount,
      status: this.status,
      id: this.id
    });
  }


}
