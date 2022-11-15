import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  DoCheck,
  AfterViewChecked,
} from '@angular/core';
import { APIS } from 'src/app/classes/appSettings';
import { ParkingService } from 'src/app/parking/parking.service';

@Component({
  selector: 'app-add-parking-rate',
  templateUrl: './add-parking-rate.component.html',
  styleUrls: ['./add-parking-rate.component.scss'],
})
export class AddParkingRateComponent
  implements OnInit, OnChanges, AfterViewInit, AfterViewChecked
{
  @Input() editId = '';
  @Input() parking_id = '';
  @Input() group: any = {};
  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();
  @Output() actionDelete = new EventEmitter();

  @ViewChildren('draggable') draggable: QueryList<ElementRef>;
  @ViewChildren('dragLstItem') dragList: QueryList<ElementRef>;

  prices = [{ type: '', price: '' }];
  remarks = '';
  vehicleTypes = [];
  formData = {
    vehicleTypeId: '',
    priceId: '',
    vehicleTypeName: 'None',
    status: 'active',
    statusName: 'Active',
    remarks: '',
  };
  types = [];
  showAddVehicleType = false;
  showAddType = false;
  rates = [];
  ratesFinal = [];
  dragListRatesSize: number = 0;
  dragStartIndex: number;
  finalRateOrderAfterDrag: string[] = [];

  constructor(private parkingService: ParkingService) {}

  ngAfterViewChecked(): void {
    let dragListItems = this.dragList.toArray().map((el) => el.nativeElement);

    if (dragListItems.length !== this.dragListRatesSize) {
      this.addDragAndDropListener();
      this.dragListRatesSize = dragListItems.length;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {}

  isArray(val): boolean {
    return Array.isArray(val);
  }

  ngOnInit(): void {
    this.formData.vehicleTypeId = this.group.vehicle.id;
    this.formData.vehicleTypeName = this.group.vehicle.name;
    this.remarks = this.group.price.remarks;
    this.group.rates.map((rate: any, index: number) => {
      const total = (
        parseFloat(rate.rate) +
        (parseFloat(rate.rate) * parseFloat(rate.tax)) / 100
      ).toFixed(2);

      const v = {
        startHour: rate.startHour,
        endHour: rate.endHour,
        rate: rate.rate,
        tax: rate.tax,
        total: total,
        new: false,
        status: rate.status,
        id: rate.id,
      };
      this.ratesFinal[index] = v;
      this.rates.push(v);
      this.finalRateOrderAfterDrag.push(v.id);
    });
    if (this.group.rates.length == 0) {
      this.rates.push({
        startHour: '',
        endHour: '',
        rate: '',
        tax: 18,
        total: '',
        new: true,
        status: true,
        id: '',
      });
    }

    if (this.editId !== '') {
    }
  }

  ngAfterViewInit(): void {
    this.addDragAndDropListener();
  }

  addDragAndDropListener() {
    let draggables = this.draggable.toArray().map((el) => el.nativeElement);
    let dragListItems = this.dragList.toArray().map((el) => el.nativeElement);

    draggables.forEach((draggable) => {
      if (draggable.getAttribute('listener') !== 'true') {
        draggable.setAttribute('listener', 'true');
        draggable.addEventListener('dragstart', this.handleDragStart);
      }
    });

    dragListItems.forEach((item) => {
      if (item.getAttribute('listener') !== 'true') {
        item.setAttribute('listener', 'true');
        item.addEventListener('dragover', this.handleDragOver);
        item.addEventListener('drop', this.handleDragDrop);
        item.addEventListener('dragenter', this.handleDragEnter);
        item.addEventListener('dragleave', this.handleDragLeave);
      }
    });
  }

  handleDragEnter = (e: DragEvent) => {
    let target = <HTMLElement>e.target;
    target.classList.add('over');
  };

  handleDragLeave = (e: DragEvent) => {
    let target = <HTMLElement>e.target;
    target.classList.remove('over');
  };

  handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  handleDragStart = (e: DragEvent) => {
    let target = <HTMLElement>e.target;
    this.dragStartIndex = +target.closest('li').getAttribute('data-index');
  };

  handleDragDrop = (e: DragEvent) => {
    let target = <HTMLLIElement>e.target;
    const dragEndIndex = +target.closest('li').getAttribute('data-index');
    this.swapItems(dragEndIndex);
  };

  swapItems = (toIndex: number) => {
    const dragList = this.dragList.toArray().map((el) => el.nativeElement);
    const fromIndex = this.dragStartIndex;
    const itemOne = dragList[fromIndex].querySelector('.draggable');
    const itemTwo = dragList[toIndex].querySelector('.draggable');
    dragList[fromIndex].appendChild(itemTwo);
    dragList[toIndex].appendChild(itemOne);
    this.generateFinalRateOrder();
  };

  generateFinalRateOrder() {
    const dragList = this.dragList.toArray().map((el) => el.nativeElement);
    this.finalRateOrderAfterDrag = [];
    dragList.forEach((item) => {
      const id = item.querySelector('.draggable').getAttribute('id');
      this.finalRateOrderAfterDrag.push(id);
    });
  }

  onCancel = () => {
    this.actionCancel.emit();
  };
  onPrimary = () => {
    this.saveRate(1);
  };

  saveRate = (nextAction: any) => {
    const finalRatesOrder = [];

    this.finalRateOrderAfterDrag.forEach((id) => {
      this.ratesFinal.forEach((rate) => {
        if (rate.id === id) {
          finalRatesOrder.push(rate);
        }
      });
    });

    this.ratesFinal = finalRatesOrder;
    const rateData: any = {
      priceId: this.group.price.id,
      priceHours: this.ratesFinal,
      vehicleTypeId: this.formData.vehicleTypeId,
      type: 'General',
      remarks: this.remarks,
      buffer: 5,
      status: this.formData.status == 'active',
    };
    this.parkingService
      .postJson(
        APIS.PARKING.RATES.UPDATE_RATE_NEW.replace(
          '{PARKING_ID}',
          this.parking_id
        ),
        rateData
      )
      .subscribe(
        (res: any) => {
          this.actionPrimary.emit(res.id);
        },
        (err) => {}
      );
  };

  deletePriceHour = (id: any) => {
    const url = APIS.PARKING.RATES.DELETE_HOUR.replace(
      '{PARKING_ID}',
      this.parking_id
    ).replace('{HOUR_ID}', id);
    this.parkingService.delete(url).subscribe(
      (data: any) => {
        this.actionPrimary.emit();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  addMorePrice = () => {
    this.prices.push({ type: '', price: '' });
  };

  removePrice = (index) => {
    this.prices.splice(index, 1);
  };

  actionVehicleTypeSelect = (vt) => {
    this.formData.vehicleTypeId = vt.value;
    this.formData.vehicleTypeName = vt.label;
  };

  actionStatusSelect = (vt) => {
    this.formData.status = vt.value;
    this.formData.statusName = vt.label;
  };

  actionChangePriceType = (type, i) => {
    this.prices[i].type = type.value;
  };

  openUpdateVehicleTypeModal = () => {
    this.showAddVehicleType = true;
  };

  cancelAddVehicleType = () => {
    this.showAddVehicleType = false;
  };

  openUpdateTypeModal = () => {
    this.showAddType = true;
  };

  print = (v) => {
    return JSON.stringify(v);
  };

  addMoreRates = () => {
    this.rates.push({
      startHour: '',
      endHour: '',
      rate: '',
      tax: 18,
      total: '',
      new: true,
      status: true,
      id: '',
    });
  };

  deleteRate = (i: number) => {
    this.ratesFinal.splice(i, 1);
    let drate = this.rates.splice(i, 1);
    this.deletePriceHour(drate[0].id);
  };

  updateRate = (i, rate) => {
    this.ratesFinal[i] = rate;
    this.finalRateOrderAfterDrag[i] = rate.id;
  };

  createFormModalTitle() {
    if (this.editId) {
      return 'Edit ' + this.group.vehicle.name + ' Parking Rate';
    }
    return (
      'Add ' + this.group.vehicle.name +
      ' Parking Rate'
    );
  }
}
