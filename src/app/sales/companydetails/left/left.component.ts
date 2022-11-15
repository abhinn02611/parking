import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sistem-companydetails-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {

  @Input() company: any;
  @Input() currency = '';
  @Output() actionEdit = new EventEmitter();


  constructor() {

  }

  ngOnInit() {
  }

  getStoreAddress = () => {
    return this.makeAddress({
      pincode: this.company.store_pin,
      address: this.company.store_address,
      city: this.company.store_city,
      state: this.company.store_state,
      country: this.company.store_country,
    });
  }

  getShipAddress = () => {
    return this.makeAddress({
      pincode: this.company.store_ship_pin,
      address: this.company.store_ship_address,
      city: this.company.store_ship_city,
      state: this.company.store_ship_state,
      country: this.company.store_ship_country,
    });
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
    let joined = parts.join(', ');
    if (address.pincode.trim() !== '') {
      joined = joined + '-' + address.pincode;
    }
    return joined;
  }

}
