import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CATEGORIES } from 'src/app/constant';
import { Pressing } from 'src/app/models/pressing.model';
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
    public router: Router
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
  };

  ngOnInit() {
    this.categories = CATEGORIES;
    this.models = [];

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
        this.router.navigate(['/home']);
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
}
