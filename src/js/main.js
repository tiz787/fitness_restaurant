/**
 * Obtener info de los platillos 
 */
function obtenerPlatillos() {
  let guardados = localStorage.getItem('mi_base_de_datos_platillos');

  // Si ya tenemos datos guardados, los usamos
  if (guardados) {
    return JSON.parse(guardados);
  }

  // Si no hay datos (primera vez o borramos el historial), creamos una lista por defecto
  let listaPorDefecto = [
    {
      id: 1,
      nombre: "Pizza",
      precio: 30000,
      calorias: 300,
      proteinas: 12,
      carbohidratos: 40,
      grasas: 10,
      descripcion: "Deliciosa pizza con ingredientes frescos.",
      categoria: "Comida Rápida",
      disponible: true,
      imagen: "assets/images/imagen1-EnsaladaVeganaPremiun.jpeg"
    },
    {
      id: 2,
      nombre: "Hamburguesa",
      precio: 15000,
      calorias: 400,
      proteinas: 20,
      carbohidratos: 30,
      grasas: 10,
      descripcion: "Deliciosa hamburguesa con ingredientes frescos.",
      categoria: "Comida Rápida",
      disponible: true,
      imagen: "assets/images/imagen2-PechugaAsadaFitness.jpeg"
    },
    {
      id: 3,
      nombre: "Ensalada César",
      precio: 12000,
      calorias: 250,
      proteinas: 8,
      carbohidratos: 20,
      grasas: 15,
      descripcion: "Ensalada César fresca con ingredientes orgánicos.",
      categoria: "Comida Rápida",
      disponible: true,
      imagen: "assets/images/imagen3-BuddhaBowlDetox.jpeg"
    },
    {
      id: 4,
      nombre: "salchipapa",
      precio: 20000,
      calorias: 300,
      proteinas: 12,
      carbohidratos: 40,
      grasas: 10,
      descripcion: "Deliciosa salchipapa con ingredientes frescos.",
      categoria: "Comida Rápida",
      disponible: true,
      imagen: "assets/images/imagen6-JugoNaranjaZanahoria.jpeg"
    },
    {
      id: 5,
      nombre: "Plato Especial sin Foto",
      precio: 25000,
      calorias: 500,
      proteinas: 30,
      carbohidratos: 50,
      grasas: 15,
      descripcion: "Este plato no tiene foto, usará un emoji.",
      categoria: "Especiales",
      disponible: true,
      imagen: "" // Está vacío, y mostrar un emoji
    }
  ];

  // Guardamos esta lista por defecto en el navegador para la próxima vez
  localStorage.setItem('mi_base_de_datos_platillos', JSON.stringify(listaPorDefecto));

  return listaPorDefecto;
}

/**
 * guardar un platillo
 */
function guardarPlatillos(nuevaLista) {
  localStorage.setItem('mi_base_de_datos_platillos', JSON.stringify(nuevaLista));
}

// aqui se irian metiendo los platillos que coja la persona
// lo cargamos del navegador para que no se pierda al cambiar de pagina
let carritoGuardado = localStorage.getItem('mi_carrito');
let carritoDeCompras = carritoGuardado ? JSON.parse(carritoGuardado) : [];

function agregarProductoId(idBuscado) {
  // 1. conseguimos los platillos si hay en local storage
  let todosLosPlatos = obtenerPlatillos();

  // 2. Buscamos el plato que tenga el mismo ID
  let platoEncontrado = todosLosPlatos.find(p => p.id === idBuscado);

  if (!platoEncontrado) {
    alert("Ese plato ya no existe.");
    return;
  }

  if (!platoEncontrado.disponible) {
    alert("Este plato está agotado por ahora.");
    return;
  }

  // 3. miramos si esta en el carrito de antes
  let yaEnElCarrito = carritoDeCompras.find(item => item.id === idBuscado);

  if (yaEnElCarrito) {
    // Le sumamos 1 a la cantidad
    yaEnElCarrito.cantidad += 1;
  } else {
    // Lo metemos como un elemento nuevo
    let nuevoItem = {
      id: platoEncontrado.id,
      nombre: platoEncontrado.nombre,
      precio: platoEncontrado.precio,
      cantidad: 1
    };
    carritoDeCompras.push(nuevoItem);
  }

  // 4. Actualizamos la pantalla donde va el carrito
  dibujarCarrito();
  actualizarPrecios();

  // 5. guardamos el carrito en el navegador para que no se pierda
  localStorage.setItem('mi_carrito', JSON.stringify(carritoDeCompras));


  console.log("Producto agregado:", platoEncontrado.nombre);
}



