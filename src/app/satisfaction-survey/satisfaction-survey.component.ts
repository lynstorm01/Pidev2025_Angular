  import { Component, OnInit } from '@angular/core';
  import { SatisfactionSurveyService } from '../services/satisfaction-survey.service';  // Corrigez le chemin si nécessaire
  import { SatisfactionSurvey } from '../models/satisfaction-survey.model';
  import { ActivatedRoute, Router } from '@angular/router'; // Pour récupérer l'ID de la réclamation ou de l'utilisateur
  

  @Component({
    selector: 'app-satisfaction-survey',
    templateUrl: './satisfaction-survey.component.html',
    styleUrls: ['./satisfaction-survey.component.css']
  })
  export class SatisfactionSurveyComponent implements OnInit {

    survey: SatisfactionSurvey = {
      claimId: 0,       // ID de la réclamation
      userId: 0,        // ID de l'utilisateur
      csatScore: 1,     // Échelle de satisfaction par défaut
      feedback: ''      // Commentaires optionnels
    };

    constructor(
      private satisfactionSurveyService: SatisfactionSurveyService,
      private route: ActivatedRoute,  // Pour obtenir les paramètres de l'URL
      private router: Router

    ) { }

    ngOnInit(): void {
      // Récupérer l'ID de la réclamation et de l'utilisateur depuis l'URL
      this.route.paramMap.subscribe(params => {
        const claimId = params.get('claimId');
        const userId = params.get('userId');
        
        if (claimId && userId) {
          this.survey.claimId = +claimId;
          this.survey.userId = +userId;
        }
      });
    }

    submitSurvey(): void {
      console.log("Données envoyées :", this.survey);
      
      this.satisfactionSurveyService.submitSurvey(this.survey).subscribe(
        (response) => {
          console.log("Formulaire soumis avec succès !", response);
          setTimeout(() => {
            this.router.navigate(['/home']); // Redirection avec un léger délai
          }, 500); // Délai de 500 ms pour éviter les conflits d'exécution
        },
        (error) => {
          console.error("Erreur lors de l'envoi du formulaire :", error);
        }
      );
    }
  }
