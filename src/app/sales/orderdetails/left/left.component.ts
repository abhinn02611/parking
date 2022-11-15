import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sistem-orderdetails-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {

  @Input() order: any;
  @Input() currency = '';
  @Output() actionEdit = new EventEmitter();


  constructor() {

  }

  ngOnInit() {
  }

  getStoreAddress = () => {
    return this.makeAddress({
      pincode: this.order.store_pin,
      address: this.order.store_address,
      city: this.order.store_city,
      state: this.order.store_state,
      country: this.order.store_country,
    });
  }

  getShipAddress = () => {
    return this.makeAddress({
      pincode: this.order.store_ship_pin,
      address: this.order.store_ship_address,
      city: this.order.store_ship_city,
      state: this.order.store_ship_state,
      country: this.order.store_ship_country,
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