/**
 * Función que dibuja los productos dentro del cuadro del carrito.
 */
function dibujarCarrito() {
  let contenedor = document.getElementById("contenedor-lista-articulos");
  let mensajeVacio = document.getElementById("mensaje-carrito-vacio");

  if (!contenedor || !mensajeVacio) return;


  contenedor.innerHTML = "";


  mensajeVacio.style.display = "none";
  contenedor.appendChild(mensajeVacio);

  if (carritoDeCompras.length === 0) {

    mensajeVacio.style.display = "block";
    return;
  }


  carritoDeCompras.forEach(producto => {
    let codigoHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #444;">
                <div>
                    <strong style="color: white; display: block;">${producto.nombre}</strong>
                    <span style="color: #bbb; font-size: 0.8rem;">Cant: ${producto.cantidad} x $${producto.precio.toFixed(2)}</span>
                </div>
                <div style="font-weight: bold; color: var(--color-primary);">
                    $${(producto.cantidad * producto.precio).toFixed(2)}
                </div>
            </div>
        `;
    contenedor.innerHTML += codigoHTML;
  });
}

/**
 * para saber cuanto hay que pagar en el pedido
 */
function actualizarPrecios() {
  let cartSubtotal = document.getElementById("cart-subtotal");
  let cartTax = document.getElementById("cart-tax");
  let cartTotal = document.getElementById("cart-total");



  // si no estamos en la pagina de pedidos, estos elementos no existen
  if (!cartSubtotal || !cartTax || !cartTotal) return;

  // (cantidad * precio) de cada cosa
  let subtotal = 0;
  carritoDeCompras.forEach(item => {
    subtotal += item.cantidad * item.precio;
  });

  // Calculamos el impuesto
  let impuesto = subtotal * 0.19;

  // Sumamos todo para el total final
  let totalFin = subtotal + impuesto;

  // Ponemos los resultados en el HTML
  cartSubtotal.innerText = "$" + subtotal.toFixed(2);
  cartTax.innerText = "$" + impuesto.toFixed(2);
  cartTotal.innerText = "$" + totalFin.toFixed(2);
}



function render() {
  let container = document.querySelector(".dashboard-productos");
  // Solo ejecutamos si hay un lugar para dibujar las tarjetas
  if (!container) return;

  // 1. mostramos la lista de platillos
  let listaActualizada = obtenerPlatillos();

  container.innerHTML = "";

  // 2. Por cada plato, creamos su código HTML
  listaActualizada.forEach(platillo => {

    // --- LÓGICA DE LA IMAGEN O EL EMOJI ---
    let codigoImagen = "";

    // Si tiene la palabra "imagen" y no está vacía, usamos la foto
    if (platillo.imagen && platillo.imagen.trim() !== "") {
      let rutaFija = platillo.imagen;

      // miramos si estamos en una subcarpeta (como pages/)
      // si la URL tiene /pages/ necesitamos subir un nivel con ../
      let estamosEnSubcarpeta = window.location.pathname.includes("/pages/");

      if (estamosEnSubcarpeta && !rutaFija.startsWith("http") && !rutaFija.startsWith("../")) {
        rutaFija = "../" + rutaFija;
      }

      codigoImagen = `<img src="${rutaFija}" alt="${platillo.nombre}" style="width: 100%; height: 100%; object-fit: cover;" />`;
    } else {
      // Si NO tiene imagen, usamos un Emoji grande centrado
      codigoImagen = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: #333; font-size: 4rem;">
                    🍽️
                </div>
            `;
    }

    // 3. Escribimos el HTML. Fíjate que en onclick usamos la nueva función agregarProductoId
    container.innerHTML += `
           <article class="card ${platillo.disponible ? '' : 'card--disabled'}" style="${platillo.disponible ? '' : 'opacity: 0.6; grayscale(100%);'}">
            <div class="card__image" style="height: 200px; overflow: hidden;">
              ${codigoImagen}
            </div>
            <div class="card__content">
              <h3 class="card__title">${platillo.nombre} ${platillo.disponible ? '' : '(AGOTADO)'}</h3>
              <p class="card__description">${platillo.descripcion}</p>
              
              <div class="card__meta">
                <span>🔥 ${platillo.calorias} cal</span>
                <span>💪 ${platillo.proteinas}g Prot</span>
              </div>
              
              <div class="card__price">$${platillo.precio}</div>
              
              <div class="card__actions gap-sm">
                <!-- Usamos el ID verdadero del plato -->
                <button class="button button--primary button--small" 
                        onclick="agregarProductoId(${platillo.id})"
                        ${platillo.disponible ? '' : 'disabled'}>
                  Agregar
                </button>
                <button class="button button--outline button--small" onclick="platilloVerDetalles(${platillo.id})">
                  Ver Detalles
                </button>
              </div>
            </div>
          </article>
        `;
  });
}

