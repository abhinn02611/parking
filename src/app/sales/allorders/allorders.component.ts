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
  selector: 'sistem-allorders',
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss'],
  providers: [Globals]
})
export class AllordersComponent implements OnInit {
  heading = 'All Orders';
  domain = '';
  menuSwitchStatus = false;
  addNewModelOpen = false;
  infoOpen = false;
  sidebarFixed = false;
  editId = '';

  orderList: any[];
  orderListView: any[];
  loading = false;
  currency = '';
  orderBy = '';
  tags = [
    '', ''
  ];
  reverse = true;
  headers = [];
  headerMap = {
    sales_orders_uniq_id: 'NO.',
    sales_orders_amount: 'TOTAL',
    store_name: 'COMPANY',
    st_contact_fname: 'CONTACT',
    sales_orders_status: 'STATUS',
    sales_orders_date: 'CREATED ON',
    sales_orders_create_by: 'OWNER'
  };
  selectall = false;
  selections: Array<any> = [];

  actions = null;
  activeActions = [];
  confirmDeleteModelOpen = false;

  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private salesService: SalesService,
    private sharedService: SharedService, private router: Router) {
    this.headers = Object.keys(this.headerMap);
    this.actions = ACTIONS;
  }

  ngOnInit() {
    this.currency = this.salesService.currency;
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

  cancelAddNew = (refress, reopen) => {
    if (refress) {
      this.loadAPIData();
    }
    this.addNewModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addNewModelOpen = true;
      }, 10);
    }
  }

  openAddNewModel = () => {
    this.editId = '';
    this.addNewModelOpen = true;
  }



  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
  }

  loadAPIData = () => {
    this.loading = true;
    this.sharedService.get(APIS.SALES.ORDER.LIST + this.salesService.getUserRole() + '/' +
      this.salesService.getUserId() + '/').subscribe(
        data => {
          this.loading = false;
          if (data[0].status === 'success') {
            this.orderList = data[0].result;
            this.tags[0] = this.orderList.length + ' items';
            this.filterorderList();
          }
        },
        err => {
          this.loading = false;
          console.error(err);
        },
        () => console.log('done loading domain')
      );
  }

  filterorderList = () => {
    this.orderListView = this.orderList.map((a: any): Array<any> => {
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

  selectItem = (e: any, item: any) => {
    e.stopPropagation();
    e.preventDefault();
    const index = this.selections.findIndex(a => a === item.sales_orders_uniq_id);
    if (index > -1) {
      this.selections.splice(index, 1);
    } else {
      this.selections.push(item.sales_orders_uniq_id);
    }
    this.updateBulkAction();
  }

  selectallItem = () => {
    if (this.selectall) {
      this.selections = [];
    } else {
      this.selections = this.orderListView.map(a => a.sales_orders_uniq_id);
    }
    this.selectall = !this.selectall;
    this.updateBulkAction();
  }

  editOrder = (id) => {
    this.editId = id;
    this.addNewModelOpen = true;
  }

  deleteItem = (id) => {
    const i = this.orderListView.findIndex(a => a.store_id === id);
    this.sharedService.delete(APIS.SALES.ORDER.DELETE_ORDER + id + '/' +
      this.salesService.getUserId() + '/' + this.salesService.getUserRole() + '/0/0/')
      .subscribe((res) => {
        if (res[0].status === 'success') {
          this.orderListView.splice(i, 1);
        } else {
          alert('Unable to delete order');
        }
      }, (err) => { });
    console.log('Deleted', id);
  }

  isArray(val): boolean { return Array.isArray(val); }

  openOrderDetails = (id) => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.ORDER_DETAILS + id]);
  }

  print(v) { return JSON.stringify(v) }

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
  
  onAction = (action) => {
    if (action === this.actions.DELETE) {
      this.confirmDeleteModelOpen = true;
    }
  }

  confirmDelete = () => {
    this.sharedService.postJson(APIS.SALES.ORDER.DELETE_ORDERS, {
      salesArray: this.selections
    })
      .subscribe((res) => {
        if (res[0].status === 'success') {
          this.loadAPIData();
          this.selections = [];
          this.updateBulkAction();
        } else {
          alert('Unable to delete orders');
        }
      }, (err) => { });
    this.confirmDeleteModelOpen = false;
  }

  cancelDelete = () => {
    this.confirmDeleteModelOpen = false;
  }

}
