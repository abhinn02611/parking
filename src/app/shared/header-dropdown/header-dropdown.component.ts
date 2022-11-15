import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-header-dropdown',
  templateUrl: './header-dropdown.component.html',
  styleUrls: ['./header-dropdown.component.scss'],
})
export class HeaderDropdownComponent implements OnInit {
  @Input() options: any[];
  @Input() label: string;
  @Input() value: string;
  @Input() footerText: string;
  @Input() footerIcon = '/assets/images/icons/icon_plus.png';

  @Output() actionSelect = new EventEmitter();
  @Output() actionFooter = new EventEmitter();

  dropdownOpen = false;
  inputOpen = false;
  location = 'bottom';
  @ViewChild('preview') preview: ElementRef;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.dropdownOpen = false;
    }
  }

  constructor(private eRef: ElementRef) {}

  ngOnInit() {
    this.inputOpen = this.value && this.value.length > 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.value &&
      changes.value.currentValue &&
      changes.value.currentValue !== ''
    ) {
      this.inputOpen = true;
    }
  }

  selectOption = (i) => {
    this.value = this.options[i].label;
    this.dropdownOpen = false;
    this.inputOpen = true;
    this.actionSelect.emit(this.options[i]);
  };

  toggleDropdown = () => {
    this.dropdownOpen = !this.dropdownOpen;
    const rect = this.preview?.nativeElement.getBoundingClientRect();
    const fromTop = rect?.y;
    const windowHeight = window.innerHeight;
    const bottomSpace = windowHeight - fromTop;
    let requireHeight = this.options ? this.options.length * 35 : 0;
    requireHeight = requireHeight > 200 ? 200 : requireHeight;
    if (bottomSpace < requireHeight) {
      this.location = 'top';
    } else {
      this.location = 'bottom';
    }
  };

  onFooterActionClick = () => {
    this.toggleDropdown();
    this.actionFooter.emit();
  };
}