function platilloVerDetalles(id) {
  let lista = obtenerPlatillos();
  let platillo = lista.find(p => p.id === id);
  if (!platillo) return; // Si por alguna razón no lo halla

  let modalVerDetalles = document.createElement("div");
  modalVerDetalles.classList.add("modal");
  modalVerDetalles.innerHTML = `
      <div class="modal__content" role="dialog" aria-modal="true">
        <h2>${platillo.nombre}</h2>
        <p>${platillo.descripcion}</p>
        <p>Calorías: ${platillo.calorias}</p>
        <p>Proteínas: ${platillo.proteinas}g</p>
        <p>Carbohidratos: ${platillo.carbohidratos}g</p>
        <p>Grasas: ${platillo.grasas}g</p>
        <button class="button button--primary modal__close">Cerrar</button>
      </div>
    `;
  document.body.appendChild(modalVerDetalles);

  modalVerDetalles.addEventListener('click', function (e) {
    if (e.target === modalVerDetalles) {
      modalVerDetalles.remove();
    }
  });

  const closeBtn = modalVerDetalles.querySelector('.modal__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      modalVerDetalles.remove();
    });
  }
}

// --- CATÁLOGO DE PLATILLOS (Tabla de Administrador) ---

/**
 * Función que dibuja la tabla del catálogo leyendo del LocalStorage.
 */
function dibujarCatalogo() {
  let tabla = document.getElementById("tabla-platillos");
  // Solo se ejecuta si estamos en la página del Catálogo
  if (!tabla) return;

  let listaA = obtenerPlatillos();
  tabla.innerHTML = "";

  listaA.forEach(platillo => {
    // Lógica de Imagen / Emoji simple para la tabla
    let vistaImagen = "";
    if (platillo.imagen) {
      let rutaImg = platillo.imagen;
      let enSubcarpeta = window.location.pathname.includes("/pages/");
      if (enSubcarpeta && !rutaImg.startsWith("http") && !rutaImg.startsWith("../")) {
        rutaImg = "../" + rutaImg;
      }
      vistaImagen = `<img src="${rutaImg}" alt="${platillo.nombre}" style="width: 60px; height: 60px; object-fit: cover;" />`;
    } else {
      vistaImagen = `<div style="width: 60px; height: 60px; display:flex; align-items:center; justify-content:center; font-size: 2rem; background: #333; border-radius: var(--border-radius-md);">🍽️</div>`;
    }

    let switchActivo = platillo.disponible ? "active" : "";

    tabla.innerHTML += `
            <tr>
                <td>${vistaImagen}</td>
                <td><strong>#00${platillo.id}</strong><br />${platillo.nombre}</td>
                <td>${platillo.descripcion}</td>
                <td>${platillo.categoria}</td>
                <td>$${platillo.precio}</td>
                <td>${platillo.calorias} cal</td>
                <td>
                  <div class="toggle-switch ${switchActivo}"></div>
                </td>
                <td>
                  <div class="badge-cell">
                    <span class="badge badge--success">📝 Dinámico</span>
                  </div>
                </td>
                <td>
                  <span class="audit-info">✏️ Sistema</span>
                  <span class="audit-info">Hoy</span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="button button--outline button--small" onclick="editarPlatilloBasico(${platillo.id})">
                      ✏️ Editar
                    </button>
                    <button class="button button--danger button--small" onclick="borrarPlatillo(${platillo.id})">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
        `;
  });
}

/**
 * Función sencilla para borrar un plato usando su ID
 */
