import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PATHS } from 'src/app/classes/appSettings';
import { Session } from 'src/app/classes/session';

@Component({
  selector: 'app-parksettings-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss'],
})
export class LeftComponent implements OnInit {
  @Input() activePath = '';
  @Output() actionEdit = new EventEmitter();
  @Output() actionNavigate = new EventEmitter();
  role: string = '';
  path = PATHS;
  active = PATHS.SETTINGS + 'undefined';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private session: Session
  ) {
    this.role = this.session.get('role');
    const parts = this.router.url.split('/');

    this.active = parts[1] + '/' + parts[2];
    this.router.events.subscribe((val) => {});
  }

  ngOnInit() {}

  isActive = (p) => {
    if (p === this.activePath) {
      return true;
    }
    return this.active === p;
  };

  moveTo = (p) => {
    this.actionNavigate.emit(p);
  };

  moveToDashboard() {
    this.router.navigate(['/parking/dashboard']);
  }
}
