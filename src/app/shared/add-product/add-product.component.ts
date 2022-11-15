import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIS, priceTypes } from 'src/app/classes/appSettings';
import { SharedService } from '../../shared/shared.service';
import { SalesService } from '../../sales/sales.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  @Input() editId = '';

  @Output() actionCancel = new EventEmitter();
  @Output() actionPrimary = new EventEmitter();
  @Output() actionSecondary = new EventEmitter();

  prices = [{ type: '', price: '' }];
  categories = [];
  formData = {
    category: '',
    category_name: 'None',
    type: '',
    type_name: 'None',
    name: '',
    sku: '',
    hsn: '',
    discription: '',
    pack_of: '',
    productStock: ''
  };
  types = [];
  priceTypesArray = [];
  priceTypesKV = {};
  currency = '';
  showAddCategory = false;
  showAddType = false;
  files = [];

  constructor(private sharedService: SharedService, private salesService: SalesService) {
    this.priceTypesArray = Object.keys(priceTypes).map(a => {
      return { label: priceTypes[a], value: a };
    });
    this.currency = this.salesService.currency;
    this.priceTypesKV = priceTypes;
  }

  isArray(val): boolean { return Array.isArray(val); }

  ngOnInit(): void {
    this.fetchCategories();
    if (this.editId !== '') {
      this.sharedService.get(APIS.SALES.PRODUCT.GET + this.editId + '/').subscribe(
        data => {
          if (data[0].status === 'success') {
            const product = data[0].result;
            this.formData.category = product.category_idfk;
            this.formData.category_name = product.category_name;
            this.formData.type = product.type_idfk;
            this.formData.type_name = product.category_typename;
            this.formData.discription = product.product_specification;
            this.formData.sku = product.product_code;
            this.formData.hsn = product.hsn;
            this.formData.productStock = product.product_stock;
            this.formData.pack_of = product.pack_of;
            this.formData.name = product.product_name;
            if (this.formData.category !== '') {
              this.fetchTypes();
            }
            try {
              this.prices = [];
              const prices = JSON.parse(product.product_mrp);
              for (const p of prices) {
                const keys = Object.keys(p);
                for (const k of keys) {
                  if (p[k] > 0) {
                    this.prices.push({ type: k, price: p[k] });
                  }
                }
              }
            } catch (e) {

            }
            if (this.prices.length === 0) {
              this.prices = [{ type: '', price: '' }];
            }
            this.files = [];
            if (this.isArray(product.images)) {
              this.files = product.images;
            }
          }
        },
        err => {
          console.error(err);
        },
      );
    }
  }

  fetchCategories = () => {
    this.sharedService.get(APIS.SALES.CATEGORY.LIST).subscribe(
      data => {
        if (data[0].status === 'success') {
          this.categories = data[0].result.map(m => {
            return { label: m.category_name, value: m.id_category };
          });
        }
      },
      err => {
        console.error(err);
      },
      () => console.log('done uploading')
    );
  }

  fetchTypes = () => {
    this.sharedService.get(APIS.SALES.CATEGORY.TYPES_CATEGORY + this.formData.category + '/').subscribe(
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
  onPrimary = () => {
    this.saveProduct(1);
  }
  onSecondry = () => {
    this.saveProduct(2);
  }

  saveProduct = (nextAction) => {
    const mrps: any = {};
    for (const p of this.prices) {
      mrps[p.type] = p.price;
    }
    mrps.mrp = (mrps.mrp) ? mrps.mrp : 0;
    mrps.dealer_price = (mrps.dealer_price) ? mrps.dealer_price : 0;
    mrps.distributer_price = (mrps.distributer_price) ? mrps.distributer_price : 0;
    mrps.dealer_nlc = (mrps.dealer_nlc) ? mrps.dealer_nlc : 0;
    const productData: any = {
      mrp: JSON.stringify([mrps]),
      name: this.formData.name,
      code: this.formData.sku,
      hsn_code: this.formData.hsn,
      specification: this.formData.discription,
      productStock: this.formData.productStock,
      category: this.formData.category,
      type: this.formData.type,
      pack_of: this.formData.pack_of
    };

    if (this.editId !== '') {
      productData.productId = this.editId;
      this.sharedService.postJson(APIS.SALES.PRODUCT.UPDATE_PRODUCT, productData)
        .subscribe((res) => {
          if (res[0].status === 'success') {
            this.updateImages(productData.productId);
            if (nextAction === 1) {
              this.actionPrimary.emit(productData.productId);
            } else {
              this.actionPrimary.emit(productData.productId);
              this.actionSecondary.emit();
            }
          } else {
            alert('Unable to add product');
          }
        }, (err) => { });
    } else {
      this.sharedService.postJson(APIS.SALES.PRODUCT.ADD_PRODUCT, productData)
        .subscribe((res) => {
          if (res[0].status === 'success') {
            this.updateImages(res[0].result);
            if (nextAction === 1) {
              this.actionPrimary.emit();
            } else {
              this.actionPrimary.emit(res[0].result);
              this.actionSecondary.emit();
            }
          } else {
            alert('Unable to add product');
          }
        }, (err) => { });
    }

  }


  updateImages = (id) => {
    const images = this.files.map(a => {
      return { id: a.id_image };
    });
    this.sharedService.postJson(APIS.SALES.PRODUCT.UPDATE_IMAGES, { id_product: id, images: JSON.stringify(images) })
      .subscribe((res) => {
        if (res[0].status === 'success') {
        } else {
        }
      }, (err) => { });
  }

  addMorePrice = () => {
    this.prices.push({ type: '', price: '' });
  }

  removePrice = (index) => {
    this.prices.splice(index, 1);
  }

  actionCategorySelect = (category) => {
    this.formData.category = category.value;
    this.formData.category_name = category.label;
    this.types = [];
    this.formData.type = '';
    this.formData.type_name = 'None';
    this.fetchTypes();
  }

  actionTypeSelect = (category) => {
    this.formData.type = category.value;
    this.formData.type_name = category.label;
  }

  actionChangePriceType = (type, i) => {
    console.log('i', i);
    console.log('type', type);
    this.prices[i].type = type.value;
  }

  openUpdateCategoryModal = () => {
    this.showAddCategory = true;
  }

  cancelAddCategory = () => {
    this.showAddCategory = false;
    this.fetchCategories();
  }

  openUpdateTypeModal = () => {
    this.showAddType = true;
  }

  cancelAddType = () => {
    this.showAddType = false;
    this.fetchTypes();
  }

  filesChange = (files) => {
    this.files = files;
    console.log('this.files', this.files);
  }

  print = (v) => {
    return JSON.stringify(v);
  }

}
