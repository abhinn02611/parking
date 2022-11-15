import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'form-textarea',
  templateUrl: './formtextarea.component.html',
  styleUrls: ['./formtextarea.component.scss'],
})
export class FormtextareaComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() max: number;
  @ViewChild('input') input: ElementRef;

  @Input() inputModel: string;
  @Output() inputModelChange = new EventEmitter<string>();

  inputOpen = false;
  value = '';
  maxvalue = 0;
  textlength = 0;

  constructor() {
    if (this.max > 0) {
      this.maxvalue = this.max;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (
      changes.inputModel.currentValue &&
      changes.inputModel.currentValue !== ''
    ) {
      this.inputOpen = true;
    }
  }

  ngOnInit() {}

  getHeight(input: any) {
    input.style.height = input.scrollHeight + 'px';
  }

  onFocus = () => {
    this.inputOpen = true;
    this.input.nativeElement.focus();
  };

  onBlur = () => {
    if (this.value.length === 0) {
      this.inputOpen = false;
    }
  };

  onKeyUp = (event: any) => {
    if (this.max > 0) {
      this.textlength = this.max - this.value.length;
      if (this.textlength < 0) {
        this.value = this.value.substring(0, this.max);
      }
    }

    this.input.nativeElement.style.height = '16px';
    this.input.nativeElement.style.height =
      0 + this.input.nativeElement.scrollHeight + 'px';
  };
}