function borrarPlatillo(idBorrar) {
  let confirmacion = confirm("¿Estás seguro de que quieres borrar este platillo?");
  if (!confirmacion) return; // Si dice que no, no hacemos nada

  let lista = obtenerPlatillos();

  // Filtramos la lista para quedarnos con todos MENOS el que queremos borrar
  let listaNueva = lista.filter(p => p.id !== idBorrar);

  // Guardamos la nueva lista
  guardarPlatillos(listaNueva);

  // Volvemos a dibujar
  dibujarCatalogo();
  render(); // Por si estamos en el dashboard (aunque normalmente no)

  alert("Platillo borrado correctamente.");
}

/**
 * Función sencilla para editar nombre y precio con un Prompt
 */
function editarPlatilloBasico(idEditar) {
  let lista = obtenerPlatillos();

  // Buscamos el plato que queremos editar
  let platoExistente = lista.find(p => p.id === idEditar);

  if (!platoExistente) return;

  // Pedimos los datos nuevos (Si no escribe nada, dejamos el que estaba)
  let nuevoNombre = prompt("Nuevo nombre:", platoExistente.nombre) || platoExistente.nombre;
  let nuevoPrecio = prompt("Nuevo precio:", platoExistente.precio) || platoExistente.precio;

  // Actualizamos el plato
  platoExistente.nombre = nuevoNombre;
  platoExistente.precio = parseFloat(nuevoPrecio);

  // Guardamos y dibujamos
  guardarPlatillos(lista);
  dibujarCatalogo();

  alert("Platillo actualizado.");
}

// --- limpiar pedidos ---

/**
 * Función para limpiar todo el formulario y el carrito en Gestión de Pedidos.
 */
function limpiarPedidos() {
  // 1. Vaciar el carrito
  carritoDeCompras = [];
  // guardamos el carrito vacio en el navegador
  localStorage.setItem('mi_carrito', JSON.stringify(carritoDeCompras));

  // 2. Redibujar la pantalla del carrito y totales
  dibujarCarrito();
  actualizarPrecios();

  // 3. Limpiar todos los campos del cliente usando sus selectores
  // Buscamos todos los campos tipo input, textarea y select dentro de la sección
  let inputs = document.querySelectorAll('.card.card--dark input, .card.card--dark textarea, .card.card--dark select');

  inputs.forEach(campo => {
    if (campo.tagName === 'SELECT') {
      campo.selectedIndex = 0; // Volver al primer valor (Seleccionar)
    } else {
      campo.value = ""; // Vaciar texto
    }
  });

  alert("Carrito y formulario limpiados correctamente.");
}

// --- PROCESAR ORDEN ---


function obtenerOrdenes() {
  let guardadas = localStorage.getItem('mis_ordenes');
  // si hay ordenes guardadas las devolvemos
  if (guardadas) {
    return JSON.parse(guardadas);
  }
  return [];
}

// esta funcion guarda la lista de ordenes en el navegador
function guardarOrdenes(listaOrdenes) {
  localStorage.setItem('mis_ordenes', JSON.stringify(listaOrdenes));
}

/**
 * cuando le damos al boton "Procesar Orden"
 */
function procesarOrden() {
  // 1. primero revisamos que haya algo en el carrito
  if (carritoDeCompras.length === 0) {
    alert("No puedes procesar una orden sin platillos en el carrito.");
    return;
  }

  // 2. agarramos el nombre del cliente (es obligatorio)
  let nombreCliente = document.getElementById("customer-name").value;
  if (!nombreCliente || nombreCliente.trim() === "") {
    alert("Por favor escribe el nombre del cliente.");
    return;
  }

  // 3. agarramos los demas campos del formulario
  let telefonoCliente = document.getElementById("customer-phone").value;
  let emailCliente = document.getElementById("customer-email").value;
  let notasCliente = document.getElementById("customer-notes").value;
  let metodoPago = document.getElementById("payment-method").value;
  let tipoOrden = document.getElementById("order-type").value;

  // 4. calculamos el total (subtotal + iva)
  let subtotal = 0;
  carritoDeCompras.forEach(item => {
    subtotal += item.cantidad * item.precio;
  });
  let impuesto = subtotal * 0.19;
  let totalFinal = subtotal + impuesto;

  // 5. juntamos los nombres de los platillos en un solo texto
  // ejemplo: "Pizza x2, Hamburguesa x1"
  let resumenPlatillos = carritoDeCompras.map(item => {
    return item.nombre + " x" + item.cantidad;
  }).join(", ");

  // 6. creamos el objeto de la orden con toda la info
  let nuevaOrden = {
    id: Date.now(),                    // un numero unico basado en la hora actual
    cliente: nombreCliente.trim(),
    telefono: telefonoCliente,
    email: emailCliente,
    notas: notasCliente,
    metodoPago: metodoPago,
    tipoOrden: tipoOrden,
    platillos: resumenPlatillos,       // el texto con los nombres
    items: [...carritoDeCompras],      // copia de todo el carrito
    subtotal: subtotal,
    impuesto: impuesto,
    total: totalFinal,
    estado: "Pendiente",               // empieza como pendiente
    fecha: new Date().toLocaleString() // la fecha y hora de ahora
  };

  // 7. traemos las ordenes que ya habia guardadas
  let todasLasOrdenes = obtenerOrdenes();

  // 8. metemos la nueva orden al principio de la lista (para que se vea de primera)
  todasLasOrdenes.unshift(nuevaOrden);

  // 9. guardamos la lista actualizada en el navegador
  guardarOrdenes(todasLasOrdenes);

  // 10. limpiamos el carrito y el formulario
  limpiarPedidos();

  // 11. le decimos al usuario que todo salio bien
  alert("¡Orden procesada correctamente! Puedes verla en el Dashboard en 'Órdenes Recientes'.");
}

