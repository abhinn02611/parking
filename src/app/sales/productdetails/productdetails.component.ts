import { Component, OnInit, ViewChild, HostListener, Inject, ElementRef } from '@angular/core';
import { Globals } from '../../classes/globals';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../services/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { RouterExtService } from 'src/app/services/RouterExtService';
import { SalesService } from '../sales.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sistem-product-details',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss'],
  providers: [Globals]
})
export class ProductDetailsComponent implements OnInit {

  menuSwitchStatus = false;
  sidebarFixed = false;
  leftSidebarFixed = false;
  leftStyle: any = {};
  lastOffset = 0;
  topOffset = 0;
  linksBreadcrumb = [];
  productId = '';
  prices = [];
  images = [];
  product: any;
  loading = true;
  addProductModelOpen = false;
  addRelatedProductModelOpen = false;
  editId = '';
  currency = '';
  relatedIds = [];
  confirmDeleteModelOpen = false;
  actions = ACTIONS;

  @ViewChild('leftcontent') leftcontent: ElementRef;


  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private router: Router, private sharedService: SharedService,
    private salesService: SalesService, private routerExtService: RouterExtService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.productId = params.id;
      this.getProductData();
    });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {

    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((menuSwitchStatus) => {
      this.menuSwitchStatus = menuSwitchStatus;
    });
    // const parts = this.router.url.split('/');
    // this.productId = parts[parts.length - 1];
    this.currency = this.salesService.currency;
    // this.getProductData();

  }



  isArray(val): boolean { return Array.isArray(val); }

  getProductData = () => {
    this.loading = true;
    this.sharedService.get(APIS.SALES.PRODUCT.GET + this.productId + '/').subscribe(
      data => {
        if (data[0].status === 'success') {
          this.loading = false;
          this.product = data[0].result;
          this.images = [];
          if (this.isArray(this.product.images)) {
            this.images = this.product.images;
          }
          try {
            this.prices = [];
            const prices = JSON.parse(this.product.product_mrp);
            for (const p of prices) {
              const keys = Object.keys(p);
              for (const k of keys) {
                if (p[k] > 0) {
                  this.prices.push({ type: k, price: p[k] });
                }
              }
            }
          } catch (e) {

          }
          this.relatedIds = this.product.related_product.map(a => a.product_id);
          console.log('product', this.product);
          this.linksBreadcrumb = [
            {
              label: 'Sistem'
            }, {
              label: 'Products',
              link: PATHS.MODULE_SALES + PATHS.PRODUCT_LIST
            }, {
              label: this.product.category_name,
              link: PATHS.MODULE_SALES + PATHS.PRODUCT_LIST
            }, {
              label: this.product.product_name,
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

  cancelAddProduct = (refress, reopen) => {
    if (refress) {
      this.getProductData();
    }
    this.addProductModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addProductModelOpen = true;
      }, 10);
    }
  }

  moveToProduct = (id) => {
    this.addProductModelOpen = false;
    if (this.editId === '') {
      if (id) {
        this.router.navigate([PATHS.MODULE_SALES + PATHS.PRODUCT_DETAILS + id + '/']);
      }
    } else {
      this.getProductData();
    }
  }

  openAddNewModel = (edit) => {
    this.editId = '';
    if (edit) {
      this.editId = this.productId;
    }
    this.addProductModelOpen = true;
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

  backToList = () => {
    const preUrl = this.routerExtService.getPreviousUrl();
    if (preUrl === '' || preUrl === '/') {
      this.router.navigate([PATHS.MODULE_SALES + PATHS.PRODUCT_LIST]);
    } else {
      this.router.navigate([preUrl]);
    }
  }

  serRelatedProducts = (products) => {

  }

  onAction = (action) => {
    if (action === this.actions.EDIT) {
      this.openAddNewModel(true);
    }

    if (action === this.actions.DELETE) {
      this.confirmDeleteModelOpen = true;
    }
  }

  confirmDelete = () => {
    this.sharedService.delete(APIS.SALES.PRODUCT.DELETE_PRODUCT + this.editId + '/')
      .subscribe((res) => {
        if (res[0].status === 'success') {

        } else {
          alert('Unable to delete product');
        }
      }, (err) => { });
    this.backToList();
  }

  cancelDelete = () => {
    this.confirmDeleteModelOpen = false;
  }

}
