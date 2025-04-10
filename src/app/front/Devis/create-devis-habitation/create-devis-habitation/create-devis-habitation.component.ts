import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { DevisService } from 'src/app/services/devis.service';

@Component({
  selector: 'app-create-devis-habitation',
  templateUrl: './create-devis-habitation.component.html',
  styleUrls: ['./create-devis-habitation.component.css']
})
export class CreateDevisHabitationComponent {


createDevisForm: FormGroup;
  captchaValid = false;
  siteKey: string = environment.recaptchaSiteKey;
  selectedContract?: any;

  constructor(
    private formBuilder: FormBuilder,
    private devisService: DevisService,
    private router: Router,
  ) {
    // Initialize the form group with validation
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    this.createDevisForm = this.formBuilder.group({
      nomClient: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[A-Za-z]+$')]],
      emailClient: ['', [Validators.required, Validators.email]],
      dateDebut: [today, [Validators.required, this.dateValidator]],
      dateFin: ['', [Validators.required,]],
 

  // Adresse: Required, at least 3 characters, only letters and spaces
  adresse: [
    '',
    [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('^(?=.*[A-Za-zÀ-ÿ])(?=.*[0-9])[A-Za-zÀ-ÿ0-9,\\s-]+$') // Must contain both letters and numbers
    ]
  ],

  // Surface: Required, must be a number, minimum value 10
  surface: ['', [Validators.required, Validators.min(10)]],

  // Valeur: Required, must be a number, minimum value 1000
  valeur: ['', [Validators.required, Validators.min(1000)]],
     
      typeAssurance: ['HABITATION', Validators.required],
      statut: ['EN_ATTENTE', Validators.required]
    }, { validators: [this.endDateValidator] });
  }


  ngOnInit(): void { }
  // Custom validation to ensure end date is after start date
  endDateValidator(group: FormGroup): { [key: string]: any } | null {
    const startDate = group.get('dateDebut')?.value;
    const endDate = group.get('dateFin')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if endDate is before or equal to startDate
      if (end <= start) {
        return { endDateInvalid: 'End date must be after start date' };
      }
    }
    return null;
  }

  calculateMontantTotal(devis: any) {
    const valeurHabitation = devis.valeur; // Valeur de l'habitation en DT
    const surface = devis.surface; // Surface en m²
  
    let tauxBase = 0.0015; // Exemple de taux de base (0.15% de la valeur)
    let surfaceMultiplier = 1; // Facteur selon la surface
  
    // Ajuster le taux en fonction de la valeur de l'habitation
    if (valeurHabitation > 100000) {
      tauxBase = 0.0020; // Augmente pour les grandes valeurs
    } else if (valeurHabitation > 200000) {
      tauxBase = 0.0025;
    }
  
    // Ajuster le multiplicateur selon la surface
    if (surface > 100) {
      surfaceMultiplier = 1.2; // Prime augmentée de 20% pour les grandes surfaces
    } else if (surface > 200) {
      surfaceMultiplier = 1.5;
    }
  
    // Calcul de la prime
    const primeTotale = (valeurHabitation * tauxBase) * surfaceMultiplier;
  
    return primeTotale;
  }
  

  createDevis(): void {
    if (this.createDevisForm.valid) {
      // Récupération des données du formulaire
      const formData = {
        ...this.createDevisForm.value,
        statut: this.createDevisForm.value.statut || 'EN_ATTENTE',
        typeAssurance: this.createDevisForm.value.typeAssurance || 'HABITATION',
      };

      // Calcul du montant total
      const montantTotal = this.calculateMontantTotal(formData);

      // Ajouter le montant total au formData
      formData.montantTotal = montantTotal;

      // Création du devis via le service
      this.devisService.createDevisHabitation(formData).subscribe(
        (response) => {
          console.log('Devis  créé avec succès', response);
          this.router.navigate(['/devisList']);
        },
        (error) => {
          console.error('Erreur lors de la création du devis:', error);
        }
      );
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }



  // Custom validation for dateDebut to ensure it is not earlier than today
  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const today = new Date().toISOString().split('T')[0];
    if (control.value < today) {
      return { dateDebutInvalid: 'Start date cannot be earlier than today' };
    }
    return null;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.createDevisForm.get(field);
    return control ? control.invalid && (control.touched || control.dirty) : false;
  }

  captchaResolved(response: string) {
    if (response) {
      this.captchaValid = true;
    }
  }

}
