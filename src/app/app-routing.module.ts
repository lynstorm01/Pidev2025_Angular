import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';
import { SinistercreateComponent } from './admin/sinister-ad/sinistercreate/sinistercreate.component';
import { SinisterupdateComponent } from './admin/sinister-ad/sinisterupdate/sinisterupdate.component';
import { SinisterdisplayComponent } from './admin/sinister-ad/sinisterdisplay/sinisterdisplay.component';
import { SinisterComponent } from './front/Sinister/sinister.component';
import { SinistercalComponent } from './admin/sinister-ad/sinistercal/sinistercal.component';
import { SinisterchartComponent } from './admin/sinister-ad/sinisterchart/sinisterchart.component';


const routes: Routes = [

  { path: 'create', component: CreateSinComponent },
  { path: 'sinister', component: SinisterComponent },
  { path: 'admin', component: DashboardComponent, children: [
    { path: 'sinister', component: SinisterADComponent},
    { path: 'sinister/create', component: SinistercreateComponent },
    { path: 'sinister/update/:id', component: SinisterupdateComponent },
    { path: 'sinister/display/:id', component: SinisterdisplayComponent },
    { path: 'sinister/calendar', component: SinistercalComponent },
    { path: 'sinister/chart', component: SinisterchartComponent },

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
