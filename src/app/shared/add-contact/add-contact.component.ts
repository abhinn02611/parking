import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../shared.service';
import { SalesService } from '../../sales/sales.service';


@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {

  @Input() editId = '';
  @Input() company = null;

  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  phoneTypes = {
    all: ['Main', 'Desc', 'Other'],
    available: [],
    phones: [{ type: '', number: '' }]
  };
  linksTypes = {
    all: ['Facebook', 'Twitter', 'LinkedIn', 'Other'],
    available: [],
    links: [{ type: '', link: '' }]
  };
  emailTypes = {
    all: ['Work', 'Other'],
    available: [],
    emails: [{ type: '', email: '' }]
  };
  addressTypes = {
    all: ['Office'],
    available: [],
    addresses: [{
      type: '', full: '', address: {
        pin: '',
        address: '',
        city: '',
        state: '',
        country: '',
        lat: '',
        long: ''
      }
    }]
  };
  emails = [{ type: '', email: '' }];
  formData = {
    contactSalutation: '',
    contactLName: '',
    contactFName: '',
    contjobTitle: '',
    contjobDepart: '',
    contactAccount: '',
    contactAccountName: '',
    contactNotes: '',
    contactPhone: '',
    contactPhone2: { Desk: '', Other: '' },
    contactAddType: 'office',
    contactAddress: '',
    contactCity: '',
    contactState: '',
    contactCountry: '',
    contactPin: '',
    socialLinks: { LinkedIn: '', Facebook: '', Twitter: '', 'Google+': '', Other: '' },
    locLongtitute: 0,
    locLatitute: 0,
    contactDob: '',
    contactAnniversary: '',
    contactEmail: '',
    contactEmail2: '',
    imgData: '',
    contactOwner: ''
  };
  showRelatedCompany = false;
  showAddressModal = false;
  showAddType = false;
  addressUpdate: any;
  addressUpdateIndex = 0;

  constructor(private sharedService: SharedService, private salesService: SalesService) {

  }

  isArray(val): boolean { return Array.isArray(val); }

  ngOnInit(): void {
    this.formData.contactOwner = this.sharedService.name;
    if (this.editId !== '') {
      this.sharedService.get(APIS.SALES.CONTACT.GET + this.editId + '/').subscribe(
        data => {
          if (data[0].status === 'success') {
            const comp = data[0].result[0];
            this.formData.contactSalutation = comp.st_contact_salutation;
            this.formData.contactLName = comp.st_contact_last_name;
            this.formData.contactFName = comp.st_contact_fname;
            this.formData.contjobTitle = comp.st_contact_job_title;
            this.formData.contjobDepart = comp.st_contact_department;
            this.formData.contactAccount = comp.st_contact_idfk;
            this.formData.contactNotes = comp.st_contact_notes;
            this.formData.contactPhone = comp.st_contact_mobile;
            this.formData.contactPhone2 = comp.st_contact_mobile2;
            this.formData.contactAddType = comp.sales_contact_address_type;
            this.formData.contactAddress = comp.sales_contact_address;
            this.formData.contactCity = comp.sales_contact_city;
            this.formData.contactState = comp.sales_contact_state;
            this.formData.contactCountry = comp.sales_contact_country;
            this.formData.contactPin = comp.sales_contact_pin;
            this.formData.locLongtitute = comp.sales_contact_longtitute;
            this.formData.locLatitute = comp.sales_contact_latitute;
            this.formData.contactDob = comp.st_contact_dob;
            this.formData.contactEmail = comp.st_contact_email;
            this.formData.contactEmail2 = comp.st_contact_email2;
            this.formData.socialLinks = comp.st_contact_social_links;

            this.formData.contactPhone = comp.st_contact_mobile;
            try {
              this.formData.contactPhone2 = comp.st_contact_mobile2 ? JSON.parse(comp.st_contact_mobile2) : { Desk: '', Other: '' };
            } catch (e) { }
            try {
              this.formData.socialLinks = comp.st_contact_social_links ? JSON.parse(comp.st_contact_social_links) :
                this.formData.socialLinks;
            } catch (e) { }

            this.phoneTypes.phones[0].type = 'Main';
            this.phoneTypes.phones[0].number = comp.st_contact_mobile;
            for (const pType of Object.keys(this.formData.contactPhone2)) {
              if (this.formData.contactPhone2[pType] !== '') {
                this.phoneTypes.phones.push({ type: pType, number: this.formData.contactPhone2[pType] });
              }
            }
            this.updateAvailablePhoneType();
            this.emailTypes.emails[0].type = 'Work';
            this.emailTypes.emails[0].email = comp.st_contact_email;
            if (comp.st_contact_email2 != null && comp.st_contact_email2 !== '') {
              this.emailTypes.emails.push({ type: 'Other', email: comp.st_contact_email2 });
            }
            this.updateAvailableEmailType();
            if (this.formData.contactPin || this.formData.contactAddress || this.formData.contactCity || this.formData.contactState ||
              this.formData.contactCountry || this.formData.locLatitute > 0 || this.formData.locLongtitute > 0) {
              this.addressTypes.addresses[0].type = 'Office';
              this.addressTypes.addresses[0].address.pin = this.formData.contactPin;
              this.addressTypes.addresses[0].address.address = this.formData.contactAddress;
              this.addressTypes.addresses[0].address.city = this.formData.contactCity;
              this.addressTypes.addresses[0].address.state = this.formData.contactState;
              this.addressTypes.addresses[0].address.country = this.formData.contactCountry;
              this.addressTypes.addresses[0].address.lat = this.formData.locLatitute ? this.formData.locLatitute.toString() : '0';
              this.addressTypes.addresses[0].address.long = this.formData.locLongtitute ? this.formData.locLongtitute.toString() : '0';
              this.addressTypes.addresses[0].full = this.makeAddress(this.addressTypes.addresses[0].address);
            }
            this.updateAvailableAddressType();

            for (const pType of Object.keys(this.formData.socialLinks)) {
              if (this.formData.socialLinks[pType] !== '') {
                this.linksTypes.links.push({ type: pType, link: this.formData.socialLinks[pType] });
              }
            }
            this.updateAvailableLinkType();
          }
        },
        err => {
          console.error(err);
        },
        () => console.log('done uploading')
      );
    } else {
      this.updateAvailablePhoneType();
      this.updateAvailableAddressType();
      this.updateAvailableEmailType();
      this.updateAvailableLinkType();
      this.formData.contactAccount = this.company.store_id;
      this.formData.contactAccountName = this.company.store_name;
    }
  }

  onCancel = () => {
    this.actionCancel.emit();
  }
  onPrimary = () => {
    this.saveContact(1);
  }
  onSecondry = () => {
    this.saveContact(2);
  }

  actionChangeAddressType = (type, i) => {
    this.addressTypes.addresses[i].type = type.value;
    this.updateAvailableAddressType();
  }

  actionChangeSalutation = (type) => {
    this.formData.contactSalutation = type.value;
  }

  actionChangePhoneType = (type, i) => {
    console.log('i', i);
    console.log('type', type);
    this.phoneTypes.phones[i].type = type.value;
    this.updateAvailablePhoneType();
  }

  addMorePhone = () => {
    this.phoneTypes.phones.push({ type: '', number: '' });
    this.updateAvailablePhoneType();
  }

  removePhone = (index) => {
    this.phoneTypes.phones.splice(index, 1);
    this.updateAvailablePhoneType();
  }

  updateAvailablePhoneType = () => {
    const all = [...this.phoneTypes.all];
    this.phoneTypes.phones.map(a => {
      const index = all.indexOf(a.type);
      if (index > -1) {
        all.splice(index, 1);
      }
    });
    this.phoneTypes.available = all.map(a => {
      return { label: a, value: a };
    });
  }

  addMoreAddress = () => {
    this.addressTypes.addresses.push({
      type: '', full: '', address: {
        pin: '',
        address: '',
        city: '',
        state: '',
        country: '',
        lat: '',
        long: ''
      }
    });
    this.updateAvailablePhoneType();
  }

  removeAddress = (index) => {
    this.addressTypes.addresses.splice(index, 1);
    this.updateAvailablePhoneType();
  }

  updateAvailableAddressType = () => {
    const all = [...this.addressTypes.all];
    this.addressTypes.addresses.map(a => {
      const index = all.indexOf(a.type);
      if (index > -1) {
        all.splice(index, 1);
      }
    });
    this.addressTypes.available = all.map(a => {
      return { label: a, value: a };
    });
    console.log('this.addressTypes.available', this.addressTypes.available);
  }

  openUpdateCategoryModal = () => {
  }

  openUpdateTypeModal = () => {
    this.showAddType = true;
  }


  print = (v) => {
    return JSON.stringify(v);
  }

  openRelatedCompanyDD = (e) => {
    this.showRelatedCompany = true;
  }

  cancelRelatedCompany = (e) => {
    this.showRelatedCompany = false;
  }

  selectRelatedCompany = (company) => {
    console.log('company', company);
    this.formData.contactAccount = company.store_id;
    this.formData.contactAccountName = company.store_name;
    this.showRelatedCompany = false;
  }

  actionSelectDD = (type, key) => {
    this.formData[key] = type.value;
  }

  openAddAddressModal = (index) => {
    this.addressUpdateIndex = index;
    this.addressUpdate = this.addressTypes.addresses[index].address;
    this.showAddressModal = true;
  }

  setAddress = (address) => {
    this.addressTypes.addresses[this.addressUpdateIndex].address = address;
    this.addressTypes.addresses[this.addressUpdateIndex].full = this.makeAddress(address);
    this.showAddressModal = false;
  }

  cancelSetAddress = () => {
    this.showAddressModal = false;
  }


  makeAddress = (address) => {
    const parts = [];
    if (address.address.trim() !== '') {
      parts.push(address.address);
    }
    if (address.city.trim() !== '') {
      parts.push(address.city);
    }
    if (address.state.trim() !== '') {
      parts.push(address.state);
    }
    if (address.country.trim() !== '') {
      parts.push(address.country);
    }
    return parts.join(', ');
  }


  saveContact = (nextAction) => {
    this.formData.contactPhone = '';
    this.formData.contactPhone2.Desk = '';
    this.formData.contactPhone2.Other = '';
    this.formData.contactPin = '';
    this.formData.contactAddress = '';
    this.formData.contactCity = '';
    this.formData.contactState = '';
    this.formData.contactCountry = '';
    this.formData.locLatitute = 0;
    this.formData.locLongtitute = 0;
    this.formData.socialLinks = { LinkedIn: '', Facebook: '', Twitter: '', 'Google+': '', Other: '' };
    for (const phone of this.phoneTypes.phones) {
      if (phone.type === 'Main') {
        this.formData.contactPhone = phone.number;
      }
      if (phone.type === 'Desc') {
        this.formData.contactPhone2.Desk = phone.number;
      }
      if (phone.type === 'Other') {
        this.formData.contactPhone2.Other = phone.number;
      }
    }

    for (const address of this.addressTypes.addresses) {
      if (address.type === 'Office' || address.type === '') {
        this.formData.contactPin = address.address.pin;
        this.formData.contactAddress = address.address.address;
        this.formData.contactCity = address.address.city;
        this.formData.contactState = address.address.state;
        this.formData.contactCountry = address.address.country;
        this.formData.locLatitute = parseFloat(address.address.lat);
        this.formData.locLongtitute = parseFloat(address.address.long);
      }
    }

    for (const link of this.linksTypes.links) {
      if (link.type === 'Facebook') {
        this.formData.socialLinks.Facebook = link.link;
      } else if (link.type === 'Twitter') {
        this.formData.socialLinks.Twitter = link.link;
      } else if (link.type === 'LinkedIn') {
        this.formData.socialLinks.LinkedIn = link.link;
      } else if (link.type === 'Other') {
        this.formData.socialLinks.Other = link.link;
      }
    }
    for (const email of this.emailTypes.emails) {
      if (email.type === 'Work') {
        this.formData.contactEmail = email.email;
      } else {
        this.formData.contactEmail2 = email.email;
      }
    }

    const finalData = JSON.parse(JSON.stringify(this.formData));
    finalData.contactPhone2 = JSON.stringify(finalData.contactPhone2);
    finalData.socialLinks = JSON.stringify(finalData.socialLinks);
    console.log('formdata', finalData);
    if (finalData.contactAccount === '') {
      delete finalData.contactAccount;
    }

    if (this.editId !== '') {
      finalData.contactId = this.editId;
      this.sharedService.postJson(APIS.SALES.CONTACT.UPDATE_CONTACT, finalData)
        .subscribe((res) => {
          if (res[0].status === 'success') {
            if (nextAction === 1) {
              this.actionPrimary.emit(this.editId);
            } else {
              this.actionPrimary.emit(this.editId);
              this.actionSecondary.emit();
            }
          } else {
            alert('Unable to update contact');
          }
        }, (err) => { });
    } else {
      this.sharedService.postJson(APIS.SALES.CONTACT.ADD_CONTACT, finalData)
        .subscribe((res) => {
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
        }, (err) => { });
    }
  }

  actionChangeEmailType = (type, i) => {
    this.emailTypes.emails[i].type = type.value;
    this.updateAvailableEmailType();
  }

  addMoreEmail = () => {
    this.emailTypes.emails.push({ type: '', email: '' });
    this.updateAvailableEmailType();
  }

  removeEmail = (index) => {
    this.emailTypes.emails.splice(index, 1);
    this.updateAvailableEmailType();
  }

  updateAvailableEmailType = () => {
    const all = [...this.emailTypes.all];
    this.emailTypes.emails.map(a => {
      const index = all.indexOf(a.type);
      if (index > -1) {
        all.splice(index, 1);
      }
    });
    this.emailTypes.available = all.map(a => {
      return { label: a, value: a };
    });
  }

  actionChangeLinkType = (type, i) => {
    this.linksTypes.links[i].type = type.value;
    this.updateAvailableLinkType();
  }

  addMoreLink = () => {
    this.linksTypes.links.push({ type: '', link: '' });
    this.updateAvailableLinkType();
  }

  removeLink = (index) => {
    this.linksTypes.links.splice(index, 1);
    this.updateAvailableLinkType();
  }

  updateAvailableLinkType = () => {
    const all = [...this.linksTypes.all];
    this.linksTypes.links.map(a => {
      const index = all.indexOf(a.type);
      if (index > -1) {
        all.splice(index, 1);
      }
    });
    this.linksTypes.available = all.map(a => {
      return { label: a, value: a };
    });
  }


}
