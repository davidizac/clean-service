import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/home/home.component';
import { ManageOrdersComponent } from './pages/manage-orders/manage-orders.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PressingCreatorComponent } from './pages/pressing-creator/pressing-creator.component';
import { PressingDetailComponent } from './pages/pressing-detail/pressing-detail.component';
import { PressingsComponent } from './pages/pressings/pressings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SigninComponent } from './pages/signin/signin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'pressings',
    component: PressingsComponent,
  },
  {
    path: 'pressings/:id',
    component: PressingDetailComponent,
  },
  {
    path: 'pressing-creator',
    component: PressingCreatorComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manage-orders',
    component: ManageOrdersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '404',
    component: NotfoundComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order-confirmation/:id',
    component: OrderConfirmationComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
