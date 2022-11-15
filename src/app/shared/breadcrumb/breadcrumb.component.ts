import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbLink } from '../interfaces';

@Component({
  selector: 'sistem-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnChanges {

  @Input() links: Array<BreadcrumbLink> = [];
  pagination = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty('links')) {
    }
  }

  openLink = (link) => {
    this.router.navigate([link]);
  }

}
