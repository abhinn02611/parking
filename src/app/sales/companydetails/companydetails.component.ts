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
  selector: 'sistem-company-details',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.scss'],
  providers: [Globals]
})
export class CompanyDetailsComponent implements OnInit {

  menuSwitchStatus = false;
  sidebarFixed = false;
  leftSidebarFixed = false;
  leftStyle: any = {};
  lastOffset = 0;
  topOffset = 0;
  linksBreadcrumb = [];
  companyId = '';
  prices = [];
  images = [];
  company: any;
  loading = true;
  addCompanyModelOpen = false;
  addRelatedCompanyModelOpen = false;
  editId = '';
  currency = '';
  relatedIds = [];
  taskDetail = [];

  @ViewChild('leftcontent') leftcontent: ElementRef;


  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private router: Router, private sharedService: SharedService,
    private salesService: SalesService, private routerExtService: RouterExtService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.companyId = params.id;
      this.getCompanyData();
    });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {

    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((menuSwitchStatus) => {
      this.menuSwitchStatus = menuSwitchStatus;
    });
    // const parts = this.router.url.split('/');
    // this.companyId = parts[parts.length - 1];
    this.currency = this.salesService.currency;
    // this.getCompanyData();

  }


  isArray(val): boolean { return Array.isArray(val); }

  getCompanyData = () => {
    this.loading = true;
    this.sharedService.get(APIS.SALES.COMPANY.GET + this.companyId + '/').subscribe(
      data => {
        if (data[0].status === 'success') {
          this.loading = false;
          this.company = data[0].result[0];

          this.taskDetail = data[0].taskDetail;
          this.taskDetail = this.taskDetail.filter(a => a.sales_task_status !== 'Completed');
          this.linksBreadcrumb = [
            {
              label: 'Sistem'
            }, {
              label: 'Company',
              link: PATHS.MODULE_SALES + PATHS.COMPANY_LIST
            }, {
              label: this.company.store_name,
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

  cancelAddCompany = (refress, reopen) => {
    if (refress) {
      this.getCompanyData();
    }
    this.addCompanyModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addCompanyModelOpen = true;
      }, 10);
    }
  }

  moveToCompany = (id) => {
    this.addCompanyModelOpen = false;
    if (this.editId === '') {
      if (id) {
        this.router.navigate([PATHS.MODULE_SALES + PATHS.COMPANY_DETAILS + id + '/']);
      }
    } else {
      this.getCompanyData();
    }
  }

  openAddNewModel = (edit) => {
    this.editId = '';
    if (edit) {
      this.editId = this.companyId;
    }
    this.addCompanyModelOpen = true;
  }

  addedRelatedCompany = () => {
    this.getCompanyData();
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
      this.router.navigate([PATHS.MODULE_SALES + PATHS.COMPANY_LIST]);
    } else {
      this.router.navigate([preUrl]);
    }
  }

  serRelatedCompanys = (Companys) => {
    
  }
  
}