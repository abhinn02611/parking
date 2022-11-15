import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'form-input',
  templateUrl: './forminput.component.html',
  styleUrls: ['./forminput.component.scss'],
})
export class ForminputComponent implements OnInit {
  @Input() label: string;
  @ViewChild('input') input: ElementRef;
  @Input() inputModel: string;
  @Input() numberOnly = false;
  @Input() isReadonly = false;
  @Input() type = 'text';
  @Input() errorMessage = '';

  @Output() inputModelChange = new EventEmitter<string>();

  inputOpen = false;
  value = '';

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.inputModel &&
      changes.inputModel.currentValue &&
      changes.inputModel.currentValue !== ''
    ) {
      this.inputOpen = true;
      this.value = changes.inputModel.currentValue;
    }
  }

  constructor() {}

  ngOnInit() {}

  onFocus = () => {
    this.inputOpen = true;
    this.input.nativeElement.focus();
  };

  onBlur = () => {
    if (this.value.length == 0) {
      this.inputOpen = false;
    }
  };
}
