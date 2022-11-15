import { Component, OnInit, ViewChild, HostListener, Inject, ElementRef } from '@angular/core';
import { Globals } from '../../classes/globals';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../services/window.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { RouterExtService } from 'src/app/services/RouterExtService';
import { SalesService } from '../sales.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sistem-contact-details',
  templateUrl: './contactdetails.component.html',
  styleUrls: ['./contactdetails.component.scss'],
  providers: [Globals]
})
export class ContactDetailsComponent implements OnInit {

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
  taskDetail = [];


  @ViewChild('leftcontent') leftcontent: ElementRef;


  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private router: Router, private sharedService: SharedService,
    private salesService: SalesService, private routerExtService: RouterExtService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.contactId = params.id;
      this.getContactData();
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

  // @HostListener('window:scroll', [])
  // // tslint:disable-next-line:typedef
  // onWindowScroll() {
  //   const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
  //   const direction = (this.lastOffset > offset) ? 0 : 1;
  //   const topSpace = 64 + 81 + 40;
  //   const headerHeight = 64;
  //   const topSpaceBelowHeader = 81 + 40;
  //   this.lastOffset = offset;
  //   const height = this.leftcontent.nativeElement.offsetHeight;
  //   if (height > window.innerHeight - topSpace) {
  //     // console.log("offset", offset);
  //     // console.log("height", height);
  //     // console.log("window.innerHeight", window.innerHeight);
  //     // console.log("topSpace", topSpace);
  //     // console.log("Direction=",direction);
  //     // console.log("this.topOffset=",this.topOffset);
  //     // console.log("this.leftStyle.section=",this.leftStyle.section);
  //     // console.log("height - window.innerHeight + topSpace",height - window.innerHeight + topSpace);
  //     // console.log("offset + this.topOffset > height",offset + this.topOffset );

  //     if (direction === 1) {
  //       if (this.leftStyle.position !== 'fixed') {
  //         if (offset + this.topOffset > topSpaceBelowHeader && this.leftStyle.section !== '4') {
  //           this.topOffset = height - window.innerHeight;
  //           this.leftStyle = { position: 'fixed', top: headerHeight + 'px', section: '1' };
  //         } else {
  //           if (offset + this.topOffset > height - window.innerHeight + topSpace && this.leftStyle.section !== '6') {
  //             this.topOffset = offset + window.innerHeight - height - topSpace;
  //             this.leftStyle = { position: 'absolute', top: (this.topOffset) + 'px', section: '4' };
  //           }
  //         }
  //       } else {
  //         if (offset > topSpace && this.leftStyle.section !== '1') {
  //           this.topOffset = topSpace;
  //           this.leftStyle = { position: 'absolute', top: '-' + this.topOffset + 'px', section: '3' };
  //         }
  //       }
  //     }
  //     if (direction === 0) {
  //       if (this.leftStyle.position !== 'absolute') {
  //         if (offset + this.topOffset > height - window.innerHeight + topSpace && this.leftStyle.section !== '6') {
  //           this.topOffset = offset + window.innerHeight - height - topSpace;
  //           this.leftStyle = { position: 'absolute', top: (this.topOffset + topSpace - headerHeight) + 'px', section: '4' };
  //         }

  //         if (offset < topSpace - 64 && (this.leftStyle.section === '6' || this.leftStyle.section === '5')) {
  //           this.topOffset = 0;
  //           this.leftStyle = { position: 'absolute', top: (this.topOffset) + 'px', section: '7' };
  //         }
  //       } else {
  //         if (offset - 64 < this.topOffset - topSpace && this.leftStyle.section !== '4' && this.leftStyle.section !== '2') {
  //           this.topOffset = 64;
  //           this.leftStyle = { position: 'fixed', top: (this.topOffset) + 'px', section: '5' };
  //         }
  //         if (offset < this.topOffset + topSpace - 64 && this.leftStyle.section === '4') {
  //           this.topOffset = 64;
  //           this.leftStyle = { position: 'fixed', top: (this.topOffset) + 'px', section: '6' };
  //         }
  //       }
  //     }
  //   } else {
  //     if (offset > 94 && this.leftSidebarFixed === false) {
  //       this.leftSidebarFixed = true;
  //     }
  //     if (offset <= 94 && this.leftSidebarFixed === true) {
  //       this.leftSidebarFixed = false;
  //     }
  //   }

  //   // console.log(this.leftStyle);
  //   // console.log(offset);

  //   if (offset > topSpace - 64 && this.sidebarFixed === false) {
  //     this.sidebarFixed = true;
  //   }
  //   if (offset <= topSpace - 64 && this.sidebarFixed === true) {
  //     this.sidebarFixed = false;
  //   }
  // }

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
          console.log('this.contact', this.contact);
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