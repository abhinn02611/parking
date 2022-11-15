import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Globals } from '../../classes/globals';
import { APIS, MODULES, PATHS } from 'src/app/classes/appSettings';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Session } from 'src/app/classes/session';

@Component({
  selector: 'sistem-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  domain = '';
  menuOpen = false;
  modules = MODULES;
  menus = [];
  parkingId = '';
  role: String = '';
  currentUrl = '';
  @Output() collapse = new EventEmitter();

  constructor(
    private globals: Globals,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private session: Session
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.clearMenuSelection(this.menus, null);
        this.createMenuOption(this.router.url);
        this.currentUrl = this.router.url;
        this.createSideBar();
      }
    });
  }

  ngOnInit() {
    this.createSideBar();
  }

  createSideBar() {
    this.menuOpen = this.globals.sidebarOpen;
    this.role = this.session.get('role');
    let parking = this.session.get('parking');
    this.parkingId = parking ? JSON.parse(parking).id : '';
    if (this.parkingId) {
      this.menus = [...this.modules[1].menus];
      if (
        this.role.toLowerCase() === 'admin' &&
        (this.router.url.includes('sessions') ||
          this.router.url.includes('reports') ||
          this.router.url.includes('passes')) &&
        !this.router.url.includes('users')
      ) {
        this.createVendorSideBar();
      } else if (this.role.toLowerCase() === 'admin') {
        this.menus = this.menus.filter(
          (menu) =>
            menu.title != 'Sessions' &&
            menu.title != 'Passes' &&
            menu.title != 'Reports'
        );
      } else if (this.role.toLowerCase() === 'operator') {
        this.menus = this.menus.filter(
          (menu) => menu.title == 'Sessions' || menu.title == 'Passes'
        );
      } else if (this.role.toLowerCase() === 'vendor') {
        this.createVendorSideBar();
      }
      this.clearMenuSelection(this.menus, this.parkingId);
    }
    this.createMenuOption(this.location.path());
  }

  createVendorSideBar() {
    const updatednewMenus = [];

    this.menus.forEach((menu) => {
      if (menu.title === 'Reports') {
        //menu.title = 'Dashboard';
        updatednewMenus.splice(0, 0, menu);
      }
      if (menu.title === 'Sessions') {
        updatednewMenus.splice(1, 0, menu);
      }
      if (menu.title === 'Passes') {
        updatednewMenus.splice(2, 0, menu);
      }
    });
    this.menus = updatednewMenus;
  }

  createMenuOption(url: string) {
    const parts = url.split('/');
    const baseparts = '/' + parts[1] + '/' + parts[2];
    const index = this.menus.findIndex((a) => {
      return a.route.includes(baseparts);
    });
    if (index > -1) {
      this.menus[index].selected = true;
    }
  }

  clearMenuSelection(menus: any[], parkingId: string) {
    this.menus = menus.map((a: any) => {
      a = Object.assign({}, a);
      a.selected = false;
      if (parkingId) {
        a.route = a.route.replace(PATHS.PARKING_ID, this.parkingId + '/');
      }
      return a;
    });
  }

  switchMenu = () => {
    this.menuOpen = !this.menuOpen;
    this.collapse.emit(this.menuOpen);
    this.globals.sidebarUpdate(this.menuOpen);
  };

  changeTitle(val) {
    if (val === 'Reports') {
      return 'Dashboard';
    }
    return val;
  }
}
