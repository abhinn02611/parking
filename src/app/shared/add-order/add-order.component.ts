import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../shared.service';
import { SalesService } from '../../sales/sales.service';


@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  @Input() editId = '';
  @Input() company = null;
  @Input() contact = null;

  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  products = [];
  total = 'Total: 0';
  formData = {
    orderOwner: '',
    paymethod: 'cash',
    orderamount: '0',
    paymentOrderId: '',
    locLongtitute: '0',
    orderSubject: '',
    shippingCharge: '',
    storeId: '',
    storeName: '',
    locLatitute: '0',
    assignedTo: '0',
    assignedToName: 'Self',
    orderdetail: '',
    contactId: '',
    contactName: ''
  };
  showRelatedCompany = false;
  showRelatedContact = false;
  showOwnerContact = false;
  showProductModal = false;
  showAddType = false;

  constructor(private sharedService: SharedService, private salesService: SalesService) {

  }

  isArray(val): boolean { return Array.isArray(val); }

  ngOnInit(): void {
    this.formData.orderOwner = this.sharedService.name;
    if (this.editId !== '') {
      this.sharedService.get(APIS.SALES.ORDER.GET + this.editId + '/').subscribe(
        data => {
          if (data[0].status === 'success') {
            const comp = data[0].result[0];
            this.formData = {
              orderOwner: comp.sales_orders_create_by,
              paymethod: 'cash',
              orderamount: comp.sales_orders_amount,
              paymentOrderId: comp.sales_orders_uniq_id,
              locLongtitute: '0',
              orderSubject: comp.sales_orders_subject,
              shippingCharge: comp.sales_orders_ship_charge,
              storeId: comp.store_id,
              storeName: comp.store_name,
              locLatitute: '0',
              assignedTo: comp.st_contact_id,
              contactName: (comp.st_contact_fname || comp.st_contact_last_name) ? comp.st_contact_fname + ' ' + comp.st_contact_last_name : '',
              orderdetail: comp.sales_orders_details,
              contactId: comp.st_contact_id,
              assignedToName: comp.sales_orders_create_by
            };
            try {
              this.products = JSON.parse(this.formData.orderdetail);
            } catch (e) {

            }
            this.total = 'Total: ' + this.salesService.currency + ' ' + parseFloat(comp.sales_orders_amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          }
        },
        err => {
          console.error(err);
        },
        () => console.log('done uploading')
      );
    } else {
      if (this.company) {
        this.formData.storeId = this.company.store_id;
        this.formData.storeName = this.company.store_name;
      }
      if (this.contact) {
        this.formData.contactId = this.contact.st_contact_id;
        this.formData.contactName = this.contact.st_contact_fname + ' ' + this.contact.st_contact_last_name;
      }
    }
  }

  onCancel = () => {
    this.actionCancel.emit();
  }
  onPrimary = () => {
    this.saveOrder(1);
  }
  onSecondry = () => {
    this.saveOrder(2);
  }

  openUpdateCategoryModal = () => {
  }

  openUpdateTypeModal = () => {
    this.showAddType = true;
  }


  print = (v) => {
    return JSON.stringify(v);
  }

  openRelatedCompanyDD = (e) => {
    this.showRelatedCompany = true;
  }

  cancelRelatedCompany = (e) => {
    this.showRelatedCompany = false;
  }

  selectRelatedCompany = (company) => {
    console.log('company', company);
    this.formData.storeId = company.store_id;
    this.formData.storeName = company.store_name;
    this.showRelatedCompany = false;
  }


  openRelatedContactDD = (e) => {
    this.showRelatedContact = true;
  }

  cancelRelatedContact = () => {
    this.showRelatedContact = false;
  }

  selectRelatedContact = (contact) => {
    this.formData.contactId = contact.st_contact_id;
    this.formData.contactName = contact.st_contact_fname + ' ' + contact.st_contact_last_name;
    this.showRelatedContact = false;
  }

  openOwnerContactDD = (e) => {
    this.showOwnerContact = true;
  }

  cancelOwnerContact = () => {
    this.showOwnerContact = false;
  }

  selectOwnerContact = (owner) => {
    this.formData.assignedToName = owner.logins_name;
    this.formData.assignedTo = owner.role_login_id;
    this.showOwnerContact = false;
  }

  actionSelectDD = (type, key) => {
    this.formData[key] = type.value;
  }

  addProductSelected = (products) => {
    console.log('products', products);
  }

  addMoreProduct = () => {
    this.showProductModal = true;
  }

  addMoreProductCancel = () => {
    this.showProductModal = false;
  }

  addMoreProductSelected = (products) => {
    this.showProductModal = false;
    for (const p of products) {
      let prices = [{ dealer_price: 0 }];
      try {
        prices = JSON.parse(p.product_mrp);
      } catch (e) {
        console.log('PRICE ERROR', p.product_mrp);
      }
      const pr = prices[0].dealer_price ? prices[0].dealer_price : 0;
      const tx = p.product_tax_rate ? p.product_tax_rate : 0;
      this.products.push({
        pName: p.product_name,
        pCode: p.product_code,
        pQuantity: 1,
        pPrice: pr,
        pImage: null,
        pDiscount: 0,
        pTax: tx,
        pNetTotal: (parseFloat(pr + '') + (parseFloat(pr + '') * tx / 100))
      });
    }
    this.updateTotal();
  }

  updateProduct = (i, product) => {
    this.products[i] = product;
    this.updateTotal();
  }

  deleteProduct = (i) => {
    this.products.splice(i, 1);
    this.updateTotal();

  }

  updateTotal = () => {
    let total = 0;
    for (const p of this.products) {
      total = total + parseFloat(p.pNetTotal + '');
    }
    this.formData.orderamount = total.toFixed(2).toString();
    this.total = 'Total: ' + this.salesService.currency + ' ' + total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  saveOrder = (nextAction) => {
    const finalData = JSON.parse(JSON.stringify(this.formData));
    finalData.orderdetail = JSON.stringify(this.products);
    if (this.editId !== '') {
      finalData.paymentOrderId = this.editId;
      this.sharedService.postJson(APIS.SALES.ORDER.UPDATE_ORDER, finalData)
        .subscribe((res) => {
          if (res[0].status === 'success') {
            if (nextAction === 1) {
              this.actionPrimary.emit(this.editId);
            } else {
              this.actionPrimary.emit(this.editId);
              this.actionSecondary.emit();
            }
          } else {
            alert('Unable to update contact');
          }
        }, (err) => { });
    } else {
      this.sharedService.postJson(APIS.SALES.ORDER.ADD_ORDER, finalData)
        .subscribe((res) => {
          if (res[0].status === 'success') {
            if (nextAction === 1) {
              this.actionPrimary.emit();
            } else {
              this.actionPrimary.emit(res[0].result);
              this.actionSecondary.emit();
            }
          } else {
            alert('Unable to add contact');
          }
        }, (err) => { });
    }
  }




}
