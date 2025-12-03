
let currentView = 'month';
let currentDate = new Date();
let appointments = [];

const API_URL = '/compromissos';

document.addEventListener('DOMContentLoaded', () => {
    loadAppointments();
    document.getElementById('inputDate').valueAsDate = new Date();
});


async function loadAppointments() {
    try {
        const res = await fetch(API_URL);
        appointments = await res.json();
        renderCalendar();
    } catch (err) {
        console.error("Erro ao carregar:", err);
        alert("Erro ao conectar com API");
    }
}

async function createAppointment() {
    const dateStr = document.getElementById('inputDate').value;
    const start = document.getElementById('inputStart').value;
    const end = document.getElementById('inputEnd').value;
    const desc = document.getElementById('inputDesc').value;

    if (!dateStr || !start || !end || !desc) return alert("Preencha tudo!");

    const [y, m, d] = dateStr.split('-');

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: `${d}/${m}/${y}`,
                hora_inicio: start,
                hora_fim: end,
                description: desc
            })
        });

        if (res.ok) {
            await loadAppointments(); 
            alert("Agendado!");
        } else {
            const err = await res.json();
            alert("Erro: " + err.error);
        }
    } catch (e) { console.error(e); }
}


function setView(view) {
    currentView = view;

    document.querySelectorAll('.view-controls button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn' + view.charAt(0).toUpperCase() + view.slice(1)).classList.add('active');
    renderCalendar();
}

function changeDate(delta) {
    if (currentView === 'day') {
        currentDate.setDate(currentDate.getDate() + delta);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() + (delta * 7));
    } else if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + delta);
    }
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    renderCalendar();
}


function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    container.innerHTML = '';


    container.className = 'calendar-container';

    if (currentView === 'day') renderDayView(container);
    else if (currentView === 'week') renderWeekView(container);
    else if (currentView === 'month') renderMonthView(container);
}


function renderMonthView(container) {
    container.classList.add('view-month');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    
    document.getElementById('dateDisplay').innerText =
        new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    days.forEach(d => {
        const el = document.createElement('div');
        el.className = 'month-day-header';
        el.innerText = d;
        container.appendChild(el);
    });

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0-6
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        container.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(year, month, day);
        const cellString = cellDate.toISOString().split('T')[0];

        const cell = document.createElement('div');
        cell.className = 'month-cell';
        if (cellString === new Date().toISOString().split('T')[0]) cell.classList.add('today');

        cell.onclick = () => { currentDate = cellDate; setView('day'); };

        cell.innerHTML = `<span class="day-number">${day}</span>`;

        const daysEvents = appointments.filter(app => {
            if (!app.start_time) return false;
            return app.start_time.startsWith(cellString);
        });

        daysEvents.forEach(app => {
            const evt = document.createElement('div');
            evt.className = 'month-event';
            evt.innerText = app.description;
            cell.appendChild(evt);
        });

        container.appendChild(cell);
    }
}

function renderWeekView(container) {
    container.classList.add('view-week');

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    document.getElementById('dateDisplay').innerText =
        `${startOfWeek.toLocaleDateString('pt-BR')} - ${endOfWeek.toLocaleDateString('pt-BR')}`;

    container.appendChild(document.createElement('div'));

    const currentWeekDays = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        currentWeekDays.push(d);

        const header = document.createElement('div');
        header.className = 'week-day-header';
        header.innerHTML = `${d.toLocaleDateString('pt-BR', { weekday: 'short' })}<br>${d.getDate()}`;
        container.appendChild(header);
    }

    for (let hour = 8; hour < 21; hour++) {
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.innerText = `${hour}:00`;
        container.appendChild(timeLabel);

        for (let i = 0; i < 7; i++) {
            const cell = document.createElement('div');
            cell.className = 'week-grid-cell';

            const dayIso = currentWeekDays[i].toISOString().split('T')[0];

            appointments.forEach(app => {
                if (!app.start_time) return;
                const appDate = new Date(app.start_time);
                if (app.start_time.startsWith(dayIso) && appDate.getUTCHours() === hour) {
                    const div = document.createElement('div');
                    div.className = 'event-card';
                    div.innerText = app.description;
                    cell.appendChild(div);
                }
            });

            container.appendChild(cell);
        }
    }
}

function renderDayView(container) {
    container.classList.add('view-day');

    document.getElementById('dateDisplay').innerText =
        currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    const dayIso = currentDate.toISOString().split('T')[0];

    for (let hour = 8; hour < 19; hour++) {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'time-label';
        timeDiv.innerText = `${hour}:00`;
        container.appendChild(timeDiv);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'day-column';

        appointments.forEach(app => {
            if (!app.start_time) return;

            const appDate = new Date(app.start_time);
            if (app.start_time.startsWith(dayIso) && appDate.getUTCHours() === hour) {
                const div = document.createElement('div');
                div.className = 'event-card';
                div.style.top = '2px';
                div.style.height = '50px';
                div.innerText = `${app.description} (${appDate.getUTCHours()}:${String(appDate.getUTCMinutes()).padStart(2, '0')})`;
                contentDiv.appendChild(div);
            }
        });

        container.appendChild(contentDiv);
    }
}
