import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FooterComponent } from './front/footer/footer.component';
import { HeaderComponent } from './front/header/header.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { HistorComponent } from './front/Sinister/histor/histor.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select'; // ✅ Import MatSelectModule
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';
import { SinistercreateComponent } from './admin/sinister-ad/sinistercreate/sinistercreate.component';
import { SinisterupdateComponent } from './admin/sinister-ad/sinisterupdate/sinisterupdate.component';
import { SinisterdisplayComponent } from './admin/sinister-ad/sinisterdisplay/sinisterdisplay.component';
import { FormsModule } from '@angular/forms';
import { SinisterComponent } from './front/Sinister/sinister.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { SinistercalComponent } from './admin/sinister-ad/sinistercal/sinistercal.component';
import { SinisterchartComponent } from './admin/sinister-ad/sinisterchart/sinisterchart.component';
import { FileViewerComponent } from './admin/sinister-ad/file-viewer/file-viewer.component';
import { provideOAuthClient, AuthConfig,OAuthService } from 'angular-oauth2-oidc';
/*
export const authCodeFlowConfig: AuthConfig = {
  issuer: 'http://localhost:9090/realms/testPI',
  redirectUri: window.location.origin,
  clientId: 'cliennttt', // Ensure this matches the client ID in Keycloak
  responseType: 'code',
  scope: 'openid profile',
  requireHttps: false, // Set to true in production
  showDebugInformation: true, // Enable for debugging
};
function initializeOAuth(oauthService: OAuthService): Promise<void> {
  return new Promise((resolve, reject) => {
    oauthService.configure(authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndLogin()
      .then(() => resolve())
      .catch(err => {
        console.error('Error during OAuth2 initialization', err);
        reject(err);
      });
  });
}
*/

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
    FileViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule, // ✅ Add MatSelectModule
    MatOptionModule, // ✅ Add MatOptionModule
    MatIconModule,
    RouterLink,
    MatIconModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FullCalendarModule,
    HttpClientModule
    
  ],
  providers: [provideOAuthClient(),provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
        //  initializeOAuth(oauthService);
        }
      },
    multi: true,
    deps :[OAuthService]
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
