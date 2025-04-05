import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Composants
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FooterComponent } from './front/footer/footer.component';
import { HeaderComponent } from './front/header/header.component';
import { HomeComponent } from './front/home/home.component';
// Modules Angular & Angular Material
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Pour utiliser RouterLink
import { CommentsComponent } from './admin/dashboard/comments/comments.component';
import { UsersComponent } from './admin/dashboard/users/users.component';
import { ReplyComponent } from './admin/dashboard/reply/reply.component';
import { PostsComponent } from './admin/dashboard/posts/posts.component';
import { BlogFrontOfficeComponent } from './components/blog-front-office/blog-front-office.component';
import { ReactionsComponent } from './components/reactions/reactions.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    HomeComponent,
    PostsComponent,
    CommentsComponent,
    UsersComponent,
    ReplyComponent,
    BlogFrontOfficeComponent,
    ReactionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    RouterModule // Ajout du RouterModule pour RouterLink
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
