/**
 * ESTUDIO DE CASO 1: Desarrollo Frontend de Gestión de Restaurante
 * Asignatura: Ambiente Web Cliente Servidor
 */

// Array de datos obligatorio (No modificar)
const menu = [
  { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',    precio: 4500,  categoria: 'Entrada'      },
  { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'      },
  { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',       precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',          precio: 5200,  categoria: 'Postre'       },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'       },
];

// Estructura de persistencia en memoria RAM para las reservaciones activas
const reservas = [];

/**
 * function renderMenu
 * Genera de forma dinámica las tarjetas de los platos mediante manipulación limpia del DOM.
 * @param {Array} listaPlatos - Conjunto de objetos que representan la selección a renderizar.
 */
function renderMenu(listaPlatos = menu) {
  const contenedor = document.getElementById("contenedorMenu");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  listaPlatos.forEach(plato => {
    const columna = document.createElement("div");
    columna.className = "col-md-6 col-lg-4 mb-4";

    const card = document.createElement("div");
    card.className = "card-plato d-flex flex-column justify-content-between";

    card.innerHTML = `
      <div>
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h4 class="h5 mb-0 fw-bold text-dark">${plato.nombre}</h4>
          <span class="badge bg-dark text-uppercase" style="font-size:0.65rem;">${plato.categoria}</span>
        </div>
        <p class="small text-muted mb-3">${plato.descripcion}</p>
      </div>
      <div class="fw-bold text-end text-dark fs-5">
        ₡${plato.precio.toLocaleString('es-CR')}
      </div>
    `;

    columna.appendChild(card);
    contenedor.appendChild(columna);
  });
}

/**
 * function filtrarCategoria
 * Realiza el filtrado lógico comparando el criterio textual seleccionado con las propiedades de los platos.
 * @param {string} categoria - Nombre del filtro de la categoría enviado por el manejador de eventos.
 */
function filtrarCategoria(categoria) {
  if (categoria === "Todos" || categoria === "") {
    renderMenu(menu);
  } else {
    let filtro = categoria;
    
    // Unificación de criterios lingüísticos entre los botones en plural y las categorías del objeto
    if (categoria === "Entradas") filtro = "Entrada";
    if (categoria === "Platos Fuertes") filtro = "Plato Fuerte";
    if (categoria === "Postres") filtro = "Postre";

    const filtrados = menu.filter(p => p.categoria === filtro);
    renderMenu(filtrados);
  }
}

/**
 * function validarFormulario
 * Inspecciona los campos obligatorios del formulario contrastando sus valores con las reglas del negocio.
 * @returns {boolean} Booleano que define si la totalidad de los datos obligatorios son plenamente válidos.
 */
function validarFormulario() {
  let formularioValido = true;

  const inputNombre = document.getElementById("nombre");
  const inputCorreo = document.getElementById("correo");
  const inputFecha = document.getElementById("fecha");
  const inputPersonas = document.getElementById("personas");
  const btnEnviar = document.getElementById("btnEnviar");

  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 1. Nombre completo: Obligatorio, mínimo 5 caracteres, caracteres alfabéticos únicamente.
  if (inputNombre) {
    const val = inputNombre.value.trim();
    const err = document.getElementById("error-nombre");
    if (val === "" || val.length < 5 || !regexLetras.test(val)) {
      inputNombre.classList.add("invalid-style");
      if (err) err.textContent = "Obligatorio. Mínimo 5 caracteres (solo letras y espacios).";
      formularioValido = false;
    } else {
      inputNombre.classList.remove("invalid-style");
      if (err) err.textContent = "";
    }
  }

  // 2. Correo electrónico: Obligatorio, patrón estructurado mediante expresión regular.
  if (inputCorreo) {
    const val = inputCorreo.value.trim();
    const err = document.getElementById("error-correo");
    if (val === "" || !regexCorreo.test(val)) {
      inputCorreo.classList.add("invalid-style");
      if (err) err.textContent = "Ingrese una dirección de correo válida.";
      formularioValido = false;
    } else {
      inputCorreo.classList.remove("invalid-style");
      if (err) err.textContent = "";
    }
  }

  // 3. Fecha de reserva: Obligatoria, restricción de reservas previas a la fecha actual del sistema.
  if (inputFecha) {
    const val = inputFecha.value;
    const err = document.getElementById("error-fecha");
    if (val === "") {
      inputFecha.classList.add("invalid-style");
      if (err) err.textContent = "La fecha de reserva es obligatoria.";
      formularioValido = false;
    } else {
      const elegida = new Date(val + "T00:00:00");
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (elegida < hoy) {
        inputFecha.classList.add("invalid-style");
        if (err) err.textContent = "No se permiten reservar fechas pasadas.";
        formularioValido = false;
      } else {
        inputFecha.classList.remove("invalid-style");
        if (err) err.textContent = "";
      }
    }
  }

  // 4. Cantidad de Personas: Obligatorio, límites de aforo entre 1 y 20 personas.
  if (inputPersonas) {
    const val = parseInt(inputPersonas.value, 10);
    const err = document.getElementById("error-personas");
    if (isNaN(val) || val < 1 || val > 20) {
      inputPersonas.classList.add("invalid-style");
      if (err) err.textContent = "Debe registrar un aforo entre 1 y 20 personas.";
      formularioValido = false;
    } else {
      inputPersonas.classList.remove("invalid-style");
      if (err) err.textContent = "";
    }
  }

  // Control reactivo sobre el estado de bloqueo del control de submit del formulario
  if (btnEnviar) {
    btnEnviar.disabled = !formularioValido;
  }

  return formularioValido;
}

/**
 * function agregarReserva
 * Captura las variables validadas, genera un objeto estructurado e inyecta la fila respectiva en la interfaz.
 */
function agregarReserva() {
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const personas = parseInt(document.getElementById("personas").value, 10);
  const comentarios = document.getElementById("comentarios") ? document.getElementById("comentarios").value.trim() : "";

  const nuevaReserva = { nombre, correo, fecha, hora, personas, comentarios };
  reservas.push(nuevaReserva);

  const tablaBody = document.getElementById("listaReservasTabla");
  if (tablaBody) {
    const fila = document.createElement("tr");
    fila.className = "fila-reserva"; 

    // Regla comercial: Resaltado visual para grupos de 6 o más personas
    if (personas >= 6) {
      fila.classList.add("vip-row");
    }

    fila.innerHTML = `
      <td>${nuevaReserva.nombre}</td>
      <td>${nuevaReserva.correo}</td>
      <td>${nuevaReserva.fecha}</td>
      <td>${nuevaReserva.hora}</td>
      <td class="text-center">${nuevaReserva.personas}</td>
    `;
    tablaBody.appendChild(fila);
  }

  actualizarResumen();

  // Restablecimiento controlado del formulario a su estado por defecto
  const form = document.getElementById("form-reserva");
  if (form) {
    form.reset();
    const btnEnviar = document.getElementById("btnEnviar");
    if (btnEnviar) btnEnviar.disabled = true;
  }
}

/**
 * function actualizarResumen
 * Computa de forma agregada el volumen operacional total de las reservaciones en memoria.
 */
function actualizarResumen() {
  const totalReservas = reservas.length;
  const totalPersonas = reservas.reduce((acc, res) => acc + res.personas, 0);

  let mayorReservaTexto = "Ninguna";
  if (totalReservas > 0) {
    const mayorObj = reservas.reduce((max, res) => res.personas > max.personas ? res : max, reservas[0]);
    mayorReservaTexto = `${mayorObj.nombre} (${mayorObj.personas} personas)`;
  }

  const elTotalRes = document.getElementById("resumenTotalReservas");
  const elTotalPer = document.getElementById("resumenTotalPersonas");
  const elMayorRes = document.getElementById("resumenMayorReserva");

  if (elTotalRes) elTotalRes.textContent = totalReservas;
  if (elTotalPer) elTotalPer.textContent = totalPersonas;
  if (elMayorRes) elMayorRes.textContent = mayorReservaTexto;
}

// Inicialización del Ciclo de Vida del DOM y registro centralizado de controladores de eventos
document.addEventListener("DOMContentLoaded", () => {
  const botonesFiltro = document.querySelectorAll(".btn-filtro");
  const formReserva = document.getElementById("form-reserva");

  // Asignación de manejadores de eventos para los botones de filtrado de categorías
  botonesFiltro.forEach(boton => {
    boton.addEventListener("click", (e) => {
      botonesFiltro.forEach(btn => btn.classList.remove("active"));
      e.target.classList.add("active");
      
      const categoriaSeleccionada = e.target.getAttribute("data-categoria");
      filtrarCategoria(categoriaSeleccionada);
    });
  });

  // Suscripción de controladores reactivos para validación en tiempo real y sumisión del formulario
  if (formReserva) {
    formReserva.addEventListener("input", validarFormulario);
    
    formReserva.addEventListener("submit", (e) => {
      e.preventDefault(); 
      if (validarFormulario()) {
        agregarReserva();
      }
    });
  }

  // Ejecución del renderizado inicial obligatorio de los platillos del menú al cargar la aplicación
  renderMenu(menu);
});