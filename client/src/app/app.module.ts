import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { SigninComponent } from './pages/signin/signin.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PressingsComponent } from './pages/pressings/pressings.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HomeComponent } from './pages/home/home.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ManageOrdersComponent } from './pages/manage-orders/manage-orders.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthService } from './services/auth.service';
import { PressingCreatorComponent } from './pages/pressing-creator/pressing-creator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from './material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { PressingDetailComponent } from './pages/pressing-detail/pressing-detail.component';
import { DateSelectorComponent } from './popups/date-selector/date-selector.component';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PipeModule } from './pipes/pipe.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { UsersComponent } from './pages/users/users.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import {
  TranslateLoader,
  TranslateModule,
  TranslatePipe,
} from "@ngx-translate/core";

import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { APP_CONFIG, BaseAppConfig } from './app.config';
import { SelectLanguagesComponent } from './components/select-languages/select-languages.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    ForgotPasswordComponent,
    PressingsComponent,
    CheckoutComponent,
    OrdersComponent,
    ManageOrdersComponent,
    NotfoundComponent,
    PressingCreatorComponent,
    PressingDetailComponent,
    DateSelectorComponent,
    ProfileComponent,
    OrderConfirmationComponent,
    UsersComponent,
    HeaderComponent,
    FooterComponent,
    SelectLanguagesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    JwtModule,
    DemoMaterialModule,
    PipeModule,
    ModalModule.forRoot(),
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [DateSelectorComponent],
  providers: [
    AuthService,
    BsModalService,
    BsModalRef,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    { provide: APP_CONFIG, useValue: BaseAppConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
