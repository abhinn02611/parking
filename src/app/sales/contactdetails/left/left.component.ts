import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sistem-contactdetails-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {

  @Input() contact: any;
  @Input() currency = '';
  @Output() actionEdit = new EventEmitter();


  constructor() {

  }

  ngOnInit() {
  }

  getAddress = () => {
    return this.makeAddress({
      pincode: this.contact.sales_contact_pin,
      address: this.contact.sales_contact_address,
      city: this.contact.sales_contact_city,
      state: this.contact.sales_contact_state,
      country: this.contact.sales_contact_country,
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

  link = (l) => {
    return '<a href="' + l + '" target="_blank">' + l + '</a>';
  }

}
