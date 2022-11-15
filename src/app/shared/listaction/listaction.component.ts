import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'list-action',
  templateUrl: './listaction.component.html',
  styleUrls: ['./listaction.component.scss'],
})
export class ListactionComponent implements OnInit {
  menuOpen = false;
  @Input() menuConfig = [];

  menuConfigLocal = [];

  constructor() {}

  ngOnInit() {
    this.menuConfigLocal = Object.assign([], this.menuConfig);
  }

  toggleMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.menuOpen = !this.menuOpen;
  };

  nextAction = (e, action) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.menuOpen = false;
    action();
  };
}
