import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';

const routes: Routes = [

  { path: 'create', component: CreateSinComponent },
  { path: 'admin', component: DashboardComponent, children: [
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
