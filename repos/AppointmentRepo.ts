import { prisma } from '../lib/prisma.js'
import { Appointment } from '../entities/Appointment.js'

export class AppointmentRepo {
  async addAppointment(description: string, start_time: Date, end_time: Date): Promise<Appointment> {
    const appointment = await prisma.appointment.create({
      data: { description, start_time, end_time },
    })
    return new Appointment(appointment.id, appointment.description, appointment.start_time, appointment.end_time);
  }

  async listAppointments(): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        start_time: 'asc',
      }
    })
    return appointments.map(appointment => new Appointment(appointment.id, appointment.description, appointment.start_time, appointment.end_time))
  }

  async findOverlapping(start_time: Date, end_time: Date): Promise<Appointment | null> {
    const overlappingAppointment = await prisma.appointment.findFirst({
      where: {
        start_time: {
          lt: end_time,
        },
        end_time: {
          gt: start_time,
        },
      },
    })

    if (!overlappingAppointment) {
      return null
    }

    return new Appointment(overlappingAppointment.id, overlappingAppointment.description, overlappingAppointment.start_time, overlappingAppointment.end_time);
  }
}
