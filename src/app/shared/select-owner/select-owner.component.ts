import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../shared.service';
import { SalesService } from '../../sales/sales.service';


@Component({
  selector: 'app-select-owner',
  templateUrl: './select-owner.component.html',
  styleUrls: ['./select-owner.component.scss']
})
export class SelectOwnerComponent implements OnInit {

  @Input() selectedContact = '';
  @Input() selectedContacts = [];
  @Input() ownerContact = true;
  @Input() multi = false;
  @Input() self = true;
  @Input() title = 'Choose Owner';
  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();

  contactList: any[];
  contactListView: any[];
  loading = false;
  loaderPrimary = false;
  orderBy = '';
  reverse = true;

  headerMap = {
    logins_name: 'NAME',
    logins_mobile: 'PHONE',
    logins_email: 'EMAIL',
    logins_role: 'ROLE'
  };
  selectall = false;
  searchKeyword = '';
  selectedContactObject = null;
  selectedContactsObject = [];
  constructor(private sharedService: SharedService, private salesService: SalesService) {

  }

  isArray(val): boolean { return Array.isArray(val); }

  inArray = (val, stack) => (stack.findIndex(val) > -1);

  ngOnInit(): void {
    this.loadAPIData();
  }

  loadAPIData = () => {
    this.loading = true;
    const link = this.ownerContact ? APIS.SALES.TEAMS.LIST : APIS.SALES.CONTACT.LIST;
    this.sharedService.get(link + this.salesService.getUserRole() + '/' +
      this.salesService.getUserId() + '/').subscribe(
        data => {
          this.loading = false;
          if (data[0].status === 'success') {
            this.contactList = data[0].joinedMember;
            if (this.self) {
              this.contactList.unshift({
                logins_id: 0,
                logins_name: 'Self',
                logins_mobile: '',
                logins_email: '',
                logins_role: ''
              });
            }
            this.filtercontactList();
          }

        },
        err => {
          this.loading = false;
          console.error(err);
        },
        () => console.log('done loading domain')
      );
  }

  filtercontactList = () => {
    this.contactListView = this.contactList.map((a: any): Array<any> => {
      Object.keys(a).map(k => a[k] = typeof a[k] === 'string' ? a[k].trim() : a[k]);
      if (this.multi === true) {
        const pos = this.selectedContacts.findIndex(b => a.logins_id === b.logins_id);
        if (pos > -1) {
          this.selectedContactsObject.push(a);
        }
      } else {
        if (this.selectedContact === a.logins_id) {
          this.selectedContactObject = a;
        }
      }
      return a;
    });
  }

  updateOrderBy = (type: string) => {
    this.orderBy = type;
    this.reverse = !this.reverse;
  }

  selectItem = (contact: any) => {
    if (this.multi === true) {
      const pos = this.selectedContactsObject.findIndex(a => a.logins_id === contact.logins_id);
      if (pos > -1) {
        this.selectedContactsObject.splice(pos, 1);
      } else {
        this.selectedContactsObject.push(contact);
      }
    } else {
      this.selectedContactObject = contact;
    }
  }

  showResult = () => {
    this.contactListView = this.contactList.filter((a: any) => {
      if (this.searchKeyword.length) {
        if (a.logins_name.toLowerCase().includes(this.searchKeyword.toLowerCase()) === false) {
          return false;
        }
      }
      return true;
    });
  }

  print = (v) => {
    return JSON.stringify(v);
  }

  onPrimary = () => {
    if (this.multi === true) {
      this.actionPrimary.emit(this.selectedContactsObject);
    } else {
      this.actionPrimary.emit(this.selectedContactObject);
    }
  }

  isSelected = (id: any) => {
    if (this.multi === true) {
      const pos = this.selectedContactsObject.findIndex(a => a.logins_id === id);
      return pos > -1;
    } else {
      return this.selectedContactObject && this.selectedContactObject.logins_id === id;
    }
  }

}
