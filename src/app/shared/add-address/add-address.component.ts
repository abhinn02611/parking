import { Component, EventEmitter, Input, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, OnInit, Output, SimpleChanges } from '@angular/core';
import { SharedService } from '../shared.service';
import { SalesService } from '../../sales/sales.service';


@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  private addressDiffer: KeyValueDiffer<string, any>;
  @Input() address = {
    pin: '',
    address: '',
    city: '',
    state: '',
    country: '',
    lat: 0,
    long: 0
  };

  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();

  finalAddress = '';
  timeous: any;

  constructor(private sharedService: SharedService, private salesService: SalesService, private differs: KeyValueDiffers) {
  }

  isArray(val): boolean { return Array.isArray(val); }

  addressChanged(changes: KeyValueChanges<string, any>) {
    console.log('changes', changes);
    if (this.timeous) {
      clearTimeout(this.timeous);
    }
    this.timeous = setTimeout(this.makeAddress, 3000);
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
      changes.forEachChangedItem((record) => ...);
    */
  }

  ngDoCheck(): void {
    const changes = this.addressDiffer.diff(this.address);
    if (changes) {
      this.addressChanged(changes);
    }
  }

  ngOnInit(): void {
    this.addressDiffer = this.differs.find(this.address).create();
    this.makeAddress();
  }

  makeAddress = () => {
    const parts = [];
    if (this.address.address.trim() !== '') {
      parts.push(this.address.address);
    }
    if (this.address.city.trim() !== '') {
      parts.push(this.address.city);
    }
    if (this.address.state.trim() !== '') {
      parts.push(this.address.state);
    }
    if (this.address.country.trim() !== '') {
      parts.push(this.address.country);
    }
    this.finalAddress =  parts.join(', ');
  }

  onCancel = () => {
    this.actionCancel.emit();
  }
  onPrimary = () => {
    this.actionPrimary.emit(this.address);
  }

  updateLatLong = (ll) => {
    this.address.lat = ll.latitude;
    this.address.long = ll.longitude;
  }

}
