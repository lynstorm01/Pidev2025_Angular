import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';

import { SinistercreateComponent } from './admin/sinister-ad/sinistercreate/sinistercreate.component';
import { SinisterupdateComponent } from './admin/sinister-ad/sinisterupdate/sinisterupdate.component';
import { SinisterdisplayComponent } from './admin/sinister-ad/sinisterdisplay/sinisterdisplay.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { ClaimsListComponent } from './components/claims-list/claims-list.component';
import { ClaimFormComponent } from './components/claim-form/claim-form.component';


const routes: Routes = [

  { path: 'create', component: CreateSinComponent },
  { path: 'admin', component: DashboardComponent, children: [
    { path: 'sinister', component: SinisterADComponent},
    { path: 'sinister/create', component: SinistercreateComponent },
    { path: 'sinister/update/:id', component: SinisterupdateComponent },
    { path: 'sinister/display/:id', component: SinisterdisplayComponent },
          { path: 'appointments', component: AppointmentListComponent },
      { path: 'claims', component: ClaimsListComponent },
         { path: 'claim/add', component: ClaimFormComponent },
      { path: 'claim/edit/:id', component: ClaimFormComponent },

    // Ajoute d'autres routes pour les autres composants CRUD ici
]},
{ path: 'home', component: HomeComponent, children: [
  // Ajoute d'autres routes pour les autres composants CRUD ici
]},

{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: '**', redirectTo: '/home' }, // Fallback route

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
