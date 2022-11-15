import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-total-amount',
  templateUrl: './total-amount.component.html',
  styleUrls: ['./total-amount.component.scss'],
})
export class TotalAmountComponent implements OnInit {
  filterDropdown:any[];
  constructor() {
        this.filterDropdown=[
     {label:"Select Parking",options:[{label:"Current Day",},{label:"Current Month",},{label:"Current Year",}]},
    ];
  }

  ngOnInit(): void {}
  actionSelectDD($event){

  }
}
