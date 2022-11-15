import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../shared.service';
import { SalesService } from '../../sales/sales.service';


@Component({
  selector: 'app-add-related-products',
  templateUrl: './add-related-products.component.html',
  styleUrls: ['./add-related-products.component.scss']
})
export class AddRelatedProductsComponent implements OnInit {

  @Input() productId = '';
  @Input() relatedIds = [];
  @Input() getProduct = false;
  @Input() selections: Array<any> = [];
  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();

  productList: any[];
  productListView: any[];
  loading = false;
  loaderPrimary = false;
  currency = '';
  orderBy = '';
  tags = [
    '', ''
  ];
  reverse = true;
  

  headerMap = {
    product_name: 'PRODUCT NAME',
    product_code: 'PRODUCT CODE',
    category_name: 'CATEGORY'
  };
  selectall = false;
  searchKeyword = '';
  selectedProducts = [];

  constructor(private sharedService: SharedService, private salesService: SalesService) {
    this.currency = this.salesService.currency;
  }

  isArray(val): boolean { return Array.isArray(val); }

  inArray = (val, stack) => (stack.findIndex(val) > -1);

  ngOnInit(): void {
    this.loadAPIData();
  }

  loadAPIData = () => {
    this.loading = true;
    this.salesService.getProducts().subscribe(
      data => {
        this.loading = false;
        if (data[0].status === 'success') {
          this.productList = data[0].result;
          this.tags[0] = this.productList.length + ' items';
          this.filterProductList();
        }
      },
      err => {
        this.loading = false;
        console.error(err);
      },
      () => console.log('done loading domain')
    );
  }

  filterProductList = () => {
    this.currency = this.salesService.currency;
    this.productListView = this.productList.map((a: any): Array<any> => {
      Object.keys(a).map(k => a[k] = typeof a[k] === 'string' ? a[k].trim() : a[k]);
      return a;
    });
  }

  updateOrderBy = (type: string) => {
    this.orderBy = type;
    this.tags[1] = 'Sorted by ' + this.headerMap[type];
    this.reverse = !this.reverse;
  }

  isSelected = (id: any) => {
    const index = this.selections.find(a => a === id);
    return index > -1;
  }

  selectItem = (product: any) => {
    const index = this.selections.findIndex(a => a === product.product_id);
    if (index > -1) {
      this.selections.splice(index, 1);
      this.selectedProducts.splice(index, 1);
    } else {
      this.selections.push(product.product_id);
      this.selectedProducts.push(product);
    }
  }

  showResult = () => {
    this.productListView = this.productList.filter((a: any) => {
      if (this.searchKeyword.length) {
        if (a.product_name.toLowerCase().includes(this.searchKeyword.toLowerCase()) === false &&
          a.product_code.toLowerCase().includes(this.searchKeyword.toLowerCase()) === false) {
          return false;
        }
      }
      return true;
    });
  }

  selectallItem = () => {
    if (this.selectall) {
      this.selections = [];
    } else {
      this.selections = this.productListView.map(a => a.product_id);
    }
    this.selectall = !this.selectall;
  }

  print = (v) => {
    return JSON.stringify(v);
  }

  onPrimary = () => {
    if (this.getProduct) {
      this.actionPrimary.emit(this.selectedProducts);
      this.actionCancel.emit();
      return;
    }
    if (this.loaderPrimary === true) {
      return;
    }
    this.loaderPrimary = true;
    const ids = this.selections.map(a => {
      return { id: a };
    });
    this.sharedService.postJson(APIS.SALES.PRODUCT.ADD_RELATED_PRODUCT,
      { id_product: this.productId, product: JSON.stringify(ids) })
      .subscribe((res) => {
        this.loaderPrimary = false;
        if (res[0].status === 'success') {
          this.actionPrimary.emit();
          this.actionCancel.emit();
        } else {
          alert('Unable to add related product');
        }
      }, (err) => {
        this.loaderPrimary = false;
      });
  }

}
