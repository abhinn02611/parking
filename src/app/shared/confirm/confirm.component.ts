import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  @Input() title: string;
  @Input() content: string;
  @Input() note: string;
  @Input() labelCancel = 'Cancel';
  @Input() labelConfirm = 'Confirm';
  @Input() width = '300px';
  @Input() height = 'auto';
  @Input() class: string;
  @Input() contentPosition = 'center';
  @Input() buttonPosition = 'center';
  @Input() dialog = false;

  @Output() actionCancel = new EventEmitter();
  @Output() actionConfirm = new EventEmitter();

  showConfirm = false;

  constructor() {
  }

  @HostListener('click', ['$event.target', '$event'])
  onClick(target, e) {
    e.stopPropagation();
    e.preventDefault();
    this.showConfirm = true;
  }


  ngOnInit() {

  }

  onCancel = () => {
    this.showConfirm = false;
    this.actionCancel.emit();
    setTimeout(() => {
      this.showConfirm = false;
      this.actionCancel.emit();
    }, 100);
  }

  onConfirm = () => {
    setTimeout(() => {
      this.showConfirm = false;
      this.actionConfirm.emit();
    }, 100);
  }

  getWidth = () => {
    if (this.width) {
      return this.width;
    } else {
      return '';
    }
  }
  getHeight = () => {
    if (this.height) {
      return this.height;
    } else {
      return '';
    }
  }
}
