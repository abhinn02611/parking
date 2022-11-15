import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-add-types',
  templateUrl: './add-types.component.html',
  styleUrls: ['./add-types.component.scss']
})
export class AddTypesComponent implements OnInit {

  @Output() actionCancel = new EventEmitter();
  @Input() categoryId = '';
  @Input() categoryName = '';

  types = [];
  newTypes = [{ title: '' }];
  deletedTypesIds = [];
  apiRequest = 0;
  apiResponse = 0;
  loaderPrimary = false;
  editId = 0;
  editTitle = '';
  confirm = false;


  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.fetchTypes();
  }

  fetchTypes = () => {
    this.sharedService.get(APIS.SALES.CATEGORY.TYPES_CATEGORY + this.categoryId + '/').subscribe(
      data => {
        if (data[0].status === 'success') {
          this.types = data[0].result.map(m => {
            return { label: m.category_typename, value: m.idcategory_type };
          });
        }
      },
      err => {
        console.error(err);
      },
      () => console.log('done uploading')
    );
  }

  onCancel = () => {
    this.actionCancel.emit();
  }

  addMoreType = () => {
    this.newTypes.push({ title: '' });
  }

  removeType = (index) => {
    this.newTypes.splice(index, 1);
  }

  removeExistingType = (index) => {
    console.log(index);
    this.deletedTypesIds.push(this.types[index].value);
    this.types.splice(index, 1);
    this.confirm = true;
  }

  editExistingCategory = (id, title) => {
    this.editId = id;
    this.editTitle = title;
  }

  updateExistingCategory = () => {
    this.sharedService.postJson(APIS.SALES.CATEGORY.UPDATE_CATEGORY_TYPE,
      {type_name: this.editTitle, id_categorytype: this.editId}).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.fetchTypes();
        }
      }, console.error
    );
    this.editId = 0;
  }

  saveCategories = () => {
    if (this.loaderPrimary) {
      return;
    }
    this.apiRequest = this.newTypes.filter(x => x.title.trim() !== '').length + this.deletedTypesIds.length;
    if (this.apiRequest === 0) {
      return;
    }
    this.loaderPrimary = true;
    this.apiResponse = 0;
    for (const elem of this.deletedTypesIds) {
      this.sharedService.postJson(APIS.SALES.CATEGORY.DELETE_CATEGORY_TYPE, { id_categorytype: elem })
        .subscribe(this.responseReceived, this.responseReceived);
    }
    for (const elem of this.newTypes) {
      if (elem.title.trim() !== '') {
        this.sharedService.postJson(APIS.SALES.CATEGORY.ADD_CATEGORY_TYPE, { id_category: this.categoryId, type_name: elem.title.trim() })
          .subscribe(this.responseReceived, this.responseReceived);
      }
    }
  }

  responseReceived = (data) => {
    this.apiResponse++;
    if (this.apiResponse === this.apiRequest) {
      this.loaderPrimary = false;
      this.newTypes = [{ title: '' }];
      this.deletedTypesIds = [];
      this.fetchTypes();
      this.actionCancel.emit();
    }
  }

}

