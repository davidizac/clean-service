import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from 'src/app/models/pressing.model';
import * as _ from 'lodash';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DateSelectorComponent } from 'src/app/popups/date-selector/date-selector.component';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private modalService: BsModalService,
    private orderService: OrderService,
    public formBuilder: FormBuilder
  ) {}
  pickUpOptions = [];
  dropOffOptions = [];
  products: Array<IProduct> = [];
  filteredProducts = [];
  order: Order = new Order();
  anotherAddress: boolean;
  pickUpAddress: FormControl;
  dropOffAddress: FormControl;
  comment: string = '';
  pickUpDate;
  dropOffDate;
  errorMessage = '';
  addressDetails;
  addressDetails2;
  isNew: string;
  orderId;

  get isInvalidOrder() {
    if (this.order)
      return (
        !this.order.pickUpAddress ||
        !this.order.dropOffAddress ||
        this.getPrice() < 100 ||
        !this.pickUpDate ||
        !this.dropOffDate ||
        !this.pickUpDate.format() ||
        !this.dropOffDate.format()
      );
  }

  ngOnInit(): void {
    this.pickUpAddress = this.formBuilder.control('');
    this.addressDetails = this.formBuilder.control('');
    this.addressDetails2 = this.formBuilder.control('');
    this.pickUpAddress.valueChanges.subscribe((e) => {
      this.triggerAutocomplete(e, true);
    });
    this.dropOffAddress = this.formBuilder.control('');
    this.dropOffAddress.valueChanges.subscribe((e) => {
      this.triggerAutocomplete(e, false);
    });
    this.isNew = this.route.snapshot.queryParamMap['params'].isNew;
    this.order = JSON.parse(this.route.snapshot.queryParamMap['params'].order);
    this.products = this.order.products as Array<IProduct>;
    this.addressDetails.setValue(this.order.addressDetails);
    this.addressDetails2.setValue(this.order.addressDetails2);
    this.pickUpAddress.setValue(this.order.pickUpAddress);
    this.dropOffAddress.setValue(this.order.dropOffAddress);
    this.anotherAddress =
      this.order.pickUpAddress !== this.order.dropOffAddress;
    this.pickUpDate = this.order.pickUpDate;
    this.dropOffDate = this.order.dropOffDate;
    this.comment = this.order.comment;
    this.orderId = this.route.snapshot.queryParamMap['params'].orderId;
    this.filteredProducts = _.uniqBy(this.products, '_id');
  }

  triggerAutocomplete(value: string, isPickUp) {
    if (!value) return;
    const filterValue = value.toLowerCase();

    const displaySuggestions = function (this, options, status) {
      this[isPickUp ? 'pickUpOptions' : 'dropOffOptions'] = options.map(
        (p) => p.description
      );
      this[isPickUp ? 'pickUpOptions' : 'dropOffOptions'].pop();
    };

    const service = new google.maps.places.AutocompleteService();
    service.getQueryPredictions(
      {
        input: filterValue,
      },
      displaySuggestions.bind(this)
    );
  }

  add(product: IProduct) {
    this.products.push(product);
    this.filteredProducts = _.uniqBy(this.products, '_id');
  }

  onSelectionChange(e, isPickUp) {
    if (isPickUp) {
      this.order.pickUpAddress = e.option.value;
      this.order.dropOffAddress = e.option.value;
    } else this.order.dropOffAddress = e.option.value;
  }

  remove(product: IProduct) {
    this.products.splice(
      this.products.findIndex((p) => p._id === product._id),
      1
    );
    this.filteredProducts = _.uniqBy(this.products, '_id');
  }

  getRecurrence(product: IProduct) {
    return this.products.filter((p) => p._id === product._id).length;
  }

  openPopup(isPickup) {
    const config: ModalOptions = {
      initialState: {
        isPickup: isPickup,
        pickUpDate: this.pickUpDate,
        dropOffDate: this.dropOffDate,
      },
    };
    const modal: BsModalRef = this.modalService.show(
      DateSelectorComponent,
      config
    );

    return modal.content.result.subscribe((date) => {
      this[isPickup ? 'pickUpDate' : 'dropOffDate'] = date;
    });
  }

  getPrice() {
    return this.products.reduce((acc, current, index, arr) => {
      const price = acc + current.price;
      return parseInt(price);
    }, 10);
  }

  createOrder() {
    if (this.isNew === 'false') {
      this.updateOrder();
      return;
    }
    if (this.isInvalidOrder) {
      if (this.getPrice() < 100) {
        this.errorMessage = 'Minimum order: 100₪';
      } else if (!this.order.pickUpAddress) {
        this.errorMessage = 'Pickup address is required';
      } else if (!this.order.dropOffAddress) {
        this.errorMessage = 'Dropoff address is required';
      } else if (!this.pickUpDate) {
        this.errorMessage = 'Pickup date is required';
      } else if (!this.dropOffDate) {
        this.errorMessage = 'Dropoff date is required';
      } else if (!this.pickUpDate.format()) {
        this.errorMessage = 'Pickup date is required';
      } else if (!this.dropOffDate.format()) {
        this.errorMessage = 'Dropoff date is required';
      }
      return;
    }
    this.order.addressDetails = this.addressDetails.value;
    this.order.addressDetails2 = this.addressDetails2.value;
    this.order.pickUpDate = this.pickUpDate.format();
    this.order.dropOffDate = this.dropOffDate.format();
    this.order.products = this.products.map((p) => p._id);
    this.order.comment = this.comment;
    this.order.status = 'NEW';
    this.order.price = this.getPrice().toString();
    this.orderService.createOrder(this.order).subscribe((order) => {
      this.router.navigate([`./order-confirmation/${order._id}`], {
        queryParams: { isNew: true },
      });
    });
  }

  getMessageButton() {
    if (this.isNew === 'true') {
      return 'Finalisez la commande';
    } else {
      return 'Modifiez la commande';
    }
  }

  updateOrder() {
    if (this.isInvalidOrder) {
      if (this.getPrice() < 100) {
        this.errorMessage = 'Minimum order: 100₪';
      } else if (!this.order.pickUpAddress) {
        this.errorMessage = 'Pickup address is required';
      } else if (!this.order.dropOffAddress) {
        this.errorMessage = 'Dropoff address is required';
      } else if (!this.pickUpDate) {
        this.errorMessage = 'Pickup date is required';
      } else if (!this.dropOffDate) {
        this.errorMessage = 'Dropoff date is required';
      } else if (!this.pickUpDate.format()) {
        this.errorMessage = 'Pickup date is required';
      } else if (!this.dropOffDate.format()) {
        this.errorMessage = 'Dropoff date is required';
      }
      return;
    }
    this.order.addressDetails = this.addressDetails.value;
    this.order.addressDetails2 = this.addressDetails2.value;
    this.order.pickUpDate =
      typeof this.pickUpDate !== 'string'
        ? this.pickUpDate.format()
        : this.pickUpDate;
    this.order.dropOffDate =
      typeof this.dropOffDate !== 'string'
        ? this.dropOffDate.format()
        : this.dropOffDate;
    this.order.products = this.products.map((p) => p._id);
    this.order.comment = this.comment;
    this.order.status = 'NEW';
    this.order.price = this.getPrice().toString();
    this.orderService.updateOrder(this.order, this.orderId).subscribe(() => {
      this.router.navigate([`./order-confirmation/${this.orderId}`], {
        queryParams: { isNew: this.isNew },
      });
    });
  }

  getTitle() {
    return this.isNew === 'true'
      ? 'Placez une commande'
      : 'Modifier une commande';
  }
}
