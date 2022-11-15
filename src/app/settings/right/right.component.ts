import { Component, Input, OnInit } from '@angular/core';
import { PATHS } from 'src/app/classes/appSettings';

@Component({
  selector: 'app-settings-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.scss']
})
export class RightComponent implements OnInit {

  @Input() component = PATHS.SETTINGS_DASHBOARD;

  constructor() { }

  ngOnInit() {
  }

}
