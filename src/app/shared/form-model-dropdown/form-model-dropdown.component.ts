import { Component, OnInit, ViewChild, ElementRef, Input, HostListener, EventEmitter, Output, SimpleChanges } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-model-dropdown',
  templateUrl: './form-model-dropdown.component.html',
  styleUrls: ['./form-model-dropdown.component.scss']
})
export class FormModelDropdownComponent implements OnInit {

  @Input() label: string;
  @Input() value: string;

  @Output() actionClick = new EventEmitter();

  inputOpen = false;
  location = 'bottom';
  @ViewChild('preview') preview: ElementRef;


  constructor() {
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.value.currentValue && changes.value.currentValue !== '') {
      this.inputOpen = true;
    }
  }

  ngOnInit() {
    this.inputOpen = this.value && this.value.length > 0;
  }

  selectOption = () => {
    this.actionClick.emit();
  }
}
