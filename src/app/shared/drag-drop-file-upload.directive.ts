import { Directive, EventEmitter, Output, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDragDropFileUpload]'
})
export class DragDropFileUploadDirective {

  // constructor(el: ElementRef) {
  //   el.nativeElement.classList.add("bg-success", "text-white");
  //   el.nativeElement.style.backgroundColor = 'yellow';
  //  }

  @Output() fileDropped = new EventEmitter<any>();

  @HostBinding('style.border') private border = '1px solid #ddd';

  // Dragover Event
  @HostListener('dragover', ['$event']) dragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this.border = '1px dashed #FF3B30';
  }

  // Dragleave Event
  @HostListener('dragleave', ['$event']) public dragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this.border = '1px solid #ddd';
  }

  // Drop Event
  @HostListener('drop', ['$event']) public drop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.border = '1px solid #ddd';
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }

}
