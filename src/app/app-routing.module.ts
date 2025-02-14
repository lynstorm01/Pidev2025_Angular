import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';
import { DevisComponent } from './front/Devis/devis/devis.component';
import { DevisListComponent } from './front/Devis/devis-list/devis-list.component';
import { DevisTypeComponent } from './front/Devis/devistypePage/devis-type/devis-type.component';
import { DevisBackOfficeComponent } from './admin/DevisBackoffice/devis-back-office/devis-back-office.component';
import { PaymentComponent } from './payment/payment/payment.component';
import { CreateDevisHabitationComponent } from './front/Devis/create-devis-habitation/create-devis-habitation/create-devis-habitation.component';

const routes: Routes = [

  { path: 'create', component: CreateSinComponent },
  { path: 'pay', component: PaymentComponent },
  
  { path: 'devis', component: DevisComponent },
  { path: 'create-devis-habitation', component: CreateDevisHabitationComponent },
  
  { path: 'devisList', component: DevisListComponent },
  { path: 'devisType', component: DevisTypeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: DashboardComponent, children: [
    { path: 'devis', component: DevisBackOfficeComponent}
    
    // Ajoute d'autres routes pour les autres composants CRUD ici
]},
{ path: 'home', component: HomeComponent, children: [
  // Ajoute d'autres routes pour les autres composants CRUD ici
]},

{ path: '', redirectTo: '/home', pathMatch: 'full' },
// { path: '**', redirectTo: '/home' }, // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
