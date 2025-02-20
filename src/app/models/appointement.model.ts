export class Appointement {
    idAppointment: number;
    description: string;
    dateSubmitted: Date;
    status: string;
  
    constructor(
      idAppointment: number = 0,
      description: string = '',
      dateSubmitted: Date = new Date(),
      status: string = 'PENDING'
    ) {
      this.idAppointment = idAppointment;
      this.description = description;
      this.dateSubmitted = dateSubmitted;
      this.status = status;
    }
  }
  