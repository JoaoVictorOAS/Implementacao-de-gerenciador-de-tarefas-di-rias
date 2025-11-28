import { AppointmentRepo } from '../repos/AppointmentRepo.js'
import { Appointment } from '../entities/Appointment.js'

export class AppointmentService {
  constructor(private readonly appointmentRepo: AppointmentRepo) {}

  async addAppointment(description: string, start_time: Date, end_time: Date): Promise<Appointment> {
    if (start_time >= end_time) {
      throw new Error('O horário de início deve ser anterior ao horário de término.');
    }

    const overlapping = await this.appointmentRepo.findOverlapping(start_time, end_time);

    if (overlapping) {
      throw new Error('Já existe um compromisso neste horário.');
    }

    return this.appointmentRepo.addAppointment(description, start_time, end_time);
  }

  async listAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.listAppointments();
  }
}
