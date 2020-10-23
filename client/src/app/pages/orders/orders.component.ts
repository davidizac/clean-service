import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/order.model';
import { IProduct } from 'src/app/models/pressing.model';
import { OrderService } from 'src/app/services/order.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  selectedOrders = [];
  isLoading = false;
  orders: Array<Order> = [];
  statusMessage = '';

  constructor(public orderService: OrderService, public router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.orderService.getMyOrders().subscribe((orders: Array<Order>) => {
      this.isLoading = false;
      this.orders = orders.map((p) => new Order(p));
    });
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
