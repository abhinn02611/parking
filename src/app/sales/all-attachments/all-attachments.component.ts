import { Component, OnInit, ViewChild, HostListener, Inject, ElementRef } from '@angular/core';
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
  selector: 'sistem-all-attachments',
  templateUrl: './all-attachments.component.html',
  styleUrls: ['./all-attachments.component.scss'],
  // providers: [Globals]
})
export class AllAttachmentsComponent implements OnInit {
  heading = 'All Attachments';
  typeLabel = '';
  domain = '';
  menuSwitchStatus = false;
  addProductModelOpen = false;
  infoOpen = false;
  sidebarFixed = false;
  editId = '';

  productList: any[];
  productListView: any[];
  loading = false;
  currency = '';
  orderBy = '';
  tags = [
    '', ''
  ];
  reverse = true;

  headerMap = {
    original_name: 'ATTACHMENT NAME',
    attachment_add_by: 'CREATED BY',
    attachment_add_date: 'CREATED ON'
  };
  selectall = false;
  selections: Array<any> = [];
  actions = null;
  activeActions = [];
  confirmDeleteModelOpen = false;
  attachments = [];
  attachmentId = '';
  attachmentType = '';
  linksBreadcrumb = [];
  ac = ACTIONS;
  actionsView = [ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.SHARE, ACTIONS.EMAIL];


  dropdownOpen = false;
  filetype = '';
  viewOpen = false;
  currentIndex = -1;
  maxIndex = -1;
  activeAttachment = null;
  filePath = '';


  apiMap = {
    order: {
      add: APIS.SALES.ATTACHMENT.ADD_ORDER,
      get: APIS.SALES.ATTACHMENT.LIST_ORDER,
      key: 'orderId',
      label: 'Orders',
      path: PATHS.MODULE_SALES + PATHS.ORDER_LIST
    },
    company: {
      add: APIS.SALES.ATTACHMENT.ADD_COMPANY,
      get: APIS.SALES.ATTACHMENT.LIST_COMPANY,
      key: 'companyId',
      label: 'Companies',
      path: PATHS.MODULE_SALES + PATHS.COMPANY_LIST
    },
    contact: {
      add: APIS.SALES.ATTACHMENT.ADD_CONTACT,
      get: APIS.SALES.ATTACHMENT.LIST_CONTACT,
      key: 'contactId',
      label: 'Contacts',
      path: PATHS.MODULE_SALES + PATHS.CONTACT_LIST
    }
  };

