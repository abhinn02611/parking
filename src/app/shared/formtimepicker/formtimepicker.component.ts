import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DatePickerComponent } from 'ng2-date-picker';
import * as moment from 'moment';

@Component({
  selector: 'form-timepicker',
  templateUrl: './formtimepicker.component.html',
  styleUrls: ['./formtimepicker.component.scss']
})
export class FormtimepickerComponent implements OnInit {

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
    format: 'hh:mm a'
  };
  dpOpen = false;

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.inputModel && changes.inputModel.currentValue && changes.inputModel.currentValue !== '') {
    //   this.inputOpen = true;
    //   this.selected = moment(changes.inputModel.currentValue).toISOString();
    //   this.value = changes.inputModel.currentValue;
    // }
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
    this.inputOpen = true;
  }

  closePicker = (date) => {
    this.dpOpen = false;
    this.inputOpen = true;
    this.value = this.selected.format('ddd DD MMM YY');
    this.inputModelChange.emit(this.value);
  }

  onOk = () => {
    this.inputOpen = true;
    this.dpOpen = false;
    this.value = this.selected.format('hh:mm a');
    this.inputModelChange.emit(this.value);
  }

  formatTime = (date) => {
    if ((!date) || date === '' || date === 'undefined' || date === null) {
      return '';
    }
    this.value = date.format('hh:mm a');
    return this.value;
  }

}
