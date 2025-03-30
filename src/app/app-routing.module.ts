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


const routes: Routes = [
  
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

  
  { path: 'view-file', component: FileViewerComponent },
  { path: 'sinister/:id', component: SinisterdisplayComponent },
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
      // Routes pour la gestion des rendez-vous

      { path: 'appointment/edit/:id', component: AppointmentFormComponent },
   
      // Routes pour la gestion des réclamations
      { path: 'claim/add', component: ClaimFormComponent },
      { path: 'claim/edit/:id', component: ClaimFormComponent },
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
