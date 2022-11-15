import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { priceTypes } from 'src/app/classes/appSettings';

@Component({
  selector: 'sistem-productdetails-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {

  @Input() product: any;
  @Input() currency = '';
  @Input() images: Array<any> = [];
  @Input() prices: Array<any> = [];
  @Output() actionEdit = new EventEmitter();

  priceTypesKV = {};

  constructor() {
    this.priceTypesKV = priceTypes;
  }

  ngOnInit() {
  }

}
