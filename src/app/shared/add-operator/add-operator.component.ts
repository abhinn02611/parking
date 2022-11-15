import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS } from 'src/app/classes/appSettings';
import { ParkingService } from 'src/app/parking/parking.service';

@Component({
  selector: 'app-add-operator',
  templateUrl: './add-operator.component.html',
  styleUrls: ['./add-operator.component.scss'],
})
export class AddOperatorComponent implements OnInit {
  @Input() editId = '';
  @Input() operator = null;
  @Input() parking_id = '';
  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    genderLabel: '',
    userType: 'operator',
    parkingId: ''
  };

  emailError = '';

  types = [];
  showAddType = false;
  rates = [];
  ratesFinal = [];

  constructor(private parkingService: ParkingService) {
   
  }

  isArray(val): boolean {
    return Array.isArray(val);
  }

  ngOnInit(): void {
    this.formData.parkingId = this.parking_id;
    console.log('operator', this.operator);
    if(this.operator){
      this.formData = {
        firstName: this.operator.firstName,
        lastName: this.operator.lastName,
        email: this.operator.email,
        password: '',
        phone: this.operator.phone,
        gender: this.operator.gender,
        genderLabel: this.operator.gender=='female'?'Female':'Male',
        userType: 'operator',
        parkingId: this.operator.parkingId,
      };
    }
  }
  onCancel = () => {
    this.actionCancel.emit();
  };
  onPrimary = () => {
    this.saveRate(1);
  };

  saveRate = (nextAction) => {
    let { genderLabel, ...userData }: any = this.formData;
    if(this.editId == ''){
      this.parkingService
      .postJson(APIS.PARKING.REGISTER, userData)
      .subscribe(
        (res: any) => {
          if(res.status){
            this.actionPrimary.emit(res.id);
          }else{
            this.emailError = res.message;
          }
          
        },
        (err) => {}
      );
    } else {
      userData.id = this.operator.id;
      this.parkingService
      .putJson(APIS.PARKING.OPERATOR.ADD.replace('{PARKING_ID}', this.parking_id), userData)
      .subscribe(
        (res: any) => {
          if(res.status){
            this.actionPrimary.emit(res.id);
          }else{
            this.emailError = res.message;
          }
        },
        (err) => {}
      );
    }
    
  };

  actionGenderSelect = (vt) => {
    this.formData.gender = vt.value;
    this.formData.genderLabel = vt.label;
  };

  print = (v) => {
    return JSON.stringify(v);
  };

}
