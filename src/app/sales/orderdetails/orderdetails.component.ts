import { Component, OnInit, ViewChild, HostListener, Inject, ElementRef } from '@angular/core';
import { Globals } from '../../classes/globals';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../services/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { RouterExtService } from 'src/app/services/RouterExtService';
import { SalesService } from '../sales.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sistem-order-details',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.scss'],
  providers: [Globals]
})
export class OrderDetailsComponent implements OnInit {

  menuSwitchStatus = false;
  sidebarFixed = false;
  leftSidebarFixed = false;
  leftStyle: any = {};
  lastOffset = 0;
  topOffset = 0;
  linksBreadcrumb = [];
  orderId = '';
  prices = [];
  images = [];
  order: any;
  loading = true;
  addOrderModelOpen = false;
  addRelatedCompanyModelOpen = false;
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
      this.orderId = params.id;
      this.getOrderData();
    });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {

    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((menuSwitchStatus) => {
      this.menuSwitchStatus = menuSwitchStatus;
    });
    // const parts = this.router.url.split('/');
    // this.orderId = parts[parts.length - 1];
    this.currency = this.salesService.currency;
    // this.getOrderData();

  }

  isArray(val): boolean { return Array.isArray(val); }

  getOrderData = () => {
    this.loading = true;
    this.sharedService.get(APIS.SALES.ORDER.GET + this.orderId + '/').subscribe(
      data => {
        if (data[0].status === 'success') {
          this.loading = false;
          this.order = data[0].result[0];
          this.linksBreadcrumb = [
            {
              label: 'Sistem'
            }, {
              label: 'Order',
              link: PATHS.MODULE_SALES + PATHS.ORDER_LIST
            }, {
              label: this.order.store_name,
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

  cancelAddorder = (refress, reopen) => {
    if (refress) {
      this.getOrderData();
    }
    this.addOrderModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addOrderModelOpen = true;
      }, 10);
    }
  }

  moveToorder = (id) => {
    this.addOrderModelOpen = false;
    if (this.editId === '') {
      if (id) {
        this.router.navigate([PATHS.MODULE_SALES + PATHS.ORDER_DETAILS + id + '/']);
      }
    } else {
      this.getOrderData();
    }
  }

  openAddNewModel = (edit) => {
    this.editId = '';
    if (edit) {
      this.editId = this.orderId;
    }
    this.addOrderModelOpen = true;
  }

  addedRelatedCompany = () => {
    this.getOrderData();
    this.addRelatedCompanyModelOpen = false;
  }

  canceledRelatedCompany = () => {
    this.addRelatedCompanyModelOpen = false;
  }

  addRelatedCompany = () => {
    this.addRelatedCompanyModelOpen = true;
  }

  backToList = () => {
    const preUrl = this.routerExtService.getPreviousUrl();
    if (preUrl === '' || preUrl === '/') {
      this.router.navigate([PATHS.MODULE_SALES + PATHS.ORDER_LIST]);
    } else {
      this.router.navigate([preUrl]);
    }
  }

  serRelatedCompanys = (Companys) => {
    
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
    this.sharedService.delete(APIS.SALES.ORDER.DELETE_ORDERS + this.editId + '/')
      .subscribe((res) => {
        if (res[0].status === 'success') {

        } else {
          alert('Unable to delete order');
        }
      }, (err) => { });
    this.backToList();
  }

  cancelDelete = () => {
    this.confirmDeleteModelOpen = false;
  }

 
  
}