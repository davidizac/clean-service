import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IProduct, Pressing } from 'src/app/models/pressing.model';
import { PressingService } from 'src/app/services/pressing.service';
import * as _ from 'lodash';
import { CATEGORIES } from 'src/app/constant';
import { of } from 'rxjs';
import { MyEvent } from 'src/app/services/myevents.service';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { GlobalService } from 'src/app/services/global.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-pressing-detail',
  templateUrl: './pressing-detail.component.html',
  styleUrls: ['./pressing-detail.component.scss'],
})
export class PressingDetailComponent implements OnInit, AfterViewInit {
  pressing: Pressing;
  products;
  categories = CATEGORIES;
  order = { products: [] };
  filteredProducts = [];
  selectedCategories: Array<string> = [];
  isLoading = false;
  isNew;
  orderId = '';
  lang: string
  pressingId: string;
  constructor(
    private route: ActivatedRoute,
    public globalService: GlobalService,
    private router: Router,
    public pressingService: PressingService,
    private myEvent: MyEvent,
    private localize: LocalizeRouterService,
    public dialog: MatDialog,
    public googleAnalyticsService: GoogleAnalyticsService
  ) {

    this.myEvent.setLanguageData(this.localize.parser.currentLang);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      document.getElementById('title')?.classList.add('borderName-active')
    }, 500);

  }

  @ViewChild(MatAccordion) accordion: MatAccordion;

  get productsCategories() {
    return Object.keys(this.products);
  }

  ngOnInit(): void {
    this.googleAnalyticsService.eventEmitter("pressingArticlesView");
    // this.route.params.subscribe(value => {
    //   this.lang = value['lang']
    //   this.myEvent.setLanguageData(this.lang);
    // })
    this.pressingService
      .getAllPressings()
      .subscribe((pressings: Array<Pressing>) => {

        this.pressingId = pressings[0]._id
        this.route.params
          .pipe(switchMap((params: any) => {

            return this.pressingService.getPressing(this.pressingId);
          }),
            switchMap((pressing: any) => {

              pressing.products.forEach(element => {
                if (element.price.toString().includes('-')) {
                  element.specialProduct = true
                }
              });

              if (
                this.route.snapshot.queryParamMap['params'] &&
                this.route.snapshot.queryParamMap['params'].isNew
              ) {
                this.isNew = this.route.snapshot.queryParamMap['params'].isNew;
                this.order = JSON.parse(
                  this.route.snapshot.queryParamMap['params'].order
                );
                this.filteredProducts = _.uniqBy(this.order.products, '_id');

                this.orderId = this.route.snapshot.queryParamMap['params'].orderId;

              } else {
                this.isNew = 'true';
              }
              return of(pressing);
            })
          )
          .subscribe((pressing: Pressing) => {
            this.pressing = new Pressing(pressing);
            this.products = _.groupBy(this.pressing.products, 'category');
            this.isLoading = false;
          });
      })

    this.myEvent.setLanguageData(this.localize.parser.currentLang);
    this.isLoading = true;


  }

  createCheckout() {

    this.googleAnalyticsService.eventEmitter("pressingArticlesCreateOrder");
    if (this.getPrice() < 100) {
      document.getElementById("minPriceText").classList.add("effectErrorMinPrice")
      setTimeout(() => {
        document.getElementById("minPriceText").classList.add("errorMessage")
      }, 1000);
      return
    }
    const route = this.localize.translateRoute(`/checkout`);
    this.router.navigate([route], {
      queryParams: {
        order: JSON.stringify(this.order),
        isNew: this.isNew,
        orderId: this.orderId,
      },
    });
  }

  isProductInOrder(product) {
    return (this.order.products as Array<IProduct>)
      .map((p) => p._id)
      .includes(product._id);
  }

  openDialog() {
    this.dialog.open(PopUpComponent, {
      data: {
        dataKey: 'whatsapp'
      }
    });
  }

  add(product: IProduct) {
    if (product.specialProduct) {
      this.openDialog()
      return
    }
    this.order.products.push(product);
    product.price = Number(product.price)

    this.filteredProducts = _.uniqBy(this.order.products, '_id');
  }

  remove(product: IProduct) {
    if (product.specialProduct) {
      this.openDialog()
      return
    }
    this.order.products.splice(
      (this.order.products as Array<IProduct>).findIndex(
        (p) => p._id === product._id
      ),
      1
    );
    this.filteredProducts = _.uniqBy(this.order.products, '_id');
  }

  getRecurrence(product: IProduct) {
    return (this.order.products as Array<IProduct>).filter(
      (p) => p._id === product._id
    ).length;
  }

  getPrice() {
    if (!this.order) return 0;
    return (this.order.products as Array<IProduct>).reduce(
      (acc, current, index, arr) => {
        const price = acc + current.price;
        return parseInt(price);
      },
      0
    );
  }

  openCategory(category: string) {
    this.selectedCategories.push(category);
  }

  closeCategory(category) {
    this.selectedCategories.splice(
      this.selectedCategories.findIndex((c) => c === category),
      1
    );
  }

  isCategoryOpened(category) {
    return this.selectedCategories.includes(category);
  }

  getMessageButton() {
    if (this.isNew === 'true') {
      return 'Commandez maintenant';
    } else {
      return 'Modifiez votre commande';
    }
  }
}
