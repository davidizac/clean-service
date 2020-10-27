import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { IProduct } from 'src/app/models/pressing.model';
import { OrderService } from 'src/app/services/order.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss'],
})
export class ManageOrdersComponent implements OnInit {
  selectedOrders = [];
  displayedOrders = [];
  isLoading = false;
  orders: Array<Order> = [];
  statusMessage = '';
  filter: FormControl;
  orderForm: FormGroup;
  statusIndex;
  constructor(
    public orderService: OrderService,
    public router: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.filter = this.formBuilder.control('');
    this.filter.valueChanges.subscribe((e) => {
      if (this.orders.length) {
        if (e) {
          this.displayedOrders = this.orders.filter((o) => {
            return (
              (o.displayedId.match(e) || []).length > 0 ||
              (o.user.fullname.toLowerCase().match(e.toLowerCase()) || [])
                .length > 0 ||
              (o.status.toLowerCase().match(e.toLowerCase()) || []).length >
                0 ||
              (o.phoneNumber.toLowerCase().match(e.toLowerCase()) || [])
                .length > 0
            );
          });
        } else {
          this.displayedOrders = this.orders;
        }
      }
    });
    this.orderService.getAllOrders().subscribe((orders: Array<Order>) => {
      this.isLoading = false;
      this.orders = orders.map((p) => new Order(p));
      this.displayedOrders = this.orders;
      this.orderForm = this.formBuilder.group({
        statuses: this.formBuilder.array(
          this.orders.map(() => this.formBuilder.group({ status: '' }))
        ),
      });
      this.orderForm.patchValue({
        statuses: this.orders.map((o) => {
          return { status: o.status };
        }),
      });
      this.orderForm.get('statuses').valueChanges.subscribe((e) => {
        this.displayedOrders[this.statusIndex].status =
          e[this.statusIndex].status;
        this.updateOrder(this.statusIndex);
      });
    });
  }

  updateOrder(index) {
    const order = _.cloneDeep(this.displayedOrders[index]);
    order.products = (this.displayedOrders[index].products as Array<
      IProduct
    >).map((p) => p._id);

    this.orderService.updateOrderStatus(order, order._id).subscribe(() => {
      console.log(`Successfully updated order ${order.displayedId}`);
    });
  }

  setStatusIndex(index) {
    this.statusIndex = index;
  }

  getStatusMessage(status) {
    switch (status) {
      case 'NEW':
        return 'Commande en cours.';
      case 'PICKUP':
        return 'Votre linge a ete ramasse.';
      case 'CLEANING':
        return 'Votre linge est au pressing';
      case 'DROPOFF':
        return 'Commande delivere';
    }
  }

  isAbleToBeModified(order) {
    if (order.status === 'NEW') {
      return moment(order.pickUpDate).subtract(3, 'hours').isAfter(moment());
    }
    return false;
  }

  openOrder(order: Order) {
    this.selectedOrders.push(order._id);
  }

  closeOrder(order) {
    this.selectedOrders.splice(
      this.selectedOrders.findIndex((c) => c === order._id),
      1
    );
  }

  isOrderOpened(order) {
    return this.selectedOrders.includes(order._id);
  }

  getRecurrence(order: Order, product: IProduct) {
    return (order.products as Array<IProduct>).filter(
      (p) => p._id === product._id
    ).length;
  }

  moreDetail(order: Order) {
    this.router.navigate([`./order-confirmation/${order._id}`]);
  }

  getProductFiltered(products) {
    return _.uniqBy(products, '_id');
  }

  changeOrder(order: Order) {
    var pressingId = order.products[0]['pressingId'];
    return this.router.navigate([`./pressings/${pressingId}`], {
      queryParams: {
        order: JSON.stringify(order),
        isNew: false,
        orderId: order._id,
      },
    });
  }
}
