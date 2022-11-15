import { Session } from './../../classes/session';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APIS } from 'src/app/classes/appSettings';
import { ParkingService } from 'src/app/parking/parking.service';
@Component({
  selector: 'app-add-parking-details',
  templateUrl: './add-parking-details.component.html',
  styleUrls: ['./add-parking-details.component.scss'],
})
export class AddParkingDetailsComponent implements OnInit, OnChanges {
  @Input() editId = '';
  @Input() editParking: any;
  @Input() parking_id = '';
  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() submitParking = new EventEmitter();
  config = [];
  files = [];
  images: File[] = [];
  base64Images: string[] = [];
  types: any[] = [];
  typesList: any[] = [];
  facilitiesList: any[] = [];
  selectedFacilities: string[] = [];
  myForm = new FormGroup({
    parkingId: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });
  formData = {
    name: '',
    lat: '',
    lng: '',
    description: '',
    city: '',
    state: '',
    country: '',
    address: '',
    openHour: null,
    closeHour: null,
    vehicleTypes: [],
    facility: [],
    adminId: '',
  };

  constructor(
    private http: HttpClient,
    private session: Session,
    private parkingService: ParkingService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnInit(): void {
    this.getTypesList();
    this.getFacilities();
    let user = JSON.parse(this.session.get('user'));
    this.formData.adminId = user.id;
    if (this.editParking) {
      this.formData = {
        name: this.editParking.name,
        lat: this.editParking.point.coordinates[0],
        lng: this.editParking.point.coordinates[1],
        description: this.editParking.description,
        city: this.editParking.city,
        state: this.editParking.state,
        country: this.editParking.country,
        address: this.editParking.address,
        openHour: this.editParking.openHour,
        closeHour: this.editParking.closeHour,
        vehicleTypes: this.editParking.vehicleTypes,
        facility: this.editParking.facility.map((facility) => facility.id),
        adminId: user.id,
      };

      let capacities = this.editParking.parkingCapacity.map((v) => {
        return { label: v.vehicleType.name, capacity: v.capacity };
      });

      this.formData.vehicleTypes.forEach((v, i) => {
        let capacity = capacities.find((c) => c.label === v.name);
        v.capacity = capacity.capacity;
      });

      console.log(this.editParking);
      console.log(this.formData);

      for (let url of this.editParking.images) {
        let item = url;
        let fileName = url.split('/')[1];
        item = `https://staging.api.parking.sistem.app/auth/${item}`;
        this.base64Images.push(item);
        this.config.push({
          status: 2,
          url: item,
          fileName: fileName,
        });
      }
    }

    this.config.push({
      status: 0,
      url: '',
      fileName: '',
    });

    console.log(this.config);
  }

  get f() {
    return this.myForm.controls;
  }

  getTypesList() {
    this.typesList = [];
    this.parkingService.getVehicleOptions().forEach((p) => {
      this.typesList.push({
        label: p.label,
        id: p.value,
      });
    });
  }
  onSelectFacilites(item, index) {
    item.isSelected = !item.isSelected;
    let value = this.formData.facility.find((v) => v == item.id);
    if (item.isSelected && !value) {
      this.formData.facility.push(item.id);
    }
    if (!item.isSelected && value) {
      const i = this.formData.facility.indexOf(value);
      this.formData.facility.splice(i, 1);
    }
    console.log(this.formData.facility);
  }

  actionSelectDD = ($event) => {
    if (!$event.id) {
      this.formData.vehicleTypes = [];
    } else {
      const item = this.typesList.find((i) => i.id == $event.id);
      if (!item || !item.id) return;
      const obj = {
        label: item.label,
        id: item.id,
        capacity: '',
      };
      let value = this.formData.vehicleTypes.find((v) => v.id == obj.id);
      if (!value) {
        this.formData.vehicleTypes.push(obj);
      }
    }
    $event = null;
  };

  actionRemoveDD = ($event: any) => {
    if (!$event.id) {
      this.formData.vehicleTypes = [];
    } else {
      const item = this.typesList.find((i) => i.id == $event.id);
      if (!item || !item.id) return;
      let valueIndex = this.formData.vehicleTypes.findIndex(
        (v) => v.id == item.id
      );
      if (valueIndex !== -1) {
        this.formData.vehicleTypes.splice(valueIndex, 1);
      }
    }
    $event = null;
    console.log(this.formData.vehicleTypes);
  };

  onRemove(item, index) {
    this.formData.vehicleTypes.splice(index, 1);
  }

  onFileChange(event: any, url: string) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.images.push(event.target.files[i]);
        let fileName = event.target.files[i].name;
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.base64Images.push(event.target.result);
          const i = this.config.findIndex((a) => a.url === url);
          this.config[i].status = 2;
          this.config[i].url = event.target.result;
          this.config[i].fileName = fileName;
          this.config.push({
            status: 0,
            url: '',
            fileName: '',
          });
          this.myForm.patchValue({
            fileSource: this.images,
          });
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  onRemoveImage(fileConfig: any, url: string) {
    this.base64Images = this.base64Images.filter((img) => {
      return img !== fileConfig.url;
    });
    this.images = this.images.filter((im) => {
      return im.name !== fileConfig.fileName;
    });

    this.config = this.config.filter((c) => {
      return c.url !== url;
    });
  }

  submit() {}

  onCancel = () => {
    this.actionCancel.emit();
  };
  onPrimary = () => {
    let lat = this.formData.lat;
    let lng = this.formData.lng;

    this.formData.lat = '' + lng;
    this.formData.lng = '' + lat;

    if (this.formData) {
      if (this.editId) {
        this.parkingService
          .putJson(
            APIS.PARKING.ADDPARKING.UPDATEPARKING.replace(
              '{PARKING_ID}',
              this.editId
            ),
            this.formData
          )
          .subscribe(
            (res) => {
              if (res) {
                this.imageUpload(res['id']);
              }
            },
            (err) => {
              console.log('error', err);
            }
          );
      } else {
        this.parkingService
          .postJson(APIS.PARKING.ADDPARKING.PARKING, this.formData)
          .subscribe(
            (res) => {
              if (res) {
                this.imageUpload(res['id']);
              }
            },
            (err) => {
              console.log('error', err);
            }
          );
      }
    }
  };
  getFacilities = () => {
    this.parkingService.get(APIS.PARKING.ADDPARKING.PARKINGFACILITES).subscribe(
      (data: any) => {
        data.rows.forEach((item) => {
          item.isSelected = false;
        });

        this.facilitiesList = data.rows;
        console.log(this.facilitiesList);

        if (
          this.editParking &&
          this.editParking.id &&
          this.editParking.facility &&
          this.editParking.facility.length
        ) {
          this.editParking.facility.forEach((item) => {
            let facility = this.facilitiesList.find((f) => f.id == item.id);
            if (facility) {
              facility.isSelected = true;
            }
          });
        }
      },
      (err) => {
        console.error(err);
      },
      () => {}
    );
  };

  imageUpload(parkingId) {
    const obArr = [];
    if (this.images.length > 0) {
      this.images.forEach((img) => {
        const formData = new FormData();
        formData.append(`file`, img);
        formData.append('parkingId', parkingId);
        obArr.push(
          this.parkingService
            .postFormdata(APIS.PARKING.ADDPARKING.PARKINGIMAGES, formData)
            .pipe(catchError(() => of(false)))
        );
      });
      forkJoin(obArr).subscribe((res) => {
        this.submitParking.emit();
      });
    } else {
      this.submitParking.emit();
    }
  }

  filesChange = (files) => {
    this.files = files;
    console.log('this.files', this.files);
  };

  getFacilitiesImage(title: string) {
    switch (title) {
      case 'Disabled parking':
        return '/assets/images/f2.png';
      case 'Online payment':
        return '/assets/images/f1.png';
      case 'e-charging station':
        return '/assets/images/f3.png';
      case 'washroom':
        return '/assets/images/f5.png';
      case 'security camera':
        return '/assets/images/f4.png';
      default:
        return '';
    }
  }
}
