import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { BreadcrumbLink } from '../interfaces';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {

  private eventsSubscription: Subscription;
  @Input() add: Observable<void>;
  @Input() type = '';
  @Input() id = '';
  @ViewChild('input') input: ElementRef;

  ac = ACTIONS;
  actions = [ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.SHARE, ACTIONS.EMAIL];
  apiMap = {
    order: {
      add: APIS.SALES.ATTACHMENT.ADD_ORDER,
      get: APIS.SALES.ATTACHMENT.LIST_ORDER,
      key: 'orderId'
    },
    company: {
      add: APIS.SALES.ATTACHMENT.ADD_COMPANY,
      get: APIS.SALES.ATTACHMENT.LIST_COMPANY,
      key: 'companyId'
    },
    contact: {
      add: APIS.SALES.ATTACHMENT.ADD_CONTACT,
      get: APIS.SALES.ATTACHMENT.LIST_CONTACT,
      key: 'contactId'
    }
  };

  loading = false;
  data = [];
  dropdownOpen = false;
  filetype = '';
  viewOpen = false;
  currentIndex = -1;
  maxIndex = -1;
  activeAttachment = null;
  filePath = '';

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.eventsSubscription = this.add.subscribe(() => this.addNewAttachment());
    this.getAttachmentData();
  }

  openLink = (link) => {
    this.router.navigate([link]);
  }

  addNewAttachment = () => {
    const inputField = this.input.nativeElement;
    inputField.click();
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

    this.sharedService.postJson(this.apiMap[this.type].add, {
      images: JSON.stringify([{ id }]),
      [this.apiMap[this.type].key]: this.id,
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

  getAttachmentData = () => {
    this.sharedService.get(this.apiMap[this.type].get + this.id + '/').subscribe(
      data => {
        this.loading = false;
        if (data[0].status === 'success') {
          this.data = data[0].result;
        }
      },
      err => {
        console.error(err);
      },
      () => console.log('done uploading')
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

  openAttachment = (attachment) => {
    this.currentIndex = this.data.findIndex(a => a.attachment_id === attachment.attachment_id);
    this.maxIndex = this.data.length - 1;
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
      this.openAttachment(this.data[this.currentIndex]);
    }
  }

  backAttachment = () => {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.openAttachment(this.data[this.currentIndex]);
    }
  }

  shouldDisplayGroupAction = (action) => {
    return this.actions.findIndex(a => a === action) > -1;
  }

  toggleDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  emitAction = (action) => {

  }

  viewAllAttachments = () => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.ATTACHMENT_LIST, this.type, this.id]);
  }


}
