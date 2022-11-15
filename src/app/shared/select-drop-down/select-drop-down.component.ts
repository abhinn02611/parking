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
  selector: 'app-select-drop-down',
  templateUrl: './select-drop-down.component.html',
  styleUrls: ['./select-drop-down.component.scss'],
})
export class SelectDropDownComponent implements OnInit {
  @Input() options: any[];
  @Input() label: string;
  @Input() value: any = [];
  @Input() footerText: string;
  @Input() footerIcon = '/assets/images/icons/icon_plus.png';
  @Input() optionWidth: number;
  @Output() actionSelect = new EventEmitter();
  @Output() actionRemove = new EventEmitter();
  @Output() actionFooter = new EventEmitter();

  dropdownOpen = false;
  inputOpen = false;
  selectedValue: any = [];
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
    if (this.value) {
      console.log(this.label);
      this.inputOpen = true;
      this.value.forEach((val) => {
        this.selectedValue.push(val.name);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (!changes.value.currentValue) {
      this.inputOpen = false;
    } else {
      this.inputOpen = true;
    }
  }

  selectOption = (option: any) => {
    let exitingValue = null;
    exitingValue = this.value.find((v: any) => {
      return v.name === option.label;
    });
    if (exitingValue) {
      this.selectedValue = this.selectedValue.filter(
        (val) => val !== exitingValue.name
      );
      this.actionRemove.emit(option);
    } else {
      this.selectedValue.push(option.label);
      this.actionSelect.emit(option);
    }

    this.inputOpen = true;
  };

  toggleDropdown = () => {
    this.dropdownOpen = !this.dropdownOpen;
    const rect = this.preview.nativeElement.getBoundingClientRect();
    const fromTop = rect.y;
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

  checkSelectedValue(value: string) {
    let index = this.selectedValue.findIndex((val) => {
      return val === value;
    });

    return index !== -1;
  }

  getSelectedValue() {
    if (
      this.selectedValue &&
      this.selectedValue.length &&
      this.selectedValue.length !== 0
    ) {
      return this.selectedValue.length + ' selected';
    } else {
      return undefined;
    }
  }
}
