import express from 'express'
import { AppointmentRepo } from '../repos/AppointmentRepo.js'
import { AppointmentService } from '../services/AppointmentService.js'

const app = express()
const port = 3000
const appointmentRepo = new AppointmentRepo()
const appointmentService = new AppointmentService(appointmentRepo)

app.use(express.json())

app.post('/compromissos', async (req, res) => {
  const { data, hora_inicio, hora_fim, descricao } = req.body

  if (!data || !hora_inicio || !hora_fim || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios: data, hora_inicio, hora_fim, descricao' });
  }

  try {
    // Format: "dd/mm/yyyy" -> "yyyy-mm-dd"
    const [day, month, year] = data.split('/');
    const isoDate = `${year}-${month}-${day}`;

    // Create UTC Date objects
    const start_time = new Date(`${isoDate}T${hora_inicio}:00Z`);
    const end_time = new Date(`${isoDate}T${hora_fim}:00Z`);
    
    // Check for invalid dates
    if (isNaN(start_time.getTime()) || isNaN(end_time.getTime())) {
      return res.status(400).json({ error: 'Formato de data ou hora inválido. Use dd/mm/aaaa e hh:mm.' });
    }

    const appointment = await appointmentService.addAppointment(descricao, start_time, end_time)
    res.status(201).json(appointment)
  } catch (error: any) {
    res.status(400).json({ error: error?.message })
  }
})

app.get('/compromissos', async (req, res) => {
  try {
    const appointments = await appointmentService.listAppointments()
    res.json(appointments)
  } catch (error: any) {
    res.status(500).json({ error: error?.message })
  }
})


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
