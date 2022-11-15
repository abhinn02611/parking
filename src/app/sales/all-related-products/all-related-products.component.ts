import { Component, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { Globals } from '../../classes/globals';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../services/window.service';
import { SalesService } from '../sales.service';
import { SharedService } from '../../shared/shared.service';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterExtService } from 'src/app/services/RouterExtService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sistem-all-related-products',
  templateUrl: './all-related-products.component.html',
  styleUrls: ['./all-related-products.component.scss'],
  providers: [Globals]
})
export class AllRelatedProductsComponent implements OnInit {
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
  productId = '';
  relatedIds = [];
  product: any = null;
  linksBreadcrumb = [];
  addRelatedProductModelOpen = false;

  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private salesService: SalesService, private routerExtService: RouterExtService,
    private sharedService: SharedService, private router: Router, private route: ActivatedRoute) {
    this.actions = ACTIONS;
    this.route.params.subscribe(params => {
      this.productId = params.id;
      this.getProductData();
    });
  }

  ngOnInit() {
    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((menuSwitchStatus) => {
      this.menuSwitchStatus = menuSwitchStatus;
    });
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

  getProductData = () => {
    this.loading = true;
    this.sharedService.get(APIS.SALES.PRODUCT.GET + this.productId + '/').subscribe(
      data => {
        if (data[0].status === 'success') {
          this.loading = false;
          this.product = data[0].result;
          this.relatedIds = this.product.related_product.map(a => a.product_id);
          this.productList = this.product.related_product;
          this.tags[0] = this.productList.length + ' items';
          this.filterProductList();

          this.linksBreadcrumb = [
            {
              label: 'Sistem'
            }, {
              label: 'Products',
              link: PATHS.MODULE_SALES + PATHS.PRODUCT_LIST
            }, {
              label: this.product.product_name,
              link: PATHS.MODULE_SALES + PATHS.PRODUCT_DETAILS + this.productId
            }, {
              label: 'Related Products',
              bold: true
            }
          ];
        }
      },
      err => {
        console.error(err);
      },
      () => console.log('done uploading')
    );
  }

 


  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
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



  backToList = () => {
    const preUrl = this.routerExtService.getPreviousUrl();
    if (preUrl === '' || preUrl === '/') {
      this.router.navigate([PATHS.MODULE_SALES + PATHS.PRODUCT_LIST]);
    } else {
      this.router.navigate([preUrl]);
    }
  } 

  addedRelatedProduct = () => {
    this.getProductData();
    this.addRelatedProductModelOpen = false;
  }

  canceledRelatedProduct = () => {
    this.addRelatedProductModelOpen = false;
  }

  addRelatedProduct = () => {
    this.addRelatedProductModelOpen = true;
  }

}
