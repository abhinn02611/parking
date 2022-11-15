import { Component, OnInit } from '@angular/core';
import { Globals } from '../../classes/globals';

@Component({
  selector: 'sistem-allleads',
  templateUrl: './allleads.component.html',
  styleUrls: ['./allleads.component.scss'],
  providers: [Globals]
})
export class AllleadsComponent implements OnInit {
  heading = 'All Leads';
  domain = '';
  menuSwitchStatus: boolean = false;

  constructor(private globals: Globals) { 
   
  }

  ngOnInit() {
    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((status) => {
      this.menuSwitchStatus = status;
    });

  }

  switchMenu = (status) => {
    this.menuSwitchStatus = status;
  } 

}
