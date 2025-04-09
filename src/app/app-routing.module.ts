import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';

import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { ClaimsListComponent } from './components/claims-list/claims-list.component';
import { ClaimFormComponent } from './components/claim-form/claim-form.component';
import { ContractCrudComponent } from './admin/contract-crud/contract-crud.component';
import { ContractComponent } from './front/contract/contract.component';
import { CreateContractComponent } from './front/contract/create-contract/create-contract.component';
import { ListContractComponent } from './admin/contract-crud/list-contract/list-contract.component';
import { ContractUpdateComponent } from './admin/contract-crud/update-contract/update-contract.component';
import { ClientContractsComponent } from './front/contract/client-contracts/client-contracts.component';

import { ProfiluserComponent } from './profiluser/profiluser.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { SatisfactionSurveyComponent } from './satisfaction-survey/satisfaction-survey.component';
import { SinistercreateComponent } from './admin/sinister-ad/sinistercreate/sinistercreate.component';
import { SinisterupdateComponent } from './admin/sinister-ad/sinisterupdate/sinisterupdate.component';
import { SinisterdisplayComponent } from './admin/sinister-ad/sinisterdisplay/sinisterdisplay.component';
import { SinisterComponent } from './front/Sinister/sinister.component';
import { SinistercalComponent } from './admin/sinister-ad/sinistercal/sinistercal.component';
import { SinisterchartComponent } from './admin/sinister-ad/sinisterchart/sinisterchart.component';
import { FileViewerComponent } from './admin/sinister-ad/file-viewer/file-viewer.component';
import { SignInComponent } from './front/sign-in/sign-in.component';
import { AuthGuard } from './services/AuthGuard';
import { SignUpComponent } from './front/sign-up/sign-up.component';
import { HistorComponent } from './front/Sinister/histor/histor.component';
import { ArchivedComponent } from './admin/sinister-ad/archived/archived.component';
import { SinisterDetailsComponent } from './front/Sinister/sinister-details/sinister-details.component';
import { DevisBackOfficeComponent } from './admin/DevisBackoffice/devis-back-office/devis-back-office.component';
import { DevisComponent } from './front/Devis/devis/devis.component';
import { CreateDevisHabitationComponent } from './front/Devis/create-devis-habitation/create-devis-habitation/create-devis-habitation.component';
import { DevisListComponent } from './front/Devis/devis-list/devis-list.component';
import { DevisTypeComponent } from './front/Devis/devistypePage/devis-type/devis-type.component';
import { PaymentComponent } from './front/payment/payment/payment.component';


const routes: Routes = [
    { path: 'contract', component: ContractComponent },
  { path: 'contract/create', component: CreateContractComponent },
  { path: 'contract/client-contracts', component: ClientContractsComponent },
  
  { path: 'user-claims', component: ClaimsListComponent },
  { path: 'profiluser', component: ProfiluserComponent },
  // Routes liées aux sinistres et à l'administration
  {  path: 'create', component: CreateSinComponent },
  { path: 'claim/add', component: ClaimFormComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'satisfaction-survey/:claimId/:userId', component: SatisfactionSurveyComponent },
  { path: 'home', component: HomeComponent },
  { path: 'appointment-detail', component: AppointmentDetailComponent },
  { path: 'appointment/add', component: AppointmentFormComponent },
  { path: 'pay', component: PaymentComponent },

  
  { path: 'view-file', component: FileViewerComponent },
  { path: 'sinister/:id', component: SinisterdisplayComponent },
  { path: 'devis', component: DevisComponent },
  { path: 'create-devis-habitation', component: CreateDevisHabitationComponent },
  { path: 'devisList', component: DevisListComponent },
  { path: 'devisType', component: DevisTypeComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'create', component: CreateSinComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_USER'] } },
  { path: 'track', component: HistorComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_USER'] } },
  { path: 'sinisterdetails/:id', component: SinisterDetailsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_USER'] } },
  { path: 'sinister', component: SinisterComponent },
  { path: 'admin', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] }, children: [
    { path: 'sinister', component: SinisterADComponent },
    { path: 'sinister/create', component: SinistercreateComponent },
    { path: 'sinister/update/:id', component: SinisterupdateComponent },
    { path: 'sinister/display/:id', component: SinisterdisplayComponent },
    { path: 'sinister/calendar', component: SinistercalComponent },
    { path: 'sinister/chart', component: SinisterchartComponent },
    { path: 'sinister/archived', component: ArchivedComponent },
    { path: 'appointments', component: AppointmentListComponent },
    { path: 'claims', component: ClaimsListComponent },
    { path: 'devis', component: DevisBackOfficeComponent},
      // Routes pour la gestion des rendez-vous


      { path: 'appointment/edit/:id', component: AppointmentFormComponent },
   
      // Routes pour la gestion des réclamations
      { path: 'claim/add', component: ClaimFormComponent },
      { path: 'claim/edit/:id', component: ClaimFormComponent },
     { path: 'admin/contract-crud', component: ContractCrudComponent },
      { path: 'contract-crud/list', component: ListContractComponent },
      { path: 'contract-crud/Update/:id', component: ContractUpdateComponent },
      { path: 'admin/contract-crud/create', component: CreateContractComponent },
  ]},
  { path: 'home', component: HomeComponent, children: [
   { path: 'new-claim', component: ClaimFormComponent },
  ] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