  @ViewChild('input') input: ElementRef;

  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window, private salesService: SalesService, private routerExtService: RouterExtService,
    private sharedService: SharedService, private router: Router, private route: ActivatedRoute) {
      
    this.actions = ACTIONS;
    this.route.params.subscribe(params => {
      this.attachmentId = params.id;
      this.attachmentType = params.type;
      this.getAttachmentData();
      this.typeLabel = this.apiMap[this.attachmentType].label;
    });
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

  getAttachmentData = () => {
    this.loading = true;
    this.sharedService.get(this.apiMap[this.attachmentType].get + this.attachmentId + '/').subscribe(
      data => {
        this.loading = false;
        if (data[0].status === 'success') {
          this.attachments = data[0].result;
        }
        this.linksBreadcrumb = [
          {
            label: 'Sistem'
          }, {
            label: this.apiMap[this.attachmentType].label,
            link: this.apiMap[this.attachmentType].path
          }, {
            label: 'Attachments',
            bold: true
          }
        ];
      },
      err => {
        console.error(err);
      },
      () => console.log('done loading attachments')
    );
  }

  getImagePath = (attachment) => {
    if (attachment.small_url) {
      const ext = attachment.small_url.split('.').pop().toLowerCase();
      if (ext === 'jpg' || ext === 'png' || ext === 'jpeg' || ext === 'gif') {
        return attachment.small_url;
      }
    }
    return '/assets/images/icons/file_icon.png';
  }

  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
  }

  filterProductList = () => {
    this.currency = this.salesService.currency;
    this.productListView = this.productList.map((a: any): Array<any> => {
      try {
        const mrp = JSON.parse(a.product_mrp);
        a.mrp = mrp[0].mrp;
        a.image = APIS.IMAGE_URL + a.product_thumb;
      } catch (e) {
        a.mrp = 0;
        a.image = '';
      }

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

  selectItem = (e: any, product: any) => {
    e.stopPropagation();
    e.preventDefault();
    const index = this.selections.findIndex(a => a === product.product_id);
    if (index > -1) {
      this.selections.splice(index, 1);
    } else {
      this.selections.push(product.product_id);
    }
    this.updateBulkAction();
  }

  selectallItem = () => {
    if (this.selectall) {
      this.selections = [];
    } else {
      this.selections = this.productListView.map(a => a.product_id);
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

  editProduct = (id) => {
    this.editId = id;
    this.addProductModelOpen = true;
  }

  deleteProduct = (id) => {
    const i = this.productListView.findIndex(a => a.product_id === id);
    this.sharedService.delete(APIS.SALES.PRODUCT.DELETE_PRODUCT + id + '/')
      .subscribe((res) => {
        if (res[0].status === 'success') {
          this.productListView.splice(i, 1);
        } else {
          alert('Unable to delete product');
        }
      }, (err) => { });
    console.log('Deleye', id);
  }

  isArray(val): boolean { return Array.isArray(val); }

  openProductDetails = (id) => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.PRODUCT_DETAILS + id]);
  }


  onAction = (action) => {
    if (action === this.actions.DELETE) {
      this.confirmDeleteModelOpen = true;
    }
  }



  backToList = () => {
    const preUrl = this.routerExtService.getPreviousUrl();
    if (preUrl === '' || preUrl === '/') {
      this.router.navigate([PATHS.MODULE_SALES + PATHS.PRODUCT_LIST]);
    } else {
      this.router.navigate([preUrl]);
    }
  }

  addAttachment = () => {
    const inputField = this.input.nativeElement;
    inputField.click();
  }





  openAttachment = (attachment) => {
    this.currentIndex = this.attachments.findIndex(a => a.attachment_id === attachment.attachment_id);
    this.maxIndex = this.attachments.length - 1;
    this.filetype = '';
    if (attachment.large_url) {
      const ext = attachment.large_url.split('.').pop().toLowerCase();
      if (ext === 'jpg' || ext === 'png' || ext === 'jpeg' || ext === 'gif') {
        this.filetype = 'image';
      } else {
        this.filetype = 'file';
      }
      this.filePath = attachment.large_url;
    } else if (attachment.medium_url) {
      const ext = attachment.medium_url.split('.').pop().toLowerCase();
      if (ext === 'jpg' || ext === 'png' || ext === 'jpeg' || ext === 'gif') {
        this.filetype = 'image';
      } else {
        this.filetype = 'file';
      }
      this.filePath = attachment.medium_url;
    }
    this.activeAttachment = attachment;
    this.viewOpen = true;
  }

  closeAttachment = () => {
    this.viewOpen = false;
  }

  nextAttachment = () => {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.openAttachment(this.attachments[this.currentIndex]);
    }
  }

  backAttachment = () => {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.openAttachment(this.attachments[this.currentIndex]);
    }
  }

  shouldDisplayGroupAction = (action) => {
    return this.actionsView.findIndex(a => a === action) > -1;
  }

  toggleDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }


  uploadFileInput = (e) => {
    const files = e.target.files;
    this.loading = true;
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      // formData.append('file[' + i + ']', files[i], files[i].name);
      formData.append('file', files[i], files[i].name);
    }
    formData.append('type', 'attachment');
    this.sharedService.uploadAttachment(formData).subscribe(
      data => {
        if (data[0].status === 'success') {
          const id = data[0].result;
          setTimeout(() => {
            this.addFile(id);
          }, 0);
        }
        this.loading = false;
      },
      err => {
        this.loading = false;
        console.error(err);
      },
      () => console.log('done uploading')
    );
  }

  addFile = (id) => {
    this.sharedService.postJson(this.apiMap[this.attachmentType].add, {
      images: JSON.stringify([{ id }]),
      [this.apiMap[this.attachmentType].key]: this.attachmentId,
    })
      .subscribe((res) => {
        if (res[0].status === 'success') {
          console.log('DONE');
          this.getAttachmentData();
        } else {
          alert('Unable to add contact');
        }
      }, (err) => { });
  }

}
