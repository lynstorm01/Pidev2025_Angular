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


const routes: Routes = [

  { path: 'profiluser', component: ProfiluserComponent },
  // Routes liées aux sinistres et à l'administration
  {  path: 'create', component: CreateSinComponent },
  { path: 'claim/add', component: ClaimFormComponent },
  { path: 'calendar', component: CalendarComponent },

  { path: 'appointment/add', component: AppointmentFormComponent }, 

  

  { 
    path: 'admin', component: DashboardComponent, children: [
      { path: 'sinister', component: SinisterADComponent },
      { path: 'appointments', component: AppointmentListComponent },
      { path: 'claims', component: ClaimsListComponent },
      // Routes pour la gestion des rendez-vous

      { path: 'appointment/edit/:id', component: AppointmentFormComponent },
      // Routes pour la gestion des réclamations
      { path: 'claim/add', component: ClaimFormComponent },
      { path: 'claim/edit/:id', component: ClaimFormComponent },
   
      // Redirection par défaut au sein de l'admin
     // { path: '', redirectTo: '/admin/claims', pathMatch: 'full' },
      //{ path: '**', redirectTo: '/admin/claims' }
    ]
  },
  // Routes liées à la page d'accueil
  {
   path: 'home', component: HomeComponent, children:[
  { path: 'new-claim', component: ClaimFormComponent },
  
  ]
},

  // Route par défaut (si non administrateur)
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // Route pour toutes les autres URL non trouvées
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
