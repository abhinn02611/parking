import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { APIS } from 'src/app/classes/appSettings';
import { Session } from 'src/app/classes/session';
import { ParkingService } from '../../parking.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
})
export class AddVendorComponent implements OnInit, OnChanges {
  @Input() vendor: any;
  @Input() editId: string;

  @Output()
  onVendorPopupCancel = new EventEmitter();

  showChooseParking: boolean = false;
  orderBy = 'inTime';
  parkingList: any;
  loading: boolean = false;
  filterQuery = '';
  tags = ['', '', 'Sorted by IN TIME'];
  reverse = true;
  filterDropdown: any;
  selectedGender: any;
  vendorFullName: string = '';
  user: any;
  role: string;
  vendorPass: string;
  companyInitial: string;
  filter = {
    page: 1,
    total: 100,
    limit: 15,
    query: '',
    from: '',
    to: '',
    date: false,
  };
  selectedParkings: any[] = [];

  constructor(
    private parkingService: ParkingService,
    private session: Session
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('vendor chanhges', changes);
    if (!changes.vendor.currentValue) {
      this.vendor = {};
    }
  }

  ngOnInit(): void {
    this.user = JSON.parse(this.session.get('user'));
    if (this.user && this.user.company) {
      this.companyInitial = this.user.company.charAt(0);
    }

    this.role = this.session.get('role');

    this.filterDropdown = [
      { label: 'male' },
      { label: 'female' },
      { label: 'other' },
    ];
    if (this.vendor && this.vendor.parkings) {
      this.selectedParkings = this.vendor.parkings;
      this.vendor.password = this.vendor.password.substr(0, 8);
    }
    this.parkingList = JSON.parse(this.session.get('parkings'));
  }

  getParkings() {
    this.loading = true;
    this.parkingService.get(APIS.PARKING.ADDPARKING.GETPARKING).subscribe(
      (data: any) => {
        this.session.set('parkings', JSON.stringify(data));
        this.parkingList = data;
        this.loading = false;
        console.log('parkingList', this.parkingList);
      },
      (err) => {
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  selectItem(e, item) {
    e.stopPropagation();
    e.preventDefault();

    this.selectedParkings = this.selectedParkings || [];
    const index = this.selectedParkings.findIndex((a) => a.id === item.id);
    if (index > -1) {
      this.selectedParkings.splice(index, 1);
    } else {
      this.selectedParkings.push(item);
    }
  }

  isSelected(id: any) {
    this.selectedParkings = this.selectedParkings || [];
    const index = this.selectedParkings.findIndex((a) => a.id === id);
    return index > -1;
  }

  onCancelVendor() {
    this.onVendorPopupCancel.emit();
  }

  onSaveParking() {
    this.vendor.parkings = this.selectedParkings;
    this.showChooseParking = false;
  }

  onCancelParking() {
    this.selectedParkings = this.vendor.parkings;
    this.showChooseParking = false;
  }

  onChooseParking() {
    this.showChooseParking = true;
  }
  actionSelectDD($event) {
    this.selectedGender = $event.label;
    this.vendor.gender = $event.label;
  }
  onSubmit() {
    let model = JSON.parse(JSON.stringify(this.vendor));
    model.parkingIds = model.parkings.map((p) => {
      return p.id;
    });

    if (!this.editId) {
      this.parkingService
        .postJson(APIS.PARKING.VENDORS.ADDVENDOR, model)
        .subscribe(
          (res) => {
            this.onVendorPopupCancel.emit();
          },
          (err) => {}
        );
    } else {
      let editModal = {
        parkingIds: model.parkingIds,
        firstName: model.firstName,
        gender: model.gender,
        lastName: model.lastName,
        password: model.password,
        phone: model.phone,
        email: model.email,
        userType: model.type,
      };
      console.log(editModal);
      this.parkingService
        .putJson(
          APIS.PARKING.VENDORS.EDITVENDOR.replace('{vendorId}', this.editId),
          editModal
        )
        .subscribe(
          (res) => {
            this.onVendorPopupCancel.emit();
          },
          (err) => {}
        );
    }
  }

  applyFilter = (filter) => {
    this.filterQuery = '';
    let filterList = [];
    let fc = 0;
    if (filter.query) {
      filterList.push('search=' + filter.query);
      fc++;
    }
    if (filter.type) {
      filterList.push('type=' + filter.type);
      fc++;
    }
    if (filter.page) {
      filterList.push('page=' + filter.page);
    }

    if (this.orderBy) {
      filterList.push(
        'orderBy=' + this.orderBy + ':' + (this.reverse ? 'DESC' : 'ASC')
      );
    }
    if (filterList.length) {
      this.filterQuery = '&' + filterList.join('&');
    }
    if (fc > 0) {
      this.tags[1] = fc + ' Filter applied';
    } else {
      this.tags[1] = '';
    }
    this.getParkings();
  };
}
