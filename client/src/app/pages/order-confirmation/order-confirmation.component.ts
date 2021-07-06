import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ORDER_STATUS } from 'src/app/constant';
import { Order } from 'src/app/models/order.model';
import { GlobalService } from 'src/app/services/global.service';
import { MyEvent } from 'src/app/services/myevents.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent implements OnInit {
  isLoading = false;
  order: Order;
  isNew;
  lang:string

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public orderService: OrderService,
    private myEvent:MyEvent,
    public globalService: GlobalService,
    private localize: LocalizeRouterService
  ) {}

  ngOnInit(): void {
    // this.route.params.subscribe(value => {
    //   this.lang = value['lang']
    //   this.myEvent.setLanguageData(this.lang);
    // })

    this.myEvent.setLanguageData(this.localize.parser.currentLang);
    this.isLoading = true;
    this.route.params
      .pipe(
        switchMap((params: any) => {
          return this.orderService.getOrder(params.id);
        }),
        switchMap((order: any) => {
          if (!order) {
            const route = this.localize.translateRoute(`/404`);
            this.router.navigate([route]);
          }
          if (
            this.route.snapshot.queryParamMap['params'] &&
            this.route.snapshot.queryParamMap['params'].isNew
          ) {
            this.isNew = this.route.snapshot.queryParamMap['params'].isNew;
          }
          return of(order);
        })
      )
      .subscribe((order: Order) => {
        this.order = new Order(order);
        console.log(this.order);
        
        this.isLoading = false;
      });
  }

  myOrders() {
    const route = this.localize.translateRoute(`/orders`);
    this.router.navigate([route]);
  }

  getTitle() {
    if (!this.isNew) {
      return `Order n°${this.order.displayedId}:`;
    } else if (this.isNew) {
      return `Your order n°${this.order.displayedId} have successfully been
      ${this.isNew === 'true' ? 'placed' : 'modified'}!`;
    }
  }

  get orderStatus() {
    if (this.order.status === 'NEW') {
      return ORDER_STATUS.NEW;
    }
    if (this.order.status === 'PICKUP') {
      return ORDER_STATUS.PICKUP;
    }
    if (this.order.status === 'CLEANING') {
      return ORDER_STATUS.CLEANING;
    }
    if (this.order.status === 'DROPOFF') {
      return ORDER_STATUS.DROPOFF;
    }
  }
}
