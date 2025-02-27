// src/app/models/appointement.model.ts
export class Appointement {
  idAppointment: number;
  description: string;
  dateSubmitted: Date;
  status: string;
  archiver: boolean;

  constructor(
    idAppointment: number = 0,
    description: string = '',
    dateSubmitted: Date = new Date(),
    status: string = 'PENDING',
    archiver: boolean = true
  ) {
    this.idAppointment = idAppointment;
    this.description = description;
    this.dateSubmitted = dateSubmitted;
    this.status = status;
    this.archiver = archiver;
  }
}