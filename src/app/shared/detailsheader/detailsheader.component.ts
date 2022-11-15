import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ACTIONS } from '../../classes/appSettings';

@Component({
  selector: 'sistem-detailsheader',
  templateUrl: './detailsheader.component.html',
  styleUrls: ['./detailsheader.component.scss']
})
export class DetailsheaderComponent implements OnInit {

  @Input() salutation = '';
  @Input() name: string;
  @Input() shortname = '';
  @Input() department: string;
  @Input() company: string;
  @Input() showBackButton = true;
  @Input() showCompleteButton = false;
  @Input() showToggleInfoButton = false;
  @Input() actions = [];
  @Output() actionAddNew = new EventEmitter();
  @Output() actionInfoToggle = new EventEmitter();
  @Output() actionBack = new EventEmitter();
  @Output() actionComplete = new EventEmitter();
  @Output() actionGroup = new EventEmitter();
  @Input() tags: string[];

  userOpen = false;
  moduleOpen = false;
  dropdownOpen = false;
  ac = ACTIONS;

  constructor() {
  }

  ngOnInit() {
    console.log('actions', this.actions);
  }

  toggleModule = () => {
    this.moduleOpen = !this.moduleOpen;
  }

  toggleUser = () => {
    this.userOpen = !this.userOpen;
  }

  addNew = () => {
    this.actionAddNew.emit(1);
  }

  toggleInfo = () => {
    this.actionInfoToggle.emit(1);
  }


  toggleDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  emitAction = (action) => {
    this.actionGroup.emit(action);
  }

  shouldDisplayGroupAction = (action) => {
    return this.actions.findIndex(a => a === action) > -1;
  }

}
