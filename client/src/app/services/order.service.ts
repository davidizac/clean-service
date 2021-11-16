import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Order } from '../models/order.model';
import { Pressing } from '../models/pressing.model';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private authService: AuthService, public globalService: GlobalService) { }

  createOrder(order: Order): Observable<Order> {
    console.log('createOrder', order);
    
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.post<Order>(
          `${environment.serverUrl}api/orders/`,
          // {
            order,
            // lang: this.globalService.langGlobal},
          {
            headers: {
              authorization: token,
              
            }
          }
        );
      })
    );
  }

  getMyOrders() {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.get<Array<Order>>(
          `${environment.serverUrl}api/orders/`,
          {
            headers: { authorization: token },
          }
        );
      })
    );
  }

  getOrder(orderorderId) {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.get<Order>(
          `${environment.serverUrl}api/orders/${orderorderId}`,
          {
            headers: { authorization: token },
          }
        );
      })
    );
  }

  updateOrder(order: Order, orderId) {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.put<Order>(
          `${environment.serverUrl}api/orders/${orderId}`,
          order,
          {
            headers: { authorization: token },
          }
        );
      })
    );
  }

  updateOrderStatus(order: Order, orderId) {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.put<Order>(
          `${environment.serverUrl}api/orders/${orderId}/admin`,
          order,
          {
            headers: { authorization: token },
          }
        );
      })
    );
  }

  getAllOrders() {
    return this.authService.token.pipe(
      switchMap((token) => {
        return this.http.get<Array<Order>>(
          `${environment.serverUrl}api/orders/admin`,
          {
            headers: { authorization: token },
          }
        );
      })
    );
  }
}