/**
 * esta funcion dibuja la tabla de ordenes recientes en el dashboard
 */
function dibujarOrdenesRecientes() {
  let tabla = document.getElementById("tabla-ordenes");

  if (!tabla) return;

  let ordenes = obtenerOrdenes();
  tabla.innerHTML = "";

  // si no hay ordenes mostramos un mensaje
  if (ordenes.length === 0) {
    tabla.innerHTML = `
      <tr class="table__row">
        <td class="table__cell" colspan="6" style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">
          No hay órdenes todavía. Ve a Gestión de Pedidos para crear una.
        </td>
      </tr>
    `;
    return;
  }

  // por cada orden creamos una fila en la tabla
  ordenes.forEach(orden => {
    // elegimos el estilo del badge segun el estado
    let claseBadge = "";
    let textoEstado = "";

    if (orden.estado === "Pendiente") {
      claseBadge = "table__status--pending";
      textoEstado = "⏱ Pendiente";
    } else if (orden.estado === "Completado") {
      claseBadge = "table__status--completed";
      textoEstado = "✓ Completado";
    } else {
      claseBadge = "table__status--cancelled";
      textoEstado = "✕ Cancelado";
    }

    // el id que mostramos es los ultimos 4 digitos del timestamp
    let idCorto = "#" + String(orden.id).slice(-4);

    // el boton cambia segun el estado
    let botonAccion = "";
    if (orden.estado === "Pendiente") {
      botonAccion = `<button class="button button--secondary button--small" onclick="completarOrden(${orden.id})">Completar</button>`;
    } else {
      botonAccion = `<button class="button button--outline button--small" disabled>Completado</button>`;
    }

    tabla.innerHTML += `
      <tr class="table__row">
        <td class="table__cell">${idCorto}</td>
        <td class="table__cell">${orden.cliente}</td>
        <td class="table__cell">${orden.platillos}</td>
        <td class="table__cell"><strong>$${orden.total.toFixed(2)}</strong></td>
        <td class="table__cell">
          <span class="table__status ${claseBadge}">${textoEstado}</span>
        </td>
        <td class="table__cell">${botonAccion}</td>
      </tr>
    `;
  });
}

/**
 * cuando le damos a "Completar" en la tabla de ordenes
 */
function completarOrden(idOrden) {
  // 1. traemos todas las ordenes
  let ordenes = obtenerOrdenes();

  // 2. buscamos la orden que queremos completar
  let ordenEncontrada = ordenes.find(o => o.id === idOrden);

  if (!ordenEncontrada) return;

  // 3. le cambiamos el estado
  ordenEncontrada.estado = "Completado";

  // 4. guardamos y redibujamos
  guardarOrdenes(ordenes);
  dibujarOrdenesRecientes();
}

// este codigo dibuja todo al cargar la pagina
window.onload = function () {
  render();                    // dibuja las tarjetas de platillos
  dibujarCarrito();            // dibuja el carrito (con lo que haya guardado)
  actualizarPrecios();         // calcula subtotal, iva y total
  dibujarCatalogo();           // dibuja la tabla del catalogo (si existe)
  dibujarOrdenesRecientes();   // dibuja la tabla de ordenes (si existe)
};
