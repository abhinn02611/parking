import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ACTIONS } from 'src/app/classes/appSettings';

@Component({
  selector: 'list-header',
  templateUrl: './listheader.component.html',
  styleUrls: ['./listheader.component.scss']
})
export class ListheaderComponent implements OnInit {
  @Input() heading: string;
  @Input() tags: string[];
  @Input() showToggleInfoButton = true;
  @Input() showAddNewButton :boolean;
  @Input() actions = [];
  @Output() actionAddNew = new EventEmitter();
  @Output() actionInfoToggle = new EventEmitter();
  @Output() actionGroup = new EventEmitter();
  @Input() showBackButton = false;
  @Output() actionBack = new EventEmitter();

  userOpen = false;
  moduleOpen = false;
  dropdownOpen = false;
  ac = ACTIONS;

  constructor() {
  }

  ngOnInit() {
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
