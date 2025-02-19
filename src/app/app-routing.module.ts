// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';



const routes: Routes = [
  // Routes liées aux sinistres et à l'administration
  { path: 'create', component: CreateSinComponent },
  { path: 'admin', component: DashboardComponent, children: [
      { path: 'sinister', component: SinisterADComponent },
      { path: 'appointments', component: AppointmentListComponent },
      // Ajouter d'autres routes liées à l'admin ici si nécessaire
        // Routes pour la gestion des rendez-vous
  { path: 'appointment/add', component: AppointmentFormComponent }, 
  { path: 'appointment/edit/:id', component: AppointmentFormComponent },
  ]},
  


  // Routes liées à la page d'accueil
  { path: 'home', component: HomeComponent },

  // Route par défaut
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Route pour toutes les autres URL non trouvées
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
