// src/app/components/appointment-form/appointment-form.component.ts
import { Component, OnInit } from '@angular/core';
import { AppointementService } from '../../services/appointement.service';
import { Appointement } from '../../models/appointement.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/UserService'; // Notez la casse si votre fichier est UserService.ts
import { User } from '../../models/user.model'; // Modèle User

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointement: Appointement = new Appointement();
  users: User[] = [];  // Liste des utilisateurs récupérée depuis le backend
  today: string = '';
  userPhoneNumber: string = '+21693323188'; // Remplacez par le numéro de l'utilisateur
  optimalDate: string | null = null; // Stocke la date optimale suggérée
  optimalDateAvailable: boolean = false; // Ajoutez cette ligne

  constructor(
    private appointementService: AppointementService,
    private userService: UserService,  // Injection du service User
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Définit la date d'aujourd'hui au format "yyyy-MM-dd" pour l'attribut [min] de l'input date
    this.today = new Date().toISOString().split('T')[0];
      // Affectation manuelle de l'ID utilisateur (ici, 5)
  this.appointement.userId = 6; 

    // Récupérer les utilisateurs
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );

    // Si un ID est présent dans l'URL, charger le rendez-vous pour édition
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appointementService.getAppointmentById(+id).subscribe(
        (data: Appointement) => {
          this.appointement = data;
        },
        (error: any) => {
          console.error('Error fetching appointment for update', error);
        }
      );
    }
  }

  saveAppointment(): void {
  if (this.appointement.dateSubmitted) {
    // Convertir la date sélectionnée en objet Date
    const selectedDate = new Date(this.appointement.dateSubmitted);
    // Récupérer l'heure actuelle
    const currentTime = new Date();
    // Injecter l'heure actuelle dans la date sélectionnée
    selectedDate.setHours(
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds(),
      currentTime.getMilliseconds()
    );
    // Mettre à jour la date soumise avec la date sélectionnée + heure actuelle
    this.appointement.dateSubmitted = selectedDate;
  }

  // ASSIGNATION de l'utilisateur : le backend attend une propriété "user" non nulle.
  if (this.appointement.userId) {
    // Créez un objet User partiel (seul l'id est nécessaire)
    this.appointement.user = new User(this.appointement.userId);
  }

  if (this.appointement.idAppointment) {
    this.appointementService.updateAppointment(this.appointement.idAppointment, this.appointement).subscribe(
      () => {
        this.router.navigate(['/calendar']);
      },
      (error: any) => {
        console.error('Error saving appointment', error);
      }
    );
  } else {
    this.appointement.status = 'PENDING';
    this.appointement.archiver = true;
    this.appointementService.createAppointment(this.appointement, this.userPhoneNumber).subscribe(
      () => {
        this.router.navigate(['calendar']);
      },
      (error: any) => {
        console.error('Error creating appointment', error);
        alert('Une erreur est survenue lors de la création du rendez-vous.');
      }
    );
  }
}

  

    // Méthode pour proposer une date optimale
    suggestOptimalDate(): void {
      const clientId = this.appointement.userId?.toString();
      if (clientId) {
        this.appointementService.getOptimalAppointment(clientId).subscribe(
          (response: string) => {
            this.optimalDate = response;
            if (this.optimalDate) {
              const parts = this.optimalDate.split('-');
              this.appointement.dateSubmitted = new Date(+parts[0], +parts[1] - 1, +parts[2]);
              this.optimalDateAvailable = true; // Changez cette ligne pour mettre à jour la disponibilité de la date
            } else {
              this.optimalDateAvailable = false;
              this.appointement.dateSubmitted = new Date();
            }
          },
          (error) => {
            console.error('Erreur lors de la récupération de la date optimale', error);
            alert('Impossible de proposer une date optimale.');
          }
        );
      } else {
        alert('Veuillez sélectionner un utilisateur avant de proposer une date.');
      }
    }
  
  suggestAnotherDate(): void {
    // Implémentez ici une logique pour générer une autre date possible
    // Par exemple, vous pouvez ajouter un jour à la date actuelle et vérifier si cette nouvelle date est disponible.
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1); // Ajouter un jour
    this.appointement.dateSubmitted = nextDay;
    this.optimalDate = nextDay.toISOString().split('T')[0];
  }
  


    
    
    
    
    
}
