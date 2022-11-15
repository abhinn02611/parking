import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'form-product',
  templateUrl: './formproduct.component.html',
  styleUrls: ['./formproduct.component.scss']
})
export class FormproductComponent implements OnInit {

  @Input() inputModel: any;
  @Input() numberOnly = false;
  @Output() inputModelChange = new EventEmitter<any>();
  @Output() deleteProduct = new EventEmitter<any>();

  typeOpen = false;
  discountType = 'Percent';
  inputQuantity = 1;
  inputRate = 0;
  inputDiscount = 0;
  inputTax = 0;
  inputTotal = 0;
  pName = '';
  pCode = '';


  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputModel && changes.inputModel.currentValue) {
      const newVal = changes.inputModel.currentValue;
      this.pName = newVal.pName;
      this.pCode = newVal.pCode;
      this.inputQuantity = newVal.pQuantity;
      this.inputRate = newVal.pPrice;
      this.inputDiscount = newVal.pDiscount;
      this.inputTax = newVal.pTax;
      this.inputTotal = newVal.pNetTotal;
      this.discountType = newVal.discountType ? newVal.discountType : 'Absolute';
    }
  }

  constructor() {

  }

  ngOnInit() {

  }


  onBlur = () => {
    this.updateTotal();
  }

  openTypeDD = () => {
    this.typeOpen = true;
  }

  selectType = (type) => {
    this.discountType = type;
    console.log('discountType', this.discountType);
    this.typeOpen = false;
    this.updateTotal();
  }

  updateTotal = () => {
    const ttl = this.inputQuantity * this.inputRate;
    let discount = this.inputDiscount.toString().replace('%', '');
    if (discount === '') {
      discount = '0';
    }
    const discountNum = parseFloat(discount);
    let disVal = 0;
    if (this.discountType === 'Percent') {
      disVal = (discountNum * ttl) / 100;
    } else {
      disVal = discountNum;
    }
    const tax = (ttl * this.inputTax) / 100;
    const toatl = ttl - disVal + tax;
    this.inputTotal = toatl;
    this.inputModelChange.emit({
      pName: this.pName,
      pCode: this.pCode,
      pQuantity: this.inputQuantity,
      pPrice: this.inputRate,
      pImage: null,
      pDiscount: this.inputDiscount,
      pTax: this.inputTax,
      pNetTotal: this.inputTotal,
      discountType: this.discountType
    });
  }

}
