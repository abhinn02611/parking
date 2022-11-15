import { Component, OnInit, ViewChild, HostListener, Inject, ElementRef } from '@angular/core';
import { Globals } from '../classes/globals';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../services/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { RouterExtService } from 'src/app/services/RouterExtService';
import { SalesService } from '../sales/sales.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sistem-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [Globals]
})
export class SettingsComponent implements OnInit {

  menuSwitchStatus = false;
  sidebarFixed = false;
  leftSidebarFixed = false;
  leftStyle: any = {};
  lastOffset = 0;
  topOffset = 0;
  linksBreadcrumb = [];
  contactId = '';
  prices = [];
  images = [];
  contact: any;
  loading = true;
  addContactModelOpen = false;
  editId = '';
  currency = '';
  relatedIds = [];

  @ViewChild('leftcontent') leftcontent: ElementRef;


  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private router: Router, private sharedService: SharedService,
    private salesService: SalesService, private routerExtService: RouterExtService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.contactId = params.id;
      this.getContactData();
      this.ngOnInit();
    });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((menuSwitchStatus) => {
      this.menuSwitchStatus = menuSwitchStatus;
    });
    this.currency = this.salesService.currency;
  }
  
  isArray(val): boolean { return Array.isArray(val); }

  getContactData = () => {
    this.loading = true;
    this.sharedService.get(APIS.SALES.CONTACT.GET + this.contactId + '/').subscribe(
      data => {
        if (data[0].status === 'success') {
          this.loading = false;
          this.contact = data[0].result[0];
          if (this.contact.st_contact_mobile2 !== '') {
            this.contact.st_contact_mobile2 = JSON.parse(this.contact.st_contact_mobile2);
          }
          if (this.contact.st_contact_social_links !== '') {
            this.contact.st_contact_social_links = JSON.parse(this.contact.st_contact_social_links);
          }
          this.linksBreadcrumb = [
            {
              label: 'Sistem'
            }, {
              label: 'Contact',
              link: PATHS.MODULE_SALES + PATHS.CONTACT_LIST
            }, {
              label: this.contact.st_contact_fname + ' ' + this.contact.st_contact_last_name,
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

  cancelAddContact = (refress, reopen) => {
    if (refress) {
      this.getContactData();
    }
    this.addContactModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addContactModelOpen = true;
      }, 10);
    }
  }


  openAddNewModel = (edit) => {
    this.editId = '';
    if (edit) {
      this.editId = this.contactId;
    }
    this.addContactModelOpen = true;
  }


  backToList = () => {
    const preUrl = this.routerExtService.getPreviousUrl();
    if (preUrl === '' || preUrl === '/') {
      this.router.navigate([PATHS.MODULE_SALES + PATHS.CONTACT_LIST]);
    } else {
      this.router.navigate([preUrl]);
    }
  }


}