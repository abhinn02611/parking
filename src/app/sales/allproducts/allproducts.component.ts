import { Component, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { Globals } from '../../classes/globals';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../services/window.service';
import { SalesService } from '../sales.service';
import { SharedService } from '../../shared/shared.service';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sistem-allproducts',
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.scss'],
  providers: [Globals]
})
export class AllproductsComponent implements OnInit {
  heading = 'All Products';
  domain = '';
  menuSwitchStatus = false;
  addProductModelOpen = false;
  infoOpen = false;
  sidebarFixed = false;
  editId = '';

  productList: any[];
  productListView: any[];
  loading = false;
  currency = '';
  orderBy = '';
  tags = [
    '', ''
  ];
  reverse = true;

  headerMap = {
    product_name: 'PRODUCT NAME',
    product_code: 'PRODUCT CODE',
    mrp: 'MRP',
    category_typename: 'TYPE',
    category_name: 'CATEGORY',
    product_stock: 'STOCK'
  };
  selectall = false;
  selections: Array<any> = [];
  actions = null;
  activeActions = [];
  confirmDeleteModelOpen = false;

  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private salesService: SalesService,
    private sharedService: SharedService, private router: Router) {
    this.actions = ACTIONS;
  }

  ngOnInit() {
    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((menuSwitchStatus) => {
      this.menuSwitchStatus = menuSwitchStatus;
    });
    this.loadAPIData();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    if (offset > 94 && this.sidebarFixed === false) {
      this.sidebarFixed = true;
    }
    if (offset <= 94 && this.sidebarFixed === true) {
      this.sidebarFixed = false;
    }
  }

  switchMenu = (status) => {
    this.menuSwitchStatus = status;
  }

  cancelAddProduct = (refress, reopen) => {
    if (refress) {
      this.loadAPIData();
    }
    this.addProductModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addProductModelOpen = true;
      }, 10);
    }
  }

  openAddNewModel = () => {
    this.editId = '';
    this.addProductModelOpen = true;
  }



  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
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
      try {
        const mrp = JSON.parse(a.product_mrp);
        a.mrp = mrp[0].mrp;
        a.image = APIS.IMAGE_URL + a.product_thumb;
      } catch (e) {
        a.mrp = 0;
        a.image = '';
      }

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

  selectItem = (e: any, product: any) => {
    e.stopPropagation();
    e.preventDefault();
    const index = this.selections.findIndex(a => a === product.product_id);
    if (index > -1) {
      this.selections.splice(index, 1);
    } else {
      this.selections.push(product.product_id);
    }
    this.updateBulkAction();
  }

  selectallItem = () => {
    if (this.selectall) {
      this.selections = [];
    } else {
      this.selections = this.productListView.map(a => a.product_id);
    }
    this.selectall = !this.selectall;
    this.updateBulkAction();
  }

  updateBulkAction = () => {
    if (this.selections.length > 0) {
      const index = this.activeActions.indexOf(this.actions.DELETE);
      if (index < 0) {
        this.activeActions.push(this.actions.DELETE);
      }
    } else {
      const index = this.activeActions.indexOf(this.actions.DELETE);
      if (index > -1) {
        this.activeActions.splice(index, 1);
      }
    }
  }

  editProduct = (id) => {
    this.editId = id;
    this.addProductModelOpen = true;
  }

  deleteProduct = (id) => {
    const i = this.productListView.findIndex(a => a.product_id === id);
    this.sharedService.delete(APIS.SALES.PRODUCT.DELETE_PRODUCT + id + '/')
      .subscribe((res) => {
        if (res[0].status === 'success') {
          this.productListView.splice(i, 1);
        } else {
          alert('Unable to delete product');
        }
      }, (err) => { });
    console.log('Deleye', id);
  }

  isArray(val): boolean { return Array.isArray(val); }

  openProductDetails = (id) => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.PRODUCT_DETAILS + id]);
  }


  onAction = (action) => {
    if (action === this.actions.DELETE) {
      this.confirmDeleteModelOpen = true;
    }
  }

  confirmDelete = () => {
    this.sharedService.postJson(APIS.SALES.PRODUCT.DELETE_PRODUCTS, {
      products: this.selections
    })
      .subscribe((res) => {
        if (res[0].status === 'success') {
          this.loadAPIData();
          this.selections = [];
          this.updateBulkAction();
        } else {
          alert('Unable to delete products');
        }
      }, (err) => { });
    this.confirmDeleteModelOpen = false;
  }

  cancelDelete = () => {
    this.confirmDeleteModelOpen = false;
  }


}
