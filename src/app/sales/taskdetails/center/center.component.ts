import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PATHS } from 'src/app/classes/appSettings';

@Component({
  selector: 'sistem-taskdetails-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss']
})
export class CenterComponent implements OnInit {

  @Input() task: any;
  @Input() currency = '';
  @Output() editImage = new EventEmitter();

  ordervalues = [];
  total = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  isArray(val): boolean { return Array.isArray(val); }



}
