import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'list-user',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.scss'],
})
export class ListuserComponent implements OnInit {
  @Input() user: any;
  name: string;
  value: string;
  userProfile = '';
  constructor() {}

  ngOnInit() {
    this.name = this.getName(this.user);
    this.value = this.getInitial(this.user);
  }

  getInitial(user: any) {
    let fName = '';
    let lName = '';
    let value = '';
    if (user !== null) {
      if (user.firstName) {
        fName = user.firstName.charAt(0);
      }
      if (user.lastName) {
        lName = user.lastName.charAt(0);
      }
      value = fName + ' ' + lName;
    }
    return value === 'n n' || value === ' ' || value === null ? 'U' : value;
  }

  getName(user: any) {
    if (this.user !== null) {
      const userCheck = user.firstName !== null || user.lastName !== null;
      let name = userCheck ? user.firstName + ' ' + user.lastName : 'User';
      return name ? name : 'User';
    } else {
      return 'User';
    }
  }
}
