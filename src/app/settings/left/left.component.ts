import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PATHS } from 'src/app/classes/appSettings';

@Component({
  selector: 'app-settings-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {

  @Input() contact: any;
  @Input() currency = '';
  @Output() actionEdit = new EventEmitter();

  path = PATHS;
  active = PATHS.SETTINGS + 'undefined';

  constructor(private router: Router, private route: ActivatedRoute) {
    const parts = this.router.url.split('/');
    this.active = parts[1] + '/' + parts[2];
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

  isActive = (p) => {
    if (p === PATHS.SETTINGS_DASHBOARD && this.active === PATHS.SETTINGS + 'undefined') {
      return true;
    }
    return this.active === p;
  }

  moveTo = (p) => {
    this.router.navigate([p]);
  }

}
