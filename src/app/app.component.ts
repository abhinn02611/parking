import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Globals } from './classes/globals';

@Component({
  selector: 'sistem-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'sistem';
  menuSwitchStatus = false;
  showLayout = true;
  showSidebar = true;
  isParking = false;

  constructor(
    private globals: Globals,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr:ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((menuSwitchStatus) => {
      this.menuSwitchStatus = menuSwitchStatus;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const parts = this.router.url.split('/');
        this.isParking = parts[1] && parts[1] == 'parking';
        this.showLayout =
          this.activatedRoute.firstChild.snapshot.data.hideMenu === true
            ? false
            : true;
        if (parts[2] && parts[2] === 'settings') {
          this.showSidebar = false;
        } else {
          this.showSidebar = true;
        }
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 200);
      }
    });
  }

  onCollapse = (collapse) => {
    this.menuSwitchStatus = collapse;
  };
}
