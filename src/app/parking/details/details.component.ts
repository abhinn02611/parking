import { Component, OnInit, ViewChild, HostListener, Inject, ElementRef } from '@angular/core';
import { Globals } from '../../classes/globals';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../services/window.service';

@Component({
  selector: 'sistem-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [Globals]
})
export class DetailsComponent implements OnInit {

  menuSwitchStatus: boolean = false;
  sidebarFixed: boolean = false;
  leftSidebarFixed: boolean = false;
  leftStyle: any = {};
  lastOffset: number = 0;
  topOffset: number = 0;

  @ViewChild('leftcontent') leftcontent: ElementRef;


  constructor(private globals: Globals, @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window) {

  }

  ngOnInit() {
    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((menuSwitchStatus) => {
      this.menuSwitchStatus = menuSwitchStatus;
    });
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const offset = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    const direction = (this.lastOffset > offset) ? 0 : 1;
    const topSpace = 64 + 81 + 40;
    this.lastOffset = offset;
    const height = this.leftcontent.nativeElement.offsetHeight;
    if (height > window.innerHeight - topSpace) {

      if (direction === 1) {
        if (this.leftStyle.position !== 'fixed') {
          if (offset + this.topOffset > height - window.innerHeight + topSpace && this.leftStyle.section !== '4') {
            this.topOffset = height - window.innerHeight;
            this.leftStyle = { position: 'fixed', top: '-' + this.topOffset + 'px', 'section': '1' };
          }else{
            if (offset + this.topOffset > height - window.innerHeight + topSpace && this.leftStyle.section !== '6') {
              this.topOffset = offset + window.innerHeight - height - topSpace;
              this.leftStyle = { position: 'absolute', top: (this.topOffset) + 'px', 'section': '4' };
            }
          }
        } else {
          if (offset > topSpace && this.leftStyle.section !== '1') {
            this.topOffset = topSpace;
            this.leftStyle = { position: 'absolute', top: '-' + this.topOffset + 'px', 'section': '3' };
          }
        }
      }
      if (direction === 0) {
        if (this.leftStyle.position !== 'absolute') {
          if (offset + this.topOffset > height - window.innerHeight + topSpace && this.leftStyle.section !== '6') {
            this.topOffset = offset + window.innerHeight - height - topSpace;
            this.leftStyle = { position: 'absolute', top: (this.topOffset) + 'px', 'section': '4' };
          }

          if (offset < topSpace - 64 && (this.leftStyle.section === '6' || this.leftStyle.section === '5')) {
            this.topOffset = 0;
            this.leftStyle = { position: 'absolute', top: (this.topOffset) + 'px', 'section': '7' };
          }
        } else {
          if (offset - 64 < this.topOffset - topSpace && this.leftStyle.section !== '4' && this.leftStyle.section !== '2') {
            this.topOffset = 64;
            this.leftStyle = { position: 'fixed', top: (this.topOffset) + 'px', 'section': '5' };
          }
          if (offset < this.topOffset + topSpace - 64 && this.leftStyle.section === '4') {
            this.topOffset = 64;
            this.leftStyle = { position: 'fixed', top: (this.topOffset) + 'px', 'section': '6' };
          }
        }
      }
    }else{
      if (offset > 94 && this.leftSidebarFixed == false) {
        this.leftSidebarFixed = true;
      }
      if (offset <= 94 && this.leftSidebarFixed == true) {
        this.leftSidebarFixed = false;
      }
    }

    if (offset > topSpace -64 && this.sidebarFixed == false) {
      this.sidebarFixed = true;
    }
    if (offset <= topSpace -64 && this.sidebarFixed == true) {
      this.sidebarFixed = false;
    }
  }

}
