import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Session } from 'src/app/classes/session';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { APIS, MODULES, PATHS } from 'src/app/classes/appSettings';
import { Location } from '@angular/common';
import { ParkingService } from 'src/app/parking/parking.service';
import { SharedService } from '../shared.service';
import { skip } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'sistem-headerparking',
  templateUrl: './headerparking.component.html',
  styleUrls: ['./headerparking.component.scss'],
})
export class HeaderParkingComponent implements OnInit, OnDestroy {
  userOpen = false;
  moduleOpen = false;
  searchOpen = false;
  searchKeyword = '';
  role: string;
  name = '';
  companyName = '';
  profilePic = '';
  modules = MODULES;
  newParkingID: any;
  parkingId = '';
  user: any = {};
  initials = '';
  username = '';
  useremail = '';
  selectedParking = '';
  filterDropdown: any[] = [];
  showDropDown: boolean = false;
  routerSubs: Subscription;
  currentUrl: string = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private session: Session,
    private location: Location,
    private parkingService: ParkingService,
    private sharedService: SharedService
  ) {}
  ngOnDestroy(): void {
    this.routerSubs.unsubscribe();
  }

  ngOnInit() {
    this.role = this.session.get('role');

    this.setUserDetails();
    this.checkForShowDropDown();
    //parking details
    this.sharedService.selectedParking.subscribe((parking) => {
      if (parking) {
        this.newParkingID = parking.id;
        this.selectedParking = parking.name;
      } else {
        const initialParking = JSON.parse(this.session.get('parking'));
        this.newParkingID = initialParking.id;
        this.selectedParking = initialParking.name;
      }
      this.setUserDetails();
    });

    this.profilePic = this.session.get('profile_pic');
    this.companyName = this.session.get('business_name');
    this.name = this.session.get('name');

    this.routerSubs = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.checkForShowDropDown();
      }
    });
  }

  checkForShowDropDown() {
    if (
      this.session.get('role').toLocaleLowerCase() === 'admin' &&
      this.router.url.includes('sessions') &&
      !this.router.url.includes('user')
    ) {
      this.showDropDown = true;
    } else if (
      this.session.get('role').toLocaleLowerCase() === 'vendor' &&
      !this.router.url.includes('setting')
    ) {
      this.showDropDown = true;
    } else {
      this.showDropDown = false;
    }
  }

  setUserDetails() {
    this.user = JSON.parse(this.session.get('user'));
    this.username = this.user.firstName + ' ' + this.user.lastName;
    this.useremail = this.user.email;
    this.initials =
      this.user.firstName.split('').reverse().pop().toUpperCase() +
      this.user.lastName.split('').reverse().pop().toUpperCase();
    this.filterDropdown = [];
    this.user.parkings.forEach((item) => {
      this.filterDropdown.push({
        label: item.name,
        id: item.id,
      });
    });
  }

  gotoDashboard = () => {
    if (
      (this.role.toLowerCase() === 'vendor' &&
        this.user.type.toLowerCase() === 'admin') ||
      this.role.toLowerCase() === 'admin'
    ) {
      this.session.set('role', 'admin');
      this.sharedService.role.next(this.session.get('role'));
      this.router.navigate(['/parking/dashboard']);
    } else {
      this.router.navigate(['/parking/reports', this.parkingId], {
        replaceUrl: false,
      });
    }
  };

  toggleUser = () => {
    this.userOpen = !this.userOpen;
  };

  showResult = () => {
    if (this.searchKeyword.length > 0) {
      this.searchOpen = true;
    } else {
      this.searchOpen = false;
    }
  };
  openDD() {
    var index;
    this.filterDropdown[index].open = true;
  }

  closeDD() {
    var index;

    this.filterDropdown[index].open = false;
  }
  onSearchParking(event) {
    this.sharedService.search.next(event.target.value);
  }
  selectOption(option) {
    var index;

    this.filterDropdown[index].value = option.value;
    this.filterDropdown[index].label = option.label;
    this.closeDD();
  }

  actionSelectDD = ($event) => {
    var setParking = this.user.parkings.find((f) => {
      return f.id === $event.id;
    });
    this.session.set('parking', JSON.stringify(setParking));
    this.newParkingID = $event.id;
    if (this.newParkingID) {
      const urlArr = this.location.path().split('/');
      const url = `${urlArr[1]}/${urlArr[2]}/${this.newParkingID}`;
      this.router.navigate([url]);
    }
  };

  getParkings() {
    this.parkingService.get(APIS.PARKING.ADDPARKING.GETPARKING).subscribe(
      (data: any) => {
        if (data.length > 0) {
          this.user.parkings = data;
          data.forEach((item) => {
            this.filterDropdown.push({
              label: item.name,
              id: item.id,
            });
          });
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  logout = () => {
    this.session.destroy();
    this.router.navigate(['/login']);
    // this.router.navigate(['/signin']);
  };
  Setting() {
    var pId = this.parkingId || this.newParkingID;
    this.router.navigate([
      PATHS.MODULE_PARKING + PATHS.PARKING_SETTINGS_HOME + '/' + pId,
    ]);
    this.toggleUser();
  }
  openSystemAccount = () => {
    if (this.role === 'admin' || this.role === 'vendor')
      this.router.navigateByUrl(`/parking/settings/`);
  };

  gotoModule = (m) => {
    this.router.navigate([m.route]);
  };
}
