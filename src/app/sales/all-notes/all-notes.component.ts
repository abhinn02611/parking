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
  selector: 'sistem-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.scss'],
  providers: [Globals]
})
export class AllNotesComponent implements OnInit {
  heading = 'All Notes';
  domain = '';
  menuSwitchStatus = false;
  addProductModelOpen = false;
  infoOpen = false;
  sidebarFixed = false;
  editId = '';

  loading = false;
  currency = '';
  orderBy = '';
  tags = [
    '', ''
  ];
  reverse = true;

  headerMap = {
    comment_desc: 'NOTE',
    comment_by: 'CREATED BY',
    comment_date: 'CREATED ON'
  };
  selectall = false;
  selections: Array<any> = [];
  actions = null;
  activeActions = [];

  noteId = '';
  noteType = '';
  linksBreadcrumb = [];

  data = [];
  modalOpen = false;
  activeNote = null;
  editMode = false;
  noteContent = '';

  apiMap = {
    order: {
      add: APIS.SALES.NOTE.ADD_NOTE_ORDER,
      get: APIS.SALES.NOTE.LIST_NOTE_ORDER,
      key: 'orderId',
      label: 'Orders',
      path: PATHS.MODULE_SALES + PATHS.ORDER_LIST
    },
    company: {
      add: APIS.SALES.NOTE.ADD_NOTE_COMPANY,
      get: APIS.SALES.NOTE.LIST_NOTE_COMPANY,
      key: 'storeId',
      label: 'Companies',
      path: PATHS.MODULE_SALES + PATHS.COMPANY_LIST
    },
    contact: {
      add: APIS.SALES.NOTE.ADD_NOTE_CONTACT,
      get: APIS.SALES.NOTE.LIST_NOTE_CONTACT,
      key: 'contactId',
      label: 'Contacts',
      path: PATHS.MODULE_SALES + PATHS.CONTACT_LIST
    }
  };

  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private salesService: SalesService, private routerExtService: RouterExtService,
    private sharedService: SharedService, private router: Router, private route: ActivatedRoute) {
    this.actions = ACTIONS;
    this.route.params.subscribe(params => {
      this.noteId = params.id;
      this.noteType = params.type;
      this.getNotesData();
    });
    this.linksBreadcrumb = [
      {
        label: 'Sistem'
      }, {
        label: this.apiMap[this.noteType].label,
        link: this.apiMap[this.noteType].path
      }, {
        label: 'Attachments',
        bold: true
      }
    ];
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

  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
  }

    createNew = () => {
    this.editMode = false;
    this.modalOpen = true;
    this.noteContent = '';
    this.activeNote = null;
  }

  addNote = () => {

    this.sharedService.postJson(this.apiMap[this.noteType].add, {
      commentBy: this.sharedService.name,
      taskComment: this.noteContent,
      today: this.sharedService.getToday(),
      [this.apiMap[this.noteType].key]: this.noteId,
    })
      .subscribe((res) => {
        if (res[0].status === 'success') {
          console.log('DONE');
          this.getNotesData();
        } else {
          alert('Unable to add contact');
        }
      }, (err) => { });
  }

  updateOrderBy = (type: string) => {
    this.orderBy = type;
    this.tags[1] = 'Sorted by ' + this.headerMap[type];
    this.reverse = !this.reverse;
  }

  getNotesData = () => {
    this.sharedService.get(this.apiMap[this.noteType].get + this.noteId + '/').subscribe(
      data => {
        this.loading = false;
        if (data[0].status === 'success') {
          this.data = data[0].result;
          this.tags[0] = this.data.length + ' items';
        }
      },
      err => {
        console.error(err);
      },
      () => console.log('done uploading')
    );
  }

  openNote = (note) => {
    this.activeNote = note;
    this.modalOpen = true;
    this.noteContent = note.comment_desc;
    this.editMode = true;
  }

  onCancel = () => {
    this.modalOpen = false;
  }



  emitAction = (action) => {

  }

  saveNote = () => {
    this.addNote();
    this.modalOpen = false;
    this.noteContent = '';
  }

  saveNoteWithNew = () => {
    this.addNote();
    this.noteContent = '';
  }

  backToList = () => {
    const preUrl = this.routerExtService.getPreviousUrl();
    if (preUrl === '' || preUrl === '/') {
      this.router.navigate([PATHS.MODULE_SALES + PATHS.PRODUCT_LIST]);
    } else {
      this.router.navigate([preUrl]);
    }
  }

}
