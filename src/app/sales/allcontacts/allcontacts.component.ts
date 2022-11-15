import { Component, OnInit, ViewChild, HostListener, Inject } from '@angular/core';
import { Globals } from '../../classes/globals';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../services/window.service';
import { SalesService } from '../sales.service';
import { SharedService } from '../../shared/shared.service';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { Router } from '@angular/router';

@Component({
  selector: 'sistem-allcontact',
  templateUrl: './allcontacts.component.html',
  styleUrls: ['./allcontacts.component.scss'],
  providers: [Globals]
})
export class AllcontactsComponent implements OnInit {
  heading = 'All Contacts';
  domain = '';
  menuSwitchStatus: boolean = false;
  addContactModelOpen: boolean = false;
  infoOpen: boolean = true;
  emails = [{ type: '', email: '' }];
  phones = [{ type: '', phone: '' }];
  sidebarFixed: boolean = false;


  contactList: any[] = [];
  contactListView: Array<any> = [];
  loading = false;
  // currency = '';
  orderBy = '';
  tags = [
    '', ''
  ];
  reverse = true;
  addNewModelOpen = false;
  editId = '';
  headerMap = {
    st_contact_email: 'CUSTOMER EMAIL',
    st_contact_fname: 'CUSTOMER NAME',
    st_contact_reg_date: 'SINCE',
    sales_contact_pin: 'ZIP',
    sales_contact_state: 'STATE',
    sales_contact_address_type: 'TYPE',
    // st_contact_reg_date: 'LAST MODIFIED'
  };
  selectall = false;
  selections = [];

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

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    if (offset > 94 && this.sidebarFixed == false) {
      this.sidebarFixed = true;
    }
    if (offset <= 94 && this.sidebarFixed == true) {
      this.sidebarFixed = false;
    }
  }

  loadAPIData = () => {
    this.loading = true;
    this.salesService.getContacts().subscribe((data) => {
      this.loading = false;
      if (data[0].status === 'success') {
        this.contactList = data[0].result;
        this.tags[0] = this.contactList.length + ' items';
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
    this.contactListView = this.contactList.map(a => {
      a.image = APIS.IMAGE_URL + a.product_thumb;
      a.st_contact_email = a.st_contact_email && a.st_contact_email != 'null' ? a.st_contact_email : 'N/A'
      a.sales_contact_state = a.sales_contact_state ? a.sales_contact_state : 'N/A'
      a.st_contact_reg_date = a.st_contact_reg_date ? a.st_contact_reg_date : 'N/A'
      a.sales_contact_pin = a.sales_contact_pin ? a.sales_contact_pin : 'N/A'
      a.sales_contact_address_type = a.sales_contact_address_type ? a.sales_contact_address_type : 'N/A'
      a.st_contact_reg_date = a.st_contact_reg_date ? a.st_contact_reg_date : 'N/A'
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

  selectItem = (e: any, contact: any) => {
    e.stopPropagation();
    e.preventDefault();
    const index = this.selections.findIndex(a => a === contact.st_contact_id);
    if (index > -1) {
      this.selections.splice(index, 1);
    } else {
      this.selections.push(contact.st_contact_id);
    }
    this.updateBulkAction();
  }

  selectallItem = () => {
    if (this.selectall) {
      this.selections = [];
    } else {
      this.selections = this.contactListView.map(a => a.st_contact_id);
      console.log(this.selections);
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

  switchMenu = (status) => {
    this.menuSwitchStatus = status;
  }

  addMoreEmail = () => {
    this.emails.push({ type: '', email: '' });
  }

  removeEmail = (index) => {
    this.emails.splice(index, 1);
  }

  addMorePhone = () => {
    this.phones.push({ type: '', phone: '' });
  }

  removePhone = (index) => {
    this.phones.splice(index, 1);
  }

  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
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

  editContact = (id) => {
    this.editId = id;
    this.addNewModelOpen = true;
  }

  deleteContact = (id) => {
    const i = this.contactListView.findIndex(a => a.product_id === id);
    this.sharedService.delete(APIS.SALES.CONTACT.DELETE_CONTACT + id + '/' + this.sharedService.xId + '/' +
      this.sharedService.xRole + '/0/0/')
      .subscribe((res) => {
        if (res[0].status === 'success') {
          this.contactListView.splice(i, 1);
        } else {
          alert('Unable to delete contact');
        }
      }, (err) => { });
    console.log('Deleye', id);
  }

  openContactDetails = (id) => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.CONTACT_DETAILS + id]);
  }

  onAction = (action) => {
    if (action === this.actions.DELETE) {
      this.confirmDeleteModelOpen = true;
    }
  }

  confirmDelete = () => {
    this.sharedService.postJson(APIS.SALES.CONTACT.DELETE_CONTACTS, {
      contact: this.selections
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
