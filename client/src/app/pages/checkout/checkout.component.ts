import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from 'src/app/models/pressing.model';
import * as _ from 'lodash';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DateSelectorComponent } from 'src/app/popups/date-selector/date-selector.component';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MyEvent } from 'src/app/services/myevents.service';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { GlobalService } from 'src/app/services/global.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { render } from 'creditcardpayments/creditCardPayments'
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';

declare global {
  interface Window { paypal: any; }
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  payment: string;
  offerFidelity: boolean;
  priceWithouOffer: any;
  public payPalConfig?: IPayPalConfig;
  isLoading: boolean = false;
  startPaiementIsOpen: boolean = false;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private modalService: BsModalService,
    private orderService: OrderService,
    public formBuilder: FormBuilder,
    public userService: UserService,
    private myEvent: MyEvent,
    public globalService: GlobalService,
    private localize: LocalizeRouterService,
    public dialog: MatDialog,
  ) {

  }
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
  phoneNumber: string;
  lang: string
  @ViewChild('paypalRef', { static: true }) private paypalRef: ElementRef

  get isInvalidOrder() {

    if (this.order)

      return (
        !this.order.pickUpAddress ||
        (!this.order.dropOffAddress && this.anotherAddress) ||
        this.getPrice() < 100 ||
        !this.pickUpDate ||
        !this.dropOffDate ||
        !this.pickUpDate ||
        !this.dropOffDate ||
        !this.phoneNumber
      );
  }

  initConfig(): void {

    this.payPalConfig = {
      currency: 'ILS',
      clientId: 'sb',
      onClick: (data, actions) => {
        console.log("ONCLICK", this.getPrice().toString());
        this.startPaiementIsOpen = true
        if (this.isInvalidOrder) {
          this.createOrder()
          return
        }
      },
      createOrderOnClient: (data) => <ICreateOrderRequest>{

        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              value: this.getPrice().toString(),
              currency_code: 'ILS'
            }
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'pill',
        label: 'paypal',
        size: 'large'
      },
      onApprove: (data, actions) => {
        actions.order.capture().then(details => {
          alert('transaction completed')
          console.log('ONAPPROVE2', data, details);
          this.order.payment = 'paypal'
          this.createOrder()
        }).catch(err => {
          this.openDialog()
          // alert("Une erreur s'est produite, votre commande n'a pas pu etre validée")
        })
      },
      onClientAuthorization: (data) => {
        // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        // alert('transaction completed')
        // console.log('ONAPPROVE2', data);
        // this.order.payment = 'paypal'
        // this.createOrder()
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.startPaiementIsOpen = false

      },
      onError: err => {
        console.log('OnError', err);
      },

    };
  }


  ngOnInit() {






    // this.route.params.subscribe(value => {
    //   this.globalService.langGlobal = value['lang']

    //   this.myEvent.setLanguageData(this.lang);
    // })
    this.myEvent.setLanguageData(this.localize.parser.currentLang);

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
    this.payment = this.order.payment
    this.products = this.order.products as Array<IProduct>;
    this.addressDetails.setValue(this.order.addressDetails);
    this.addressDetails2.setValue(this.order.addressDetails2);
    this.pickUpAddress.setValue(this.order.pickUpAddress);
    this.dropOffAddress.setValue(this.order.dropOffAddress);
    this.order.pickUpAddress !== this.order.dropOffAddress;
    this.pickUpDate = this.order.pickUpDate;
    this.dropOffDate = this.order.dropOffDate;
    this.comment = this.order.comment;
    this.userService.getMe().subscribe((user) => {
      this.phoneNumber = this.order.phoneNumber || user['phoneNumber'];
    });
    this.orderId = this.route.snapshot.queryParamMap['params'].orderId;
    this.filteredProducts = _.uniqBy(this.products, '_id');

    this.orderService.getMyOrders().subscribe((orders: Array<Order>) => {
      if (orders.length > 0 && (((orders.length + 1) % 5) == 0) && this.isNew == 'true') {
        this.offerFidelity = true
      }
    });

    if (this.isNew == 'true' || this.payment == 'cash') {
      this.initConfig();
    }

    // if (this.isNew == 'true' || this.payment == 'cash') {
    //   window.paypal.Buttons({

    //     style: {
    //       layout: 'horizontal',
    //       color: 'blue',
    //       shape: 'pill',
    //       label: 'paypal',
    //       tagline: 'false',
    //       size: 'large'
    //     },
    //     createOrder: (data, actions) => {
    //       console.log(this.isInvalidOrder);

    //       if (this.isInvalidOrder) {

    //         this.createOrder()
    //         return
    //       }
    //       return actions.order.create({
    //         purchase_units: [
    //           {
    //             amount: {
    //               value: this.getPrice().toString(),
    //               currency_code: 'ILS'
    //             }
    //           }
    //         ]
    //       })
    //     },
    //     onApprove: (data, actions) => {
    //       console.log('onAPPROUVE');

    //       return actions.order.capture().then(details => {
    //         alert('transaction completed')
    //         this.order.payment = 'paypal'
    //         this.createOrder()
    //       })
    //     },
    //     onError: error => {
    //       console.log(error);

    //     }
    //   }).render(this.paypalRef?.nativeElement)
    // }

    // render({
    //   id: '#myPaypalButtons',
    //   currency: 'ILS',
    //   value: '100',

    //   onApprove: (details) => {
    //     alert('transaction successfull')
    //   }
    // })
  }

  onKeydown() {
    if (this.isInvalidOrder) {
      document.getElementById("unclickable")?.classList.add('paymentButtonsUnclickable')
    } else {
      document.getElementById("unclickable")?.classList.remove('paymentButtonsUnclickable')
      this.errorMessage = ''
    }
  }

  checkForm() {
    if (this.isInvalidOrder) {
      this.createOrder()
    } else {
      this.errorMessage = ''
    }
  }

  openDialog() {
    this.dialog.open(PopUpComponent, {
      data: {
        dataKey: 'errorPaiement'
      }
    });
  }

  triggerAutocomplete(value: string, isPickUp) {
    if (!value) return;
    const filterValue = value.toLowerCase();

    const displaySuggestions = function (this, options, status) {
      this[isPickUp ? 'pickUpOptions' : 'dropOffOptions'] = options?.map(
        (p) => p.description
      );
      this[isPickUp ? 'pickUpOptions' : 'dropOffOptions']?.pop();
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
    if (!this.startPaiementIsOpen) {
      this.products.push(product);
      this.filteredProducts = _.uniqBy(this.products, '_id');
    }
  }

  onSelectionChange(e, isPickUp) {
    if (isPickUp) {
      this.order.pickUpAddress = e.option.value;
      this.order.dropOffAddress = e.option.value;
    } else this.order.dropOffAddress = e.option.value;
  }

  remove(product: IProduct) {
    if (!this.startPaiementIsOpen) {
      this.products.splice(
        this.products.findIndex((p) => p._id === product._id),
        1
      );
      this.filteredProducts = _.uniqBy(this.products, '_id');
    }
  }

  getRecurrence(product: IProduct) {
    return this.products.filter((p) => p._id === product._id).length;
  }

  openPopup(isPickup) {
    const config = {
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
      this.onKeydown()
    });
  }

  getPrice() {

    return this.products.reduce((acc, current, index, arr) => {

      var price: any = Number(acc) + Number(current.price);
      if (this.offerFidelity) {
        this.priceWithouOffer = price
        price = price - (price * 10) / 100
      }
      return parseInt(price);
    }, 10);
  }

  createOrder(fromCashBtn?) {
    if (!fromCashBtn || (fromCashBtn && !this.isLoading)) {

      this.isLoading = fromCashBtn ? true : false
      if (this.isNew === 'false') {
        this.updateOrder();
        this.isLoading = false
        return;
      }
      if (this.isInvalidOrder) {
        if (this.getPrice() < 100) {
          this.errorMessage = 'Commande minimum 100₪';
        } else if (!this.order.pickUpAddress) {
          this.errorMessage = 'Addresse de recuperation obligatoire';
        } else if (!this.order.dropOffAddress && this.anotherAddress) {
          this.errorMessage = 'Addresse de restitution obligatoire';
        } else if (!this.pickUpDate) {
          this.errorMessage = 'Creneau de recuperation obligatoire';
        } else if (!this.dropOffDate) {
          this.errorMessage = 'Creneau de restitution obligatoire';
        } else if (!this.pickUpDate.format()) {
          this.errorMessage = 'Creneau de recuperation obligatoire';
        } else if (!this.dropOffDate.format()) {
          this.errorMessage = 'Creneau de restitution obligatoire';
        } else if (!this.phoneNumber) {
          this.errorMessage = 'Numero de telephone obligatoire';
        }
        this.isLoading = false
        return;
      }
      this.order.dropOffAddress = this.anotherAddress ? this.order.dropOffAddress : this.order.pickUpAddress
      this.order.addressDetails = this.addressDetails.value;
      this.order.addressDetails2 = this.addressDetails2.value;
      this.order.pickUpDate = this.pickUpDate.format();
      this.order.dropOffDate = this.dropOffDate.format();
      this.order.products = this.products.map((p) => p._id);
      this.order.comment = this.comment;
      this.order.phoneNumber = this.phoneNumber;
      this.order.status = 'NEW';
      this.order.price = this.getPrice().toString();
      this.order.payment = this.order.payment == 'paypal' ? 'paypal' : 'cash'

      this.orderService.createOrder(this.order).subscribe((order) => {
        const route = this.localize.translateRoute(`/order-confirmation/${order._id}`);
        this.isLoading = false
        this.router.navigate([route], {
          queryParams: { isNew: true },
        });
      });
    }
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
        this.errorMessage = 'Commande minimum 100₪';
      } else if (!this.order.pickUpAddress) {
        this.errorMessage = 'Addresse de recuperation obligatoire';
      } else if (!this.order.dropOffAddress) {
        this.errorMessage = 'Addresse de restitution obligatoire';
      } else if (!this.pickUpDate) {
        this.errorMessage = 'Creneau de recuperation obligatoire';
      } else if (!this.dropOffDate) {
        this.errorMessage = 'Creneau de restitution obligatoire';
      } else if (!this.pickUpDate.format()) {
        this.errorMessage = 'Creneau de recuperation obligatoire';
      } else if (!this.dropOffDate.format()) {
        this.errorMessage = 'Creneau de restitution obligatoire';
      } else if (!this.phoneNumber) {
        this.errorMessage = 'Numero de telephone obligatoire';
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
    this.order.phoneNumber = this.phoneNumber;
    this.order.status = 'NEW';
    this.order.price = this.getPrice().toString();
    this.orderService.updateOrder(this.order, this.orderId).subscribe(() => {
      const route = this.localize.translateRoute(`/order-confirmation/${this.orderId}`);
      this.router.navigate([route], {
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






