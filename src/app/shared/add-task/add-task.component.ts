import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../shared.service';
import { SalesService } from '../../sales/sales.service';
import * as moment from 'moment';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  @Input() editId = '';
  @Input() refId = '';
  @Input() refType = '';
  @Input() refDesc = '';
  @Input() refCompany = null;
  @Input() refContact = null;

  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  repeat = [
    { label: 'Never', value: 'Never' },
    { label: 'Every Day', value: 'Every Day' },
    { label: 'Every Week', value: 'Every Week' },
    { label: 'Every Month', value: 'Every Month' }
  ];
  status = [
    { label: 'Not Started', value: 'Not Started' },
    { label: 'Completed', value: 'Completed' }
  ];
  priority = [
    { label: 'Normal', value: 'Normal' },
    { label: 'High', value: 'High' },
    { label: 'Low', value: 'Low' }
  ];

  relatedToCompanies = [];
  relatedToContacts = [];
  invitees = [];

  formData = {
    taskEventDate: null,
    refId: this.refId,
    refType: this.refType,
    taskSubject: '',
    taskType: '',
    relatedTo: '',
    relatedToType: '',
    taskDueDate: '',
    taskDueTime: '',
    repeat: '',
    taskOwner: '',
    taskPriority: 'Normal',
    taskStatus: 'Not Started',
    contactName: '',
    assignedTo: '',
    assignedToName: '',
    taskAccountcompany: null,
    storeName: '',
    taskDesc: this.refDesc,
    locLongtitute: 0,
    locLatitute: 0,
    taskCallType: null,
  };
  showRelatedCompany = false;
  showRelatedContact = false;
  showOwnerContact = false;
  showInviteContact = false;
  showInviteModal = false;
  showAddType = false;

  timeIntervals = [];

  constructor(private sharedService: SharedService, private salesService: SalesService) {
    this.timeIntervals = this.intervals();
  }

  isArray(val): boolean { return Array.isArray(val); }

  ngOnInit(): void {
    this.formData.taskOwner = this.sharedService.name;
    if (this.editId !== '') {
      this.sharedService.get(APIS.SALES.TASK.GET + this.editId + '/').subscribe(
        data => {
          if (data[0].status === 'success') {
            const contact = (data[0].contact) ? data[0].contact[0] : null;
            const company = (data[0].company) ? data[0].company[0] : null;
            const task = data[0].result[0];
            const dm = moment(task.sales_task_due_date);
            this.formData = {
              refId: this.refId,
              refType: this.refType,
              taskEventDate: task.sales_task_due_date,
              taskSubject: task.sales_task_subject,
              taskType: task.sales_task_type,
              relatedTo: (contact) ? contact.st_contact_fname + ' ' + contact.st_contact_last_name : (company) ? company.store_name : '',
              relatedToType: (contact) ? 'Contact' : (company) ? 'Company' : '',
              taskDueDate: dm.format('ddd DD MMM YY'),
              taskDueTime: dm.format('hh:mm a'),
              repeat: '',
              taskOwner: task.sales_task_owner,
              taskPriority: task.sales_task_priority,
              taskStatus: task.sales_task_status,
              contactName: (contact) ? contact.st_contact_fname + ' ' + contact.st_contact_last_name : '',
              assignedTo: '',
              assignedToName: '',
              taskAccountcompany: (company) ? company.store_id : '',
              storeName: (company) ? company.store_name : '',
              taskDesc: task.sales_task_desc,
              locLongtitute: 0,
              locLatitute: 0,
              taskCallType: task.sales_task_call_type,
            };
            if (contact) {
              this.relatedToContacts = [contact];
              this.formData.assignedTo = contact[0].st_contact_id;
            }
            if (company) {
              this.relatedToCompanies = [company];
              this.formData.taskAccountcompany = company.store_id;
            }
            console.log('this.formData', this.formData);
          }
        },
        err => {
          console.error(err);
        },
        () => console.log('done uploading')
      );
    } else {
      this.formData.taskDesc = this.refDesc;
      this.formData.refId = this.refId;
      this.formData.refType = this.refType;
      if (this.refCompany) {
        this.formData.relatedTo = this.refCompany.store_name;
        this.formData.relatedToType = 'Company';
        this.relatedToCompanies = [this.refCompany];
        this.formData.taskAccountcompany = this.refCompany.store_id;
      }
      if (this.refContact) {
        this.formData.relatedTo = this.refContact.st_contact_fname + ' ' + this.refContact.st_contact_last_name;
        this.formData.relatedToType = 'Contact';
        this.relatedToContacts = [this.refContact];
      }
    }
  }

  intervals = () => {
    const start = moment('2021-01-01 00:00 am', 'YYYY-MM-DD hh:mm a');
    const end = moment('2021-01-01 11:45 pm', 'YYYY-MM-DD hh:mm a');
    start.minutes(Math.ceil(start.minutes() / 15) * 15);
    const result = [];
    const current = moment(start);
    while (current <= end) {
      const time = current.format('hh:mm a');
      result.push({ label: time, value: time });
      current.add(15, 'minutes');
    }
    return result;
  }


  onCancel = () => {
    this.actionCancel.emit();
  }
  onPrimary = () => {
    this.saveTask(1);
  }
  onSecondry = () => {
    this.saveTask(2);
  }

  setType = (type) => {
    this.formData.taskType = type;
  }

  openUpdateCategoryModal = () => {
  }

  openUpdateTypeModal = () => {
    this.showAddType = true;
  }


  print = (v) => {
    return JSON.stringify(v);
  }

  openRelatedCompanyDD = () => {
    this.showRelatedCompany = true;
  }

  cancelRelatedCompany = (e) => {
    this.showRelatedCompany = false;
  }

  selectRelatedCompany = (company) => {
    // this.formData.taskAccountcompany = company.store_id;
    // this.formData.storeName = company.store_name;
    // this.formData.relatedTo = company.store_name;
    this.formData.relatedToType = 'Company';
    this.relatedToCompanies = company;
    this.formData.taskAccountcompany = company[0].store_id;
    if (company.length === 1) {
      this.formData.storeName = company[0].store_name;
      this.formData.relatedTo = company[0].store_name;
    } else {
      this.formData.storeName = 'Multiple Companies';
      this.formData.relatedTo = 'Multiple Companies';
    }
    this.showRelatedCompany = false;
  }


  openRelatedContactDD = () => {
    this.showRelatedContact = true;
  }

  cancelRelatedContact = () => {
    this.showRelatedContact = false;
  }

  selectRelatedContact = (contact) => {
    // this.formData.assignedTo = contact.st_contact_id;
    // this.formData.contactName = contact.st_contact_fname + ' ' + contact.st_contact_last_name;
    // this.formData.relatedTo = this.formData.contactName;
    this.formData.relatedToType = 'Contact';
    this.relatedToContacts = contact;
    this.formData.assignedTo = contact[0].st_contact_id;
    if (contact.length === 1) {
      this.formData.contactName = contact[0].st_contact_fname + ' ' + contact[0].st_contact_last_name;
      this.formData.relatedTo = contact[0].st_contact_fname + ' ' + contact[0].st_contact_last_name;
    } else {
      this.formData.contactName = 'Multiple Contacts';
      this.formData.relatedTo = 'Multiple Contacts';
    }
    this.showRelatedContact = false;
  }

  actionSelectDD = (type, key) => {
    this.formData[key] = type.value;
  }

  openOwnerContactDD = (e) => {
    this.showOwnerContact = true;
  }

  cancelOwnerContact = () => {
    this.showOwnerContact = false;
  }

  selectOwnerContact = (owner) => {
    this.formData.taskOwner = owner.logins_name;
    this.showOwnerContact = false;
  }

  addProductSelected = (invitee) => {
    console.log('products', invitee);
  }

  addMoreInvite = () => {
    this.showInviteModal = true;
  }

  addMoreInviteCancel = () => {
    this.showInviteModal = false;
  }

  addMoreInviteeSelected = (invitees) => {
    this.showInviteModal = false;
    console.log('invitee', invitees);
    for (const p of invitees) {
      this.invitees.push({
        role: p.role,
        id: p.id,
        profile_pic: p.profile_pic,
        name: p.name
      });
    }
  }

  saveTask = (nextAction) => {
    const finalData = JSON.parse(JSON.stringify(this.formData));
    finalData.taskDueDate = moment(finalData.taskDueDate + ' ' + finalData.taskDueTime).format('YYYY-MM-DD HH:mm:ss');
    if (this.editId !== '') {
      finalData.taskId = this.editId;
      this.sharedService.postJson(APIS.SALES.TASK.UPDATE_TASK, finalData)
        .subscribe((res) => {
          this.processResponse(res, nextAction);
        }, (err) => { });
    } else {
      let entryTypeSingle = true;
      if (this.formData.relatedToType === 'Company' && this.relatedToCompanies.length > 1) {
        entryTypeSingle = false;
      }
      if (this.formData.relatedToType === 'Contact' && this.relatedToContacts.length > 1) {
        entryTypeSingle = false;
      }

      if (entryTypeSingle) {
        this.sharedService.postJson(APIS.SALES.TASK.ADD_TASK, finalData)
          .subscribe((res) => {
            this.processResponse(res, nextAction);
          }, (err) => { });
      } else {
        if (this.formData.relatedToType === 'Company' && this.relatedToCompanies.length > 1) {
          this.relatedToCompanies.map(comp => {
            finalData.taskAccountcompany = comp.store_id;
            this.sharedService.postJson(APIS.SALES.TASK.ADD_TASK, finalData).subscribe((res) => {
              this.processResponse(res, nextAction);
            }, (err) => { });
          });
        }
        if (this.formData.relatedToType === 'Contact' && this.relatedToContacts.length > 1) {
          this.relatedToContacts.map(comp => {
            finalData.assignedTo = comp.st_contact_id;
            this.sharedService.postJson(APIS.SALES.TASK.ADD_TASK, finalData).subscribe((res) => {
              this.processResponse(res, nextAction);
            }, (err) => { });
          });
        }
      }
    }
  }

  processResponse = (res, nextAction) => {
    if (res[0].status === 'success') {
      if (nextAction === 1) {
        this.actionPrimary.emit();
      } else {
        this.actionPrimary.emit(res[0].result);
        this.actionSecondary.emit();
      }
    } else {
      alert('Unable to add contact');
    }
  }

  actionRelatedToSelect = (type) => {
    if (type.value === 'company') {
      this.openRelatedCompanyDD();
    }
    if (type.value === 'contact') {
      this.openRelatedContactDD();
    }
  }

  openRelatedInviteDD = () => {
    this.showInviteContact = true;
  }

  cancelInviteContact = () => {
    this.showInviteContact = false;
  }

  selectInviteContact = (contact) => {
    this.invitees = contact;
    this.showInviteContact = false;
  }

  deleteInvite = (contact) => {
    const pos = this.invitees.findIndex(a => a.logins_id === contact.logins_id);
    if (pos > -1) {
      this.invitees.splice(pos, 1);
    }
  }
}
