import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-setting-data',
  templateUrl: './data.component.html',
  styleUrls: ['../../settings.component.scss']
})
export class DataComponent implements OnInit {

  activeBox = 1;

  constructor() {
  }

  ngOnInit() {

  }

  toggleData = (n) => {
    console.log('n', n);
    this.activeBox = n;
  }

}
