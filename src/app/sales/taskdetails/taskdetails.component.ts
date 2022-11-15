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
import * as moment from 'moment';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sistem-Task-details',
  templateUrl: './taskdetails.component.html',
  styleUrls: ['./taskdetails.component.scss'],
  providers: [Globals]
})
export class TaskDetailsComponent implements OnInit {

  actions = ACTIONS;
  menuSwitchStatus = false;
  sidebarFixed = false;
  leftSidebarFixed = false;
  leftStyle: any = {};
  lastOffset = 0;
  topOffset = 0;
  linksBreadcrumb = [];
  taskId = '';
  prices = [];
  images = [];
  task: any;
  company: any;
  contact: any;
  loading = true;
  addTaskModelOpen = false;
  confirmDeleteModelOpen = false;
  addRelatedCompanyModelOpen = false;
  editId = '';
  currency = '';
  relatedIds = [];
  headerText = '';

  @ViewChild('leftcontent') leftcontent: ElementRef;


  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private router: Router, private sharedService: SharedService,
    private salesService: SalesService, private routerExtService: RouterExtService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.taskId = params.id;
      this.getTaskData();
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

  @HostListener('window:scroll', [])
  // tslint:disable-next-line:typedef
  onWindowScroll() {

  }

  isArray(val): boolean { return Array.isArray(val); }

  getTaskData = () => {
    this.loading = true;
    this.sharedService.get(APIS.SALES.TASK.GET + this.taskId + '/').subscribe(
      data => {
        if (data[0].status === 'success') {
          this.loading = false;
          this.task = data[0].result[0];
          this.contact = (data[0].contact) ? data[0].contact[0] : null;
          this.company = (data[0].company) ? data[0].company[0] : null;
          if (this.company) {
            this.headerText = this.company.store_name;
          }
          if (this.contact) {
            this.headerText = this.contact.st_contact_fname + ' ' + this.contact.st_contact_last_name;
          }
          this.linksBreadcrumb = [
            {
              label: 'Sistem'
            }, {
              label: 'Task',
              link: PATHS.MODULE_SALES + PATHS.TASK_LIST
            }, {
              label: this.task.sales_task_subject,
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

  cancelAddtask = (refress, reopen) => {
    if (refress) {
      this.getTaskData();
    }
    this.addTaskModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addTaskModelOpen = true;
      }, 10);
    }
  }

  moveTotask = (id) => {
    this.addTaskModelOpen = false;
    if (this.editId === '') {
      if (id) {
        this.router.navigate([PATHS.MODULE_SALES + PATHS.TASK_DETAILS + id + '/']);
      }
    } else {
      this.getTaskData();
    }
  }

  openAddNewModel = (edit) => {
    this.editId = '';
    if (edit) {
      this.editId = this.taskId;
    }
    this.addTaskModelOpen = true;
  }

  addedRelatedCompany = () => {
    this.getTaskData();
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
      this.router.navigate([PATHS.MODULE_SALES + PATHS.TASK_LIST]);
    } else {
      this.router.navigate([preUrl]);
    }
  }

  serRelatedCompanys = (Companys) => {

  }

  formatDate = dt => moment(dt.replace('Z', '')).format('ddd DD MMM YY hh:mm a');

  markComplete = () => {
    this.sharedService.postJson(APIS.SALES.TASK.STATUS, {
      taskStatus: 'Completed',
      taskId: this.taskId, taskAgent: this.sharedService.name
    })
      .subscribe((res) => {
        if (res[0].status === 'success') {
          this.backToList();
        }
      }, (err) => { });
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
    this.backToList();
  }

  cancelDelete = () => {
    this.confirmDeleteModelOpen = false;
  }





}