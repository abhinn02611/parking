import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { APIS } from 'src/app/classes/appSettings';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  @Output() actionCancel = new EventEmitter();

  categories = [];
  newCategories = [{ title: '' }];
  deletedCategorisIds = [];
  apiRequest = 0;
  apiResponse = 0;
  loaderPrimary = false;
  editId = 0;
  editTitle = '';
  confirm = false;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories = () => {
    this.sharedService.get(APIS.SALES.CATEGORY.LIST).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.categories = data[0].result.map(m => {
            return { label: m.category_name, value: m.id_category };
          });
        }
      }, console.error
    );
  }

  onCancel = () => {
    this.actionCancel.emit();
  }

  addMoreCategory = () => {
    this.newCategories.push({ title: '' });
  }

  removeCategory = (index) => {
    this.newCategories.splice(index, 1);
  }

  removeExistingCategory = (index) => {
    console.log(index);
    this.deletedCategorisIds.push(this.categories[index].value);
    this.categories.splice(index, 1);
    this.confirm = true;
  }

  editExistingCategory = (id, title) => {
    this.editId = id;
    this.editTitle = title;
  }

  updateExistingCategory = () => {
    this.sharedService.postJson(APIS.SALES.CATEGORY.UPDATE_CATEGORY, {category_name: this.editTitle, id_category: this.editId}).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.fetchCategories();
        }
      }, console.error
    );
    this.editId = 0;
  }

  saveCategories = () => {
    if (this.loaderPrimary) {
      return;
    }
    this.apiRequest = this.newCategories.filter(x => x.title.trim() !== '').length + this.deletedCategorisIds.length;
    if (this.apiRequest === 0) {
      return;
    }
    this.loaderPrimary = true;
    this.apiResponse = 0;
    for (const elem of this.deletedCategorisIds) {
      this.sharedService.postJson(APIS.SALES.CATEGORY.DELETE_CATEGORY, { id_category: elem })
      .subscribe(this.responseReceived, this.responseReceived);
    }
    for (const elem of this.newCategories) {
      if (elem.title.trim() !== '') {
        this.sharedService.postJson(APIS.SALES.CATEGORY.ADD_CATEGORY, { category_name: elem.title.trim() })
          .subscribe(this.responseReceived, this.responseReceived);
      }
    }
  }

  responseReceived = (data) => {
    this.apiResponse++;
    if (this.apiResponse === this.apiRequest) {
      this.loaderPrimary = false;
      this.newCategories = [{ title: '' }];
      this.deletedCategorisIds = [];
      this.fetchCategories();
      this.actionCancel.emit();
    }
  }

}
