import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ParkingService } from '../parking/parking.service';

@Component({ selector: 'pz-component', template: '' })
export abstract class CommonComponent implements OnInit, OnDestroy {
  private appDetailSub?: Subscription;

  constructor(protected parkingService: ParkingService,private activatedRoute:ActivatedRoute) {}

  ngOnInit(): void {
    this.appDetailSub = this.activatedRoute.params
      .pipe(skip(1))
      .subscribe(
        (params) =>
        params['id'] && typeof this.onAppKeyChanged === 'function' && this.onAppKeyChanged()
      );
  }

  ngOnDestroy(): void {
    this.appDetailSub?.unsubscribe();
  }

  protected abstract onAppKeyChanged(): void;
}