import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class Globals {
  sidebarOpen: boolean = false;
  globalVarUpdate: Observable<boolean>;
  globalVarObserver: Observer<boolean>;

  constructor() {
    const self = this;
    const sidebar = localStorage.getItem('sidebar');
    this.sidebarOpen = sidebar === '1' ? true : false;
    this.globalVarUpdate = Observable.create((observer: Observer<boolean>) => {
      self.globalVarObserver = observer;
    });
  }

  sidebarUpdate = (newValue: boolean) => {
    localStorage.setItem('sidebar', newValue ? '1' : '0');
    this.sidebarOpen = newValue;
    console.log("observerUpdated", this.globalVarObserver);
    this.globalVarObserver.next(this.sidebarOpen);
  }
}