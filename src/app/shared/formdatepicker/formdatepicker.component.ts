import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DatePickerComponent } from 'ng2-date-picker';
import * as moment from 'moment';

@Component({
  selector: 'form-datepicker',
  templateUrl: './formdatepicker.component.html',
  styleUrls: ['./formdatepicker.component.scss']
})
export class FormdatepickerComponent implements OnInit {

  @Input() label: string;
  @ViewChild('input') input: ElementRef;
  @Input() inputModel: string;
  @Input() numberOnly = false;
  @Output() inputModelChange = new EventEmitter<string>();
  @ViewChild('dayPicker') datePicker: DatePickerComponent;

  inputOpen = false;
  value = '';
  placeholder = '';
  selected = null;
  config = {
    theme: '',
    format: 'ddd DD MMM YY'
  };
  dpOpen = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputModel && changes.inputModel.currentValue && changes.inputModel.currentValue !== '') {
      this.inputOpen = true;
      this.selected = moment(changes.inputModel.currentValue);
      this.value = this.selected.format('ddd DD MMM YY');
    }
  }

  constructor() {

  }

  ngOnInit() {
    if (this.inputModel !== '') {
      this.inputOpen = true;
      this.selected = moment(this.inputModel);
    }
  }

  onFocus = () => {
    this.inputOpen = true;
    this.input.nativeElement.focus();
  }

  onBlur = () => {
    if (this.value.length === 0) {
      this.inputOpen = false;
    }
  }

  openPicker = () => {
    this.dpOpen = true;
  }

  closePicker = (date) => {
    this.dpOpen = false;
    this.inputOpen = true;
    this.value = this.selected.format('ddd DD MMM YY');
    this.inputModelChange.emit(this.value);
  }

  formatDate = (date) => {
    if ((!date) || date === '' || date === 'undefined' || date === null) {
      return '';
    }
    this.value = date.format('ddd DD MMM YY');
    return this.value;
  }

}
