import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { VerificationComponent } from './components/verification/verification.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './components/register/register.component';
import { HistoryComponent } from './components/history/history.component';
import { ReportsComponent } from './components/reports/reports.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SavingsComponent } from './components/savings/savings.component';

const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'verify', component: VerificationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent },

  {
    path: 'home',
    component: HomepageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent }, 
      { path: 'history', component: HistoryComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'savings', component: SavingsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
