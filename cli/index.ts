import { Command } from 'commander';
import { AppointmentRepo } from '../repos/AppointmentRepo.js';
import { AppointmentService } from '../services/AppointmentService.js';

const program = new Command();
const appointmentRepo = new AppointmentRepo();
const appointmentService = new AppointmentService(appointmentRepo);

program
  .name('agenda-cli')
  .description('CLI para gerenciamento de compromissos')
  .version('1.0.0');

program
  .command('adicionar')
  .description('Adiciona um novo compromisso')
  .argument('<data>', 'Data do compromisso no formato dd/mm/aaaa')
  .argument('<hora_inicio>', 'Hora de início no formato hh:mm')
  .argument('<hora_fim>', 'Hora de término no formato hh:mm')
  .argument('<descricao>', 'Descrição do compromisso')
  .action(async (data, hora_inicio, hora_fim, descricao) => {
    try {
      const [day, month, year] = data.split('/');
      const isoDate = `${year}-${month}-${day}`;

      const start_time = new Date(`${isoDate}T${hora_inicio}:00Z`);
      const end_time = new Date(`${isoDate}T${hora_fim}:00Z`);

      if (isNaN(start_time.getTime()) || isNaN(end_time.getTime())) {
        console.error('Erro: Formato de data ou hora inválido. Use dd/mm/aaaa e hh:mm.');
        return;
      }

      const appointment = await appointmentService.addAppointment(descricao, start_time, end_time);
      console.log('Compromisso adicionado com sucesso!', appointment);
    } catch (error: any) {
      console.error('Erro ao adicionar compromisso:', error.message);
    }
  });

program
  .command('listar')
  .description('Lista todos os compromissos')
  .action(async () => {
    try {
      const appointments = await appointmentService.listAppointments();
      if (appointments.length === 0) {
        console.log('Nenhum compromisso encontrado.');
        return;
      }
      console.log('Compromissos agendados:');
      appointments.forEach(ap => {
          const start = ap.start_time.toLocaleString('pt-BR', { timeZone: 'UTC', dateStyle: 'short', timeStyle: 'short' });
          const end = ap.end_time.toLocaleString('pt-BR', { timeZone: 'UTC', timeStyle: 'short' });
          console.log(
            `- ID: ${ap.id} | ${ap.description} | ${start} às ${end}`
        );
      });
    } catch (error: any) {
      console.error('Erro ao listar compromissos:', error.message);
    }
  });

program.parse(process.argv);