import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './front/home/home.component';
import { PostsComponent } from './admin/dashboard/posts/posts.component';
import { CommentsComponent } from './admin/dashboard/comments/comments.component';
import { ReplyComponent } from './admin/dashboard/reply/reply.component';


const routes: Routes = [

  { path: 'admin', component: DashboardComponent, children: [
    { path: 'posts', component: PostsComponent},
    { path: 'comments', component: CommentsComponent},
    { path: 'replies', component: ReplyComponent},
    // { path: 'sinister/create', component: SinistercreateComponent },
    // { path: 'sinister/update/:id', component: SinisterupdateComponent },
    // { path: 'sinister/display/:id', component: SinisterdisplayComponent },
    //       { path: 'appointments', component: AppointmentListComponent },
    //   { path: 'claims', component: ClaimsListComponent },
    //      { path: 'claim/add', component: ClaimFormComponent },
    //   { path: 'claim/edit/:id', component: ClaimFormComponent },

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
