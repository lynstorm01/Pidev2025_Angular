import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { FooterComponent } from './front/footer/footer.component';
import { HeaderComponent } from './front/header/header.component';
import { HomeComponent } from './front/home/home.component';
import { CreateSinComponent } from './front/Sinister/create-sin/create-sin.component';
import { HistorComponent } from './front/Sinister/histor/histor.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SinisterADComponent } from './admin/sinister-ad/sinister-ad.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DevisListComponent } from './front/Devis/devis-list/devis-list.component';
import { PaiementDialogComponent } from './front/Devis/paiement-dialog/paiement-dialog.component';
import { DevisComponent } from './front/Devis/devis/devis.component';
import { DevisTypeComponent } from './front/Devis/devistypePage/devis-type/devis-type.component';
import { ModifierDevisComponent } from './front/Devis/modifier-devis/modifier-devis.component';
import { AdvancedSearchPipe } from './services/search.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { DevisBackOfficeComponent } from './admin/DevisBackoffice/devis-back-office/devis-back-office.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentComponent } from './payment/payment/payment.component';
import { CreateDevisHabitationComponent } from './front/Devis/create-devis-habitation/create-devis-habitation/create-devis-habitation.component';
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
    DevisComponent,
    DevisListComponent,
    PaiementDialogComponent,
    DevisTypeComponent,
    ModifierDevisComponent,
    AdvancedSearchPipe,
    DevisBackOfficeComponent,
    PaymentComponent,
    CreateDevisHabitationComponent
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
    HttpClientModule,
    FormsModule,
    MatDialogModule ,
    NgxPaginationModule,
    AngularSignaturePadModule,
    MatSnackBarModule,
    RecaptchaModule,         // Ajout du module reCAPTCHA
    RecaptchaFormsModule,
    NgxStripeModule.forRoot('pk_test_51Qz0h5Q0ic8mbnmqhHpXMcHLA8ExJypPCIdLQvVleZNs5EuZRYRjcDZQF3f7LwPSAGO0byAWLZWnqzkmZSXCQ5Cm00NrTcLoYb') // Remplace par ta clé publique Stripe
  
    
    
  ],
 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
