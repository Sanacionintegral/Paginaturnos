const scriptURL = 'https://script.google.com/macros/s/AKfycbzIkBV5vJIXEFYox2UecZZpnqoOQEVF6OFrqp4JsuDb3fJmSax8FkFdVcwQ7jctMLfQ/exec';
const whatsapp = '2235931151';

const turnosContainer = document.getElementById('turnos');
const mensaje = document.getElementById('mensaje');
let turnos = [];
let reservados = [];

async function cargarTurnos() {
  await fetch(scriptURL)
    .then(res => res.json())
    .then(data => {
      reservados = data.map(r => `${r.dia}_${r.hora}`);
    });

  const fechas = generarFechas();

  fechas.forEach(fecha => {
    const bloques = generarBloques(fecha);
    bloques.forEach(hora => {
      const diaTexto = formatoDia(fecha);
      const id = `${diaTexto}_${hora}`;
      if (!reservados.includes(id)) {
        turnos.push({ diaTexto, fecha, hora });
      }
    });
  });

  mostrarTurnos();
}

cargarTurnos();

function generarFechas() {
  const hoy = new Date();
  const fechas = [];
  for (let i = 0; i < 14; i++) {
    const f = new Date(hoy);
    f.setDate(f.getDate() + i);
    if (f.getDay() !== 0) fechas.push(f); // elimina domingos
  }
  return fechas;
}

function generarBloques(fecha) {
  const bloques = [];
  let inicio = fecha.getDay() === 6 ? 8 : 6;
  let fin = fecha.getDay() === 6 ? 16 : 20;

  for (let i = inicio; i < fin; i++) {
    const hora = `${i.toString().padStart(2, '0')}:00`;
    bloques.push(hora);
  }
  return bloques;
}

function formatoDia(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaSemana = dias[fecha.getDay()];
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  return `${diaSemana} - ${dia}/${mes}/${año}`;
}

function mostrarTurnos() {
  turnos.forEach(turno => {
    const div = document.createElement('div');
    div.className = 'turno';
    div.innerHTML = `
      <div><strong>${turno.diaTexto}</strong></div>
      <div>Horario: ${turno.hora}</div>
      <button onclick='reservarTurno("${turno.diaTexto}", "${turno.hora}")'>Reservar turno</button>
    `;
    turnosContainer.appendChild(div);
  });
}

function reservarTurno(dia, hora) {
  const nombre = prompt("Ingresá tu nombre:");
  const celular = prompt("Ingresá tu número de celular:");

  if (!nombre || !celular) return alert("Debes completar tus datos para continuar.");

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ dia, hora, nombre, celular }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    mensaje.classList.remove('oculto');
    actualizarVista(dia, hora);
    setTimeout(() => {
      const mensajeWp = `Ya reservé mi turno para el ${dia} a las ${hora}. Mi nombre es ${nombre}.`;
      window.location.href = `https://wa.me/54${whatsapp}?text=${encodeURIComponent(mensajeWp)}`;
    }, 1500);
  });
}

function actualizarVista(dia, hora) {
  const botones = document.querySelectorAll('button');
  botones.forEach(btn => {
    if (btn.parentElement.innerHTML.includes(dia) && btn.parentElement.innerHTML.includes(hora)) {
      btn.parentElement.parentElement.remove();
    }
  });
}
