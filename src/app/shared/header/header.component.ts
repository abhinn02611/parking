import { Component, OnInit } from '@angular/core';
import { Session } from 'src/app/classes/session';
import { Router } from '@angular/router';
import { MODULES, PATHS } from 'src/app/classes/appSettings';

@Component({
  selector: 'sistem-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userOpen = false;
  moduleOpen = false;
  searchOpen = false;
  searchKeyword = '';
  role = '';
  name = '';
  companyName = '';
  profilePic = '';
  modules = MODULES;

  constructor(private router: Router, private session: Session) {
    
  }

  ngOnInit() {
    this.role = this.session.get('role');
    this.role = this.role.charAt(0).toUpperCase() + this.role.slice(1);
    this.profilePic = this.session.get('profile_pic');
    this.companyName = this.session.get('business_name');
    this.name = this.session.get('name');
  }

  toggleModule = () => {
    this.moduleOpen = !this.moduleOpen;
  }

  toggleUser = () => {
    this.userOpen = !this.userOpen;
  }

  showResult = () => {
    if (this.searchKeyword.length > 0) {
      this.searchOpen = true;
    } else {
      this.searchOpen = false;
    }
  }

  logout = () => {
    this.session.destroy();
    // this.router.navigate(['/login']);
    this.router.navigate(['/signin']);
  }

  openSystemAccount = () => {
    this.router.navigate([PATHS.SETTINGS_DASHBOARD]);
  }

  gotoModule = (m) => {
    console.log('m', m);
    this.router.navigate([m.route]);
  }

}
