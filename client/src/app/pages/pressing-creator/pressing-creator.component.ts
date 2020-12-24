import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Observable } from 'rxjs';
import { CATEGORIES } from 'src/app/constant';
import { IProduct, Pressing } from 'src/app/models/pressing.model';
import { PressingService } from 'src/app/services/pressing.service';

function validateSize(arr: FormArray) {
  return arr.length > 0
    ? {
        invalidSize: true,
      }
    : null;
}

@Component({
  selector: 'app-pressing-creator',
  templateUrl: './pressing-creator.component.html',
  styleUrls: ['./pressing-creator.component.scss'],
})
export class PressingCreatorComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    public pressingService: PressingService,
    public router: Router,
    public route: ActivatedRoute,
    private localize: LocalizeRouterService
  ) {}
  pressingForm: FormGroup;
  environment: Array<string>;
  models: Array<string>;
  isLoading = false;
  products = new FormArray([]);
  productFormGroup: FormGroup;
  options: string[] = [];
  filteredOptions: Observable<Array<string>>;
  addressControl: FormControl;
  latitude: string;
  longitude: string;
  categories = CATEGORIES;
  product = {
    price: '',
    category: '',
    name: '',
    _id: '',
    pressingId: '',
  };
  pressing: Pressing;
  pressingId;
  isNew = false;

  async ngOnInit() {
    this.categories = CATEGORIES;
    this.models = [];
    this.pressingId = '';
    if (this.route.snapshot.params.id) {
      this.pressing = await this.pressingService
        .getPressing(this.route.snapshot.params.id)
        .toPromise();
      this.pressingId = this.pressing._id;
    }
    this.pressingForm = this.formBuilder.group({
      name: '',
      address: '',
      phoneNumber: '',
      products: this.formBuilder.array(
        [this.formBuilder.group(this.product)],
        validateSize
      ),
    });
    this.products = this.pressingForm.get('products') as FormArray;
    if (this.pressing) {
      this.pressing.products.forEach((p) => {
        this.products.push(this.formBuilder.group(this.product));
      });
      this.products.removeAt(this.products.length - 1);
      this.pressingForm.setValue({
        name: this.pressing.name || '',
        address: this.pressing.address || '',
        phoneNumber: this.pressing.phoneNumber || '',
        products: ((this.pressing.products.length > 0
          ? this.pressing.products
          : new Array(1).fill(this.product)) as Array<IProduct>).map((p) => {
          return {
            _id: p._id,
            price: p.price,
            category: p.category,
            name: p.name,
            pressingId: p['pressingId'],
          };
        }),
      });
    }
    this.isNew = this.pressingForm.value.name.length === 0;
    this.pressingForm.get('address').valueChanges.subscribe((value) => {
      this._filter(value);
    });
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    const displaySuggestions = function (this, options, status) {
      this.options = options.map((p) => p.description);
    };

    const service = new google.maps.places.AutocompleteService();
    service.getQueryPredictions(
      {
        input: filterValue,
      },
      displaySuggestions.bind(this)
    );
  }

  getErrorMessage(field = 'email') {
    return this.pressingForm.controls[field].hasError('required')
      ? 'You must enter a value'
      : this.pressingForm.controls[field].hasError('pattern')
      ? 'Numbers only'
      : '';
  }

  createPressing() {
    this.isLoading = true;
    this.pressingService
      .createPressing(
        new Pressing(this.pressingForm.value),
        this.latitude.toString(),
        this.longitude.toString()
      )
      .subscribe(() => {
        this.isLoading = false;
        const route = this.localize.translateRoute(`/home`);
        this.router.navigate([route]);
      });
  }

  updatePressing() {
    const pressing = new Pressing(this.pressingForm.value);
    pressing.products.forEach((p) => {
      p.price = p.price.toString();
      p['pressingId'] = this.pressingId;
    });
    pressing.latitude = this.latitude || pressing.latitude;
    pressing.longitude = this.longitude || pressing.longitude;
    this.isLoading = true;
    this.pressingService
      .updatePressing(pressing, this.pressingId)
      .subscribe(() => {
        this.isLoading = false;
        const route = this.localize.translateRoute(`/home`);
        this.router.navigate([route]);
      });
  }

  addProduct() {
    this.products.push(this.formBuilder.group(this.product));
  }

  removeProduct(index: number) {
    this.products.removeAt(index);
  }

  onSelectionChange(e) {
    const address = e.option.value;
    var geocoder = new google.maps.Geocoder();
    const navigate = function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
      }
    };
    geocoder.geocode(
      {
        address: address,
      },
      navigate.bind(this)
    );
  }

  getMessageButton() {
    if (this.isNew) {
      return 'Creer Pressing';
    } else {
      return 'Modifier Pressing';
    }
  }
}
