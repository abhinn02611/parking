import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'sistem-taskdetails-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {

  @Input() task: any;
  @Input() currency = '';
  @Output() actionEdit = new EventEmitter();


  constructor() {

  }

  ngOnInit() {
  }


  getDueDate = (dt) => {
    return moment(dt.replace('Z', '')).format('ddd DD MMM YY');
  }

  getDueTime = (dt) => {
    return moment(dt.replace('Z', '')).format('hh:mm a');
  }

}
