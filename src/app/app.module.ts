import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Composants
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FooterComponent } from './front/footer/footer.component';
import { HeaderComponent } from './front/header/header.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { HistorComponent } from './front/Sinister/histor/histor.component';
import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';
import { SinistercreateComponent } from './admin/sinister-ad/sinistercreate/sinistercreate.component';
import { SinisterupdateComponent } from './admin/sinister-ad/sinisterupdate/sinisterupdate.component';
import { SinisterdisplayComponent } from './admin/sinister-ad/sinisterdisplay/sinisterdisplay.component';
import { SinisterComponent } from './front/Sinister/sinister.component';
import { SinistercalComponent } from './admin/sinister-ad/sinistercal/sinistercal.component';
import { SinisterchartComponent } from './admin/sinister-ad/sinisterchart/sinisterchart.component';
import { FileViewerComponent } from './admin/sinister-ad/file-viewer/file-viewer.component';
import { SignUpComponent } from './front/sign-up/sign-up.component';
import { SignInComponent } from './front/sign-in/sign-in.component';
import { ArchivedComponent } from './admin/sinister-ad/archived/archived.component';
import { SinisterDetailsComponent } from './front/Sinister/sinister-details/sinister-details.component';

// Modules Angular & Angular Material
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatPaginatorModule } from '@angular/material/paginator';
import { provideOAuthClient, OAuthService } from 'angular-oauth2-oidc';
import { CookieService } from 'ngx-cookie-service';
import { AppointmentsComponent } from './admin/appointments/appointments.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    HomeComponent,
    HistorComponent,
    CreateSinComponent,
    SinisterADComponent,
    SinistercreateComponent,
    SinisterupdateComponent,
    SinisterdisplayComponent,
    SinisterComponent,
    SinistercalComponent,
    SinisterchartComponent,
    FileViewerComponent,
    SignUpComponent,
    SignInComponent,
    ArchivedComponent,
    SinisterDetailsComponent,
    AppointmentsComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FullCalendarModule,
    MatPaginatorModule
  ],
  providers: [
    provideOAuthClient(),
    provideHttpClient(),
    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
          // OAuth initialization logic here if needed
        };
      },
      multi: true,
      deps: [OAuthService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
