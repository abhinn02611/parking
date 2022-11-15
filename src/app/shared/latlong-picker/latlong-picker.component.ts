import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { SharedService } from '../shared.service';
import { SalesService } from '../../sales/sales.service';
import { WINDOW } from '../../services/window.service';
import { ViewChild } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'latlong-picker',
  templateUrl: './latlong-picker.component.html',
  styleUrls: ['./latlong-picker.component.scss']
})
export class LatlongPickerComponent implements OnInit {

  @Input() width = 200;
  @Input() height = 200;
  @Input() latitude = 18.5793;
  @Input() longitude = 73.8143;

  @Input() address = '';

  @ViewChild('gmap', { static: true }) gmapElement: any;
  map: any;
  google: any;
  marker: any;
  latLng: any;

  @Output() actionChange = new EventEmitter();

  constructor(private sharedService: SharedService, private salesService: SalesService, @Inject(WINDOW) private window: Window) {
    // tslint:disable-next-line:no-string-literal
    this.google = this.window['google'];
  }

  isArray(val): boolean { return Array.isArray(val); }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.address && changes.address.currentValue && changes.address.currentValue !== '') {
      this.getLongLatFromAddress(this.address);
    }
  }

  ngOnInit(): void {
    this.latLng = new this.google.maps.LatLng(this.latitude, this.longitude);
    const mapProp = {
      center: this.latLng,
      zoom: 15,
      mapTypeId: this.google.maps.MapTypeId.ROADMAP
    };
    this.map = new this.google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.marker = new this.google.maps.Marker({
      position: this.latLng,
      title: 'Your Position',
      map: this.map,
      draggable: true
    });
    this.google.maps.event.addListener(this.marker, 'dragend', () => {
      this.setPosition(this.marker.getPosition());
    });
    if (this.address !== '') {
      this.getLongLatFromAddress(this.address);
    }
  }

  onPrimary = () => {
    this.actionChange.emit({ latitude: this.latitude, longitude: this.longitude });
  }

  setPosition = (latLong: any) => {
    this.latitude = latLong.lat();
    this.longitude = latLong.lng();
    this.onPrimary();
  }

  getLongLatFromAddress = (address) => {
    const geocoder = new this.google.maps.Geocoder();
    geocoder.geocode({
      address
    }, (results, status) => {
      if (status === this.google.maps.GeocoderStatus.OK) {
        this.map.setCenter(results[0].geometry.location);
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
        this.marker.position = results[0].geometry.location;
        this.marker.map = this.map;
        this.map.setCenter(results[0].geometry.location);
        this.map.draggable = true;
        this.marker.setPosition(results[0].geometry.location);
        this.onPrimary();
      } else {
        // alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }



}
