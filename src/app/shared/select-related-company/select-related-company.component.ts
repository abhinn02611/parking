import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../shared.service';
import { SalesService } from '../../sales/sales.service';


@Component({
  selector: 'app-select-related-company',
  templateUrl: './select-related-company.component.html',
  styleUrls: ['./select-related-company.component.scss']
})
export class SelectRelatedCompanyComponent implements OnInit {

  @Input() selectedCompany = '';
  @Input() selectedCompanies = [];
  @Input() title = 'Choose Related Company';
  @Input() multi = false;
  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();

  companyList: any[];
  companyListView: any[];
  loading = false;
  loaderPrimary = false;
  orderBy = '';
  reverse = true;

  headerMap = {
    company_name: 'COMPANY NAME',
    company_code: 'COMPANY CODE',
    category_name: 'CATEGORY'
  };
  selectall = false;
  searchKeyword = '';
  selectedCompanyObject = null;
  selectedCompanyObjects = [];
  constructor(private sharedService: SharedService, private salesService: SalesService) {

  }

  isArray(val): boolean { return Array.isArray(val); }

  inArray = (val, stack) => (stack.findIndex(val) > -1);

  ngOnInit(): void {
    // alert(this.selectedCompany);
    this.loadAPIData();
  }

  loadAPIData = () => {
    this.loading = true;

    this.sharedService.get(APIS.SALES.COMPANY.LIST + this.salesService.getUserRole() + '/' +
      this.salesService.getUserId() + '/').subscribe(
        data => {
          this.loading = false;
          if (data[0].status === 'success') {
            this.companyList = data[0].result;
            this.filtercompanyList();
          }
        },
        err => {
          this.loading = false;
          console.error(err);
        },
        () => console.log('done loading domain')
      );
  }

  filtercompanyList = () => {
    this.companyListView = this.companyList.map((a: any): Array<any> => {
      Object.keys(a).map(k => a[k] = typeof a[k] === 'string' ? a[k].trim() : a[k]);
      if (this.multi === true) {
        const pos = this.selectedCompanies.findIndex(b => a.store_id === b.store_id);
        if (pos > -1) {
          this.selectedCompanyObjects.push(a);
        }
      } else {
        if (this.selectedCompany === a.store_name) {
          this.selectedCompanyObject = a;
        }
      }
      return a;
    });
  }

  updateOrderBy = (type: string) => {
    this.orderBy = type;
    this.reverse = !this.reverse;
  }

  selectItem = (company: any) => {
    console.log('sele', company);
    if (this.multi === true) {
      const pos = this.selectedCompanyObjects.findIndex(a => a.store_id === company.store_id);
      if (pos > -1) {
        this.selectedCompanyObjects.splice(pos, 1);
      } else {
        this.selectedCompanyObjects.push(company);
      }
    } else {
      this.selectedCompanyObject = company;
    }

  }

  showResult = () => {
    this.companyListView = this.companyList.filter((a: any) => {
      if (this.searchKeyword.length) {
        if (a.store_name.toLowerCase().includes(this.searchKeyword.toLowerCase()) === false) {
          return false;
        }
      }
      return true;
    });
  }

  print = (v) => {
    return JSON.stringify(v);
  }

  onPrimary = () => {
    if (this.multi === true) {
      this.actionPrimary.emit(this.selectedCompanyObjects);
    } else {
      this.actionPrimary.emit(this.selectedCompanyObject);
    }
  }

  isSelected = (id: any) => {
    if (this.multi === true) {
      const pos = this.selectedCompanyObjects.findIndex(a => a.store_id === id);
      return pos > -1;
    } else {
      return this.selectedCompanyObject && this.selectedCompanyObject.store_id === id;
    }
  }

}
