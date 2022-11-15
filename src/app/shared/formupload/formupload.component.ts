import { ParkingService } from './../../parking/parking.service';
import { Session } from './../../classes/session';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { APIS } from 'src/app/classes/appSettings';
import { SharedService } from '../shared.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'form-upload',
  templateUrl: './formupload.component.html',
  styleUrls: ['./formupload.component.scss'],
})
export class FormuploadComponent implements OnInit {
  @Input() label: string;
  @Input() uploadType: string;
  @Input() files = [];
  @Output() filesChange = new EventEmitter<Array<any>>();
  @ViewChild('input') input: ElementRef;

  inputOpen = false;
  droppeble = false;
  value = '';
  uploading = true;
  index = 1;

  defaultConfig = {
    index: this.index,
    status: 0,
    id: 0,
    res: {},
  };

  config = [Object.assign({}, this.defaultConfig)];

  constructor(
    private sharedService: SharedService,
    private session: Session,
    private parkingService: ParkingService
  ) {}

  // tslint:disable-next-line:typedef
  ngOnChanges(changes: SimpleChanges) {
    if (changes.files.currentValue) {
      this.config = [];
      for (const f of this.files) {
        this.index++;
        this.config.push({
          index: this.index,
          status: 2,
          id: f.id_image,
          res: f,
        });
      }
      this.defaultConfig.index = ++this.index;
      this.config.push(Object.assign({}, this.defaultConfig));
      this.index++;
    }
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.config = [];
    this.config.push(this.defaultConfig);
  }

  onFocus = () => {
    this.inputOpen = true;
    this.input.nativeElement.focus();
  };

  onBlur = () => {
    if (this.value.length === 0) {
      this.inputOpen = false;
    }
  };
  fileUploadClick = (refEl) => {
    const inputField =
      refEl.closest('.file-selector').nativeElement.children[0];
    inputField.click();
  };

  actionDragOver = (e) => {
    e.preventDefault();
    this.droppeble = true;
  };

  actionDragEnd = (e) => {
    this.droppeble = false;
    e.preventDefault();
  };

  actionDrop = (e) => {
    this.droppeble = false;
    e.preventDefault();
  };

  uploadFile = (e, index) => {
    const formData: FormData = new FormData();
    for (const file of e) {
      formData.append('file', file, file.name);
    }
    this.uploading = true;
    const i = this.config.findIndex((a) => a.index === index);
    this.config[i].status = 1;
    this.defaultConfig.index = ++this.index;
    this.config.push(Object.assign({}, this.defaultConfig));
    if (this.uploadType === 'parking') {
      let parkingId = this.session.get('parking')['id'];
      formData.append('parkingId', parkingId);
      this.parkingService.uploadParkingImages(formData).subscribe();
    } else {
      formData.append('type', 'Product');
      // this.sharedService.upload(formData).subscribe(
      //   (data) => {
      //     if (data[0].status === 'success') {
      //       setTimeout(() => {
      //         this.getFile(data[0].result, index);
      //       }, 5000);
      //     }
      //   },
      //   (err) => {
      //     this.uploading = false;
      //     console.error(err);
      //   }
      // );
    }
  };

  getFile = (id, index) => {
    this.sharedService.get(APIS.SALES.FILE.GET + id + '/').subscribe(
      (data) => {
        const i = this.config.findIndex((a) => a.index === index);
        if (i > -1) {
          if (data[0].status === 'success') {
            this.config[i].status = 2;
            this.config[i].res = data[0].result[0];
            this.sendOutput();
          } else {
            this.config[i].status = 0;
          }
        }
      },
      (err) => {
        this.uploading = false;
        const i = this.config.findIndex((a) => a.index === index);
        if (i > -1) {
          this.config[i].status = 0;
        }
        console.error(err);
      }
    );
    this.uploading = false;
  };

  deleteFile = (index) => {
    const i = this.config.findIndex((a) => a.index === index);
    if (i > -1) {
      this.config.splice(i, 1);
      this.sendOutput();
    }
  };

  sendOutput = () => {
    const uploaded = [];
    this.config.map((a) => {
      if (a.status === 2) {
        uploaded.push(a.res);
      }
    });
    this.filesChange.emit(uploaded);
  };
}
