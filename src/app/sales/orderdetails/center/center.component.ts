import { Component, Input, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'sistem-orderdetails-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss']
})
export class CenterComponent implements OnInit {

  @Input() order: any;
  @Input() currency = '';
  @Output() editImage = new EventEmitter();
  @ViewChild('input') input: ElementRef;
  @Output() actionEdit = new EventEmitter();

  ordervalues = [];
  total = '';
  subtotal = 0;
  discount = 0;
  tax = 0;
  addTaskModelOpen = false;

  addAttachment: Subject<void> = new Subject<void>();
  addNotes: Subject<void> = new Subject<void>();

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.ordervalues = this.getOrder();
    for (const o of this.ordervalues) {
      this.subtotal = (o.pQuantity * o.pPrice) + this.subtotal;
      this.discount = o.pDiscount + this.discount;
      this.tax = o.pTax + this.tax;
    }
    this.total = this.currency + ' ' +
      parseFloat(this.order.sales_orders_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  isArray(val): boolean { return Array.isArray(val); }


  getOrder = () => {
    const p = JSON.parse(this.order.sales_orders_details);
    return p;
  }


  attachmentClick = (refEl) => {
    this.addAttachment.next();
  }

  getProductIcon = (product) => {
    if (product.pImage) {
      return product.pImage;
    }
    return '/assets/images/noimage.jpeg';
  }


  commaNumber = (n) => parseFloat(n).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  
  addTask = () => {
    this.addTaskModelOpen = true;
  }

  cancelAddtask = () => {
    this.addTaskModelOpen = false;
  }

  notesClick = (refEl) => {
    this.addNotes.next();
  }

}
