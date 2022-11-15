import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() options: any[];
  @Input() placeholder: string;
  @Input() selected: string;
  @Output() actionSelect = new EventEmitter();

  dropdownOpen = false;
  location = 'bottom';
  @ViewChild('preview') preview: ElementRef;

  constructor() { 
   
  }

  ngOnInit() {
   
  }

  selectOption = (i) => {
    this.selected = this.options[i].label;
    this.dropdownOpen = false;
    this.actionSelect.emit([this.options[i].value]);
  }

  toggleDropdown = () => {
    this.dropdownOpen = !this.dropdownOpen;
    const rect = this.preview.nativeElement.getBoundingClientRect();
    const fromTop = rect.y;
    const windowHeight = window.innerHeight;
    const bottomSpace = windowHeight - fromTop;
    let requireHeight = this.options.length * 35;
    requireHeight = (requireHeight > 200) ? 200 : requireHeight;
    if ( bottomSpace < requireHeight ) {
      this.location = 'top';
    } else {
      this.location = 'bottom';
    }
  }

}
