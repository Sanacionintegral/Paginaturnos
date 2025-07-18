const form = document.getElementById("turno-form");
const nombreInput = document.getElementById("nombre");
const celularInput = document.getElementById("celular");
const diaSelect = document.getElementById("dia");
const horaSelect = document.getElementById("hora");

const API_URL = "https://script.google.com/macros/s/AKfycbwe3KtS6BlLILPAmrHA05bynpDEtGOlh4sc2ydQ_CmUk8ryjF9ymJ8_RlHECEUQ4sUUtg/exec";

fetch(API_URL)
  .then((res) => res.json())
  .then((ocupados) => {
    const dias = generarDiasDisponibles();
    dias.forEach((dia) => {
      const option = document.createElement("option");
      option.value = dia;
      option.textContent = dia;
      diaSelect.appendChild(option);
    });

    diaSelect.addEventListener("change", () => {
      const diaElegido = diaSelect.value;
      const horas = generarHorasPorDia(diaElegido);

      horaSelect.innerHTML = "";
      horas.forEach((hora) => {
        const yaOcupado = ocupados.some(t => t.dia === diaElegido && t.hora === hora);
        if (!yaOcupado) {
          const option = document.createElement("option");
          option.value = hora;
          option.textContent = hora;
          horaSelect.appendChild(option);
        }
      });
    });
  });

form.addEventListener("submit", (e) => {
  const nombre = nombreInput.value;
  const celular = celularInput.value;
  const dia = diaSelect.value;
  const hora = horaSelect.value;

  if (!nombre || !celular || !dia || !hora) {
    alert("Por favor completá todos los campos.");
    return;
  }

  const url = `https://wa.me/542235931151?text=Ya reservé mi turno para el ${dia} a las ${hora}. Mi nombre es ${nombre} y mi número es ${celular}`;
  window.open(url, "_blank");
});