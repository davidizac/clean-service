import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent } from './pages/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { DemoMaterialModule } from './material.module';
import { PipeModule } from './pipes/pipe.module';
import { SigninComponent } from './pages/signin/signin.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PressingsComponent } from './pages/pressings/pressings.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ManageOrdersComponent } from './pages/manage-orders/manage-orders.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { PressingCreatorComponent } from './pages/pressing-creator/pressing-creator.component';
import { PressingDetailComponent } from './pages/pressing-detail/pressing-detail.component';
import { DateSelectorComponent } from './popups/date-selector/date-selector.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { UsersComponent } from './pages/users/users.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SelectLanguagesComponent } from './components/select-languages/select-languages.component';
import { AuthService } from './services/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { APP_CONFIG, BaseAppConfig } from './app.config';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SigninComponent,
    ForgotPasswordComponent,
    PressingsComponent,
    CheckoutComponent,
    OrdersComponent,
    ManageOrdersComponent,
    NotfoundComponent,
    HomeComponent,
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
    BrowserAnimationsModule,
    JwtModule,
    DemoMaterialModule,
    NgbModule,
    PipeModule,
    AppRoutingModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
        }
    })
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
  bootstrap: [AppComponent]
})
export class AppModule {}