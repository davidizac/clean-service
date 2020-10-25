import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from './services/local-storage.service';
import { JwtModule } from '@auth0/angular-jwt';
import { SigninComponent } from './pages/signin/signin.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PressingsComponent } from './pages/pressings/pressings.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HomeComponent } from './pages/home/home.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ManageOrdersComponent } from './pages/manage-orders/manage-orders.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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

export function tokenGetter(): string {
  const localStorage = new LocalStorageService();
  return localStorage.getItem('authData');
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    ForgotPasswordComponent,
    PressingsComponent,
    CheckoutComponent,
    HomeComponent,
    OrdersComponent,
    ManageOrdersComponent,
    NotfoundComponent,
    PressingCreatorComponent,
    PressingDetailComponent,
    DateSelectorComponent,
    ProfileComponent,
    OrderConfirmationComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    JwtModule,
    DemoMaterialModule,
    PipeModule,
    ModalModule.forRoot(),

    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost', 'cleanservice.com'],
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
