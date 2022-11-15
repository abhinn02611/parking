import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'form-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
})
export class ModelComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() labelCancel: string;
  @Input() labelPrimary: string;
  @Input() labelSecondary: string;
  @Input() width: string;
  @Input() height: string;
  @Input() class: string;
  @Input() cancelPosition = 'top';
  @Input() loaderPrimary = false;
  @Input() confirm = false;
  @Input() scroll = true;
  @Input() confirmParam = {};
  @Input() total = '';
  @Input() linkSharePass = '';

  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {}

  onCancel = () => {
    this.actionCancel.emit();
  };
  onPrimary = () => {
    this.actionPrimary.emit();
  };
  onSecondry = () => {
    this.actionSecondary.emit();
  };
  getWidth = () => {
    if (this.width) {
      return this.width;
    } else {
      return '';
    }
  };
  getHeight = () => {
    if (this.height) {
      return parseInt(this.height, 10);
    } else {
      return '';
    }
  };

  formatDateShare = (date) => {
    if (!date) {
      return '';
    }
    return moment(date).format('ddd DD MMM YY');
  };
}
