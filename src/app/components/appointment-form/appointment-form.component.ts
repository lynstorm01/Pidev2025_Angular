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
  this.appointement.userId = 5;

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
    // Convertir la date au format Date si nécessaire
    if (this.appointement.dateSubmitted) {
      // Attention : si vous utilisez <input type="date">, la valeur est un string "YYYY-MM-DD".
      // Pour ajouter une heure par défaut (ex. 00:00), vous pouvez faire :
      this.appointement.dateSubmitted = new Date(this.appointement.dateSubmitted + 'T00:00:00');
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
}
