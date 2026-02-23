let platillos = [
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
        imagen: "src/assets/images/imagen6-JugoNaranjaZanahoria.jpeg"
    }
];


function render(){
    let container = document.querySelector(".dashboard-productos");
    container.innerHTML = "";
    platillos.forEach(platillo => {
        container.innerHTML += `
           <article class="card">
            <div class="card__image">
              <img src="${platillo.imagen}" alt="${platillo.nombre}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div class="card__content">
              <h3 class="card__title">${platillo.nombre}</h3>
              <p class="card__description">
                ${platillo.descripcion}
                aguacate
              </p>
              <div class="card__meta">
                <span>🔥 ${platillo.calorias} cal</span>
                <span>💪 ${platillo.proteinas}g Proteína</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                <span class="badge badge--success">🌱 Vegano</span>
                <span class="badge badge--primary">🌿 Orgánico</span>
                <span class="badge badge--error">🚫 Sin Gluten</span>
              </div>
              <div class="card__price">$${platillo.precio}</div>
              <div class="card__actions gap-sm">
                <button class="button button--primary button--small">
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

function platilloVerDetalles(id){
    let platillo = platillos.find(p => p.id === id);
   
    // Usamos un elemento <div> con clase .modal para evitar problemas
    // de estilos nativos del elemento <dialog> y controlar cierre fácilmente.
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

    // Cerrar al hacer click en el overlay (fuera del contenido)
    modalVerDetalles.addEventListener('click', function (e) {
      if (e.target === modalVerDetalles) {
        modalVerDetalles.remove();
      }
    });

    // Cerrar con el botón 'Cerrar'
    const closeBtn = modalVerDetalles.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        modalVerDetalles.remove();
      });
    }
}


    

render();
