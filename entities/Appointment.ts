export class Appointment {
  constructor(
    public readonly id: number,
    public readonly description: string,
    public readonly start_time: Date,
    public readonly end_time: Date,
  ) {}
}
