import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../shared.service';
import { SalesService } from '../../sales/sales.service';
import { INDUCTRIES_JSON, COMPANY_TYPE_JSON, COMPANY_OWNERSHIP_JSON } from '../../classes/inductries';


@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  @Input() editId = '';

  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  phoneTypes = {
    all: ['Main', 'Desc', 'Other'],
    available: [],
    phones: [{ type: '', number: '' }]
  };
  addressTypes = {
    all: ['Billing', 'Shipping'],
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
  formData = {
    storeName: '',
    storeParentAc: '',
    storeType: '',
    storeIndustry: '',
    storeOwnership: '',
    storeOwner: '',
    storeRating: '',
    annualRevenue: '',
    storeSic: '',
    totalEmployee: '',
    storeWeb: '',
    storeEmail: '',
    storeDesc: '',

    storePhone: '',
    today: Date().toString(),
    storeFax: { Desk: '', Other: '' },

    locLatitute: 0,
    locLongtitute: 0,

    storePin: '',
    storeAddress: '',
    storeCity: '',
    storeState: '',
    storeCountry: '',
    storeLatitute: 0,
    storeLongtitute: 0,

    storeShipPin: '',
    storeShipAddress: '',
    storeShipCity: '',
    storeShipState: '',
    storeShipCountry: '',
    storeShipLatitute: 0,
    storeShipLongtitute: 0
  };
  types = [];
  showRelatedCompany = false;
  showAddressModal = false;
  showAddType = false;
  files = [];
  industries = [];
  rating = [];
  ownership = [];
  addressUpdate: any;
  addressUpdateIndex = 0;

  constructor(private sharedService: SharedService, private salesService: SalesService) {
    this.industries = INDUCTRIES_JSON.map(a => {
      return { label: a, value: a };
    });
    this.rating = ['A', 'B', 'C'].map(a => {
      return { label: a, value: a };
    });
    this.types = COMPANY_TYPE_JSON.map(a => {
      return { label: a, value: a };
    });
    this.ownership = COMPANY_OWNERSHIP_JSON.map(a => {
      return { label: a, value: a };
    });
  }

  isArray(val): boolean { return Array.isArray(val); }

  ngOnInit(): void {

    if (this.editId !== '') {
      this.sharedService.get(APIS.SALES.COMPANY.GET + this.editId + '/').subscribe(
        data => {
          if (data[0].status === 'success') {
            const comp = data[0].result[0];
            this.formData.storeName = comp.store_name;
            this.formData.storeParentAc = comp.store_parent_ac;
            this.formData.storeType = comp.store_type;
            this.formData.storeIndustry = comp.store_industry;
            this.formData.storeOwnership = comp.store_ownership;
            this.formData.storeOwner = comp.store_owner;
            this.formData.storeRating = comp.store_rating;
            this.formData.annualRevenue = comp.store_annual_revenue;
            this.formData.storeSic = comp.store_sic_code;
            this.formData.totalEmployee = comp.store_total_employee;
            this.formData.storeEmail = comp.store_email;
            this.formData.storeDesc = comp.store_desc;
            this.formData.storeWeb = comp.store_website;

            this.formData.storePhone = comp.store_phone;
            try {
              this.formData.storeFax = comp.store_fax ? JSON.parse(comp.store_fax) : { Desk: '', Other: '' };
            } catch (e) { }

            this.formData.locLatitute = comp.store_latitute;
            this.formData.locLongtitute = comp.store_longtitute;
            this.formData.storePin = comp.store_pin;
            this.formData.storeAddress = comp.store_address;
            this.formData.storeCity = comp.store_city;
            this.formData.storeState = comp.store_state;
            this.formData.storeCountry = comp.store_country;
            this.formData.storeLatitute = comp.store_latitute;
            this.formData.storeLongtitute = comp.store_longtitute;


            this.formData.storeShipPin = comp.store_ship_pin;
            this.formData.storeShipAddress = comp.store_ship_address;
            this.formData.storeShipCity = comp.store_ship_city;
            this.formData.storeShipState = comp.store_ship_state;
            this.formData.storeShipCountry = comp.store_ship_country;
            this.formData.storeShipLatitute = comp.store_ship_latitute;
            this.formData.storeShipLongtitute = comp.store_ship_longtitute;
            this.phoneTypes.phones[0].type = 'Main';
            this.phoneTypes.phones[0].number = comp.store_phone;
            for (const pType of Object.keys(this.formData.storeFax)) {
              if (this.formData.storeFax[pType] !== '') {
                this.phoneTypes.phones.push({ type: pType, number: this.formData.storeFax[pType] });
              }
            }
            this.updateAvailablePhoneType();
            if (this.formData.storePin || this.formData.storeAddress || this.formData.storeCity || this.formData.storeState ||
              this.formData.storeCountry || this.formData.storeLatitute > 0 || this.formData.storeLongtitute > 0) {
              this.addressTypes.addresses[0].type = 'Billing';
              this.addressTypes.addresses[0].address.pin = this.formData.storePin;
              this.addressTypes.addresses[0].address.address = this.formData.storeAddress;
              this.addressTypes.addresses[0].address.city = this.formData.storeCity;
              this.addressTypes.addresses[0].address.state = this.formData.storeState;
              this.addressTypes.addresses[0].address.country = this.formData.storeCountry;
              this.addressTypes.addresses[0].address.lat = this.formData.storeLatitute.toString();
              this.addressTypes.addresses[0].address.long = this.formData.storeLongtitute.toString();
              this.addressTypes.addresses[0].full = this.makeAddress(this.addressTypes.addresses[0].address);
            }
            if (this.formData.storeShipPin !== '' || this.formData.storeShipAddress !== '' || this.formData.storeShipCity !== '' ||
              this.formData.storeShipState !== '' ||
              this.formData.storeShipCountry !== '' || this.formData.storeShipLatitute > 0 || this.formData.storeShipLongtitute > 0) {
              const addr = {
                pin: this.formData.storeShipPin,
                address: this.formData.storeShipAddress,
                city: this.formData.storeShipCity,
                state: this.formData.storeShipState,
                country: this.formData.storeShipCountry,
                lat: this.formData.storeShipLatitute.toString(),
                long: this.formData.storeShipLongtitute.toString(),
              };
              this.addressTypes.addresses.push({
                type: 'Shipping',
                full: this.makeAddress(addr),
                address: addr
              });
            }
            this.updateAvailableAddressType();
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
    }
  }

  fetchTypes = () => {
    this.sharedService.get(APIS.SALES.COMPANY.TYPES).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.types = data[0].result.map(m => {
            return { label: m.type_name, value: m.id_store_type };
          });
        }
      },
      err => {
        console.error(err);
      },
      () => console.log('done uploading')
    );
  }

  onCancel = () => {
    this.actionCancel.emit();
  }
  onPrimary = () => {
    this.saveCompany(1);
  }
  onSecondry = () => {
    this.saveCompany(2);
  }

  actionChangePhoneType = (type, i) => {
    console.log('i', i);
    console.log('type', type);
    this.phoneTypes.phones[i].type = type.value;
    this.updateAvailablePhoneType();
  }

  actionChangeAddressType = (type, i) => {
    this.addressTypes.addresses[i].type = type.value;
    this.updateAvailableAddressType();
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

  cancelAddType = () => {
    this.showAddType = false;
    this.fetchTypes();
  }

  filesChange = (files) => {
    this.files = files;
    console.log('this.files', this.files);
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
    this.formData.storeParentAc = company.store_name;
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


  saveCompany = (nextAction) => {
    this.formData.storePhone = '';
    this.formData.storeFax.Desk = '';
    this.formData.storeFax.Other = '';
    this.formData.storePin = '';
    this.formData.storeAddress = '';
    this.formData.storeCity = '';
    this.formData.storeState = '';
    this.formData.storeCountry = '';
    this.formData.storeLatitute = 0;
    this.formData.storeLongtitute = 0;
    this.formData.locLatitute = 0;
    this.formData.locLongtitute = 0;
    this.formData.storeShipPin = '';
    this.formData.storeShipAddress = '';
    this.formData.storeShipCity = '';
    this.formData.storeShipState = '';
    this.formData.storeShipCountry = '';
    this.formData.storeShipLatitute = 0;
    this.formData.storeShipLongtitute = 0;
    for (const phone of this.phoneTypes.phones) {
      if (phone.type === 'Main') {
        this.formData.storePhone = phone.number;
      }
      if (phone.type === 'Desc') {
        this.formData.storeFax.Desk = phone.number;
      }
      if (phone.type === 'Other') {
        this.formData.storeFax.Other = phone.number;
      }
    }

    for (const address of this.addressTypes.addresses) {
      if (address.type === 'Billing') {
        this.formData.storePin = address.address.pin;
        this.formData.storeAddress = address.address.address;
        this.formData.storeCity = address.address.city;
        this.formData.storeState = address.address.state;
        this.formData.storeCountry = address.address.country;
        this.formData.storeLatitute = parseFloat(address.address.lat);
        this.formData.storeLongtitute = parseFloat(address.address.long);
        this.formData.locLatitute = parseFloat(address.address.lat);
        this.formData.locLongtitute = parseFloat(address.address.long);
      }
      if (address.type === 'Shipping') {
        this.formData.storeShipPin = address.address.pin;
        this.formData.storeShipAddress = address.address.address;
        this.formData.storeShipCity = address.address.city;
        this.formData.storeShipState = address.address.state;
        this.formData.storeShipCountry = address.address.country;
        this.formData.storeShipLatitute = parseFloat(address.address.lat);
        this.formData.storeShipLongtitute = parseFloat(address.address.long);
      }
    }
    const finalData = JSON.parse(JSON.stringify(this.formData));
    finalData.storeFax = JSON.stringify(finalData.storeFax);
    console.log('formdata', finalData);

    if (this.editId !== '') {
      finalData.storeId = this.editId;
      this.sharedService.postJson(APIS.SALES.COMPANY.UPDATE_COMPANY, finalData)
        .subscribe((res) => {
          if (res[0].status === 'success') {
            if (nextAction === 1) {
              this.actionPrimary.emit(this.editId);
            } else {
              this.actionPrimary.emit(this.editId);
              this.actionSecondary.emit();
            }
          } else {
            alert('Unable to update company');
          }
        }, (err) => { });
    } else {
      this.sharedService.postJson(APIS.SALES.COMPANY.ADD_COMPANY, finalData)
        .subscribe((res) => {
          if (res[0].status === 'success') {
            if (nextAction === 1) {
              this.actionPrimary.emit();
            } else {
              this.actionPrimary.emit(res[0].result);
              this.actionSecondary.emit();
            }
          } else {
            alert('Unable to add company');
          }
        }, (err) => { });
    }
  }
}
