import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/classes/appSettings';

@Component({
  selector: 'sistem-productdetails-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss']
})
export class CenterComponent implements OnInit {

  @Input() product: any;
  @Input() images: Array<any> = [];
  @Input() prices: Array<any> = [];
  @Output() editImage = new EventEmitter();
  @Output() addRelatedProduct = new EventEmitter();


  constructor(private router: Router) { }

  ngOnInit() {
    
  }

  isArray(val): boolean { return Array.isArray(val); }

  navigateProduct = (id) => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.PRODUCT_DETAILS, id]);
  }

  viewAllRelatedProducts = () => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.PRODUCT_RELATED_LIST, this.product.product_id]);
  }

}
