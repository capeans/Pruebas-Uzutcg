
let productos = [];

document.addEventListener("DOMContentLoaded", () => {
  // Carruseles
  document.querySelectorAll(".carousel-container").forEach(container => {
    const track = container.querySelector(".carousel-track");
    const leftBtn = container.querySelector(".carousel-btn.left");
    const rightBtn = container.querySelector(".carousel-btn.right");

    if (!track || !leftBtn || !rightBtn) return;

    leftBtn.addEventListener("click", () => {
      const scrollAmount = track.clientWidth * 0.8;
      if (track.scrollLeft <= 0) {
        track.scrollLeft = track.scrollWidth;
      } else {
        track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    });

    rightBtn.addEventListener("click", () => {
      const scrollAmount = track.clientWidth * 0.8;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
        track.scrollLeft = 0;
      } else {
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    });
  });

  // Productos (cajas/cartas/todo)
  fetch('data/productos.json')
    .then(res => res.json())
    .then(data => {
      const pagina = document.body.dataset.page;
      const esCajas = pagina === 'cajas';
      const esCartas = pagina === 'cartas';
      const esTodo = pagina === 'todo';

      const contenedor = document.getElementById(
        esCajas ? 'productos-cajas' :
        esCartas ? 'productos-cartas' :
        'productos-todo'
      );

      if (!contenedor) return;

      const filtroNombre = document.getElementById('filtro-nombre');
      const filtroCategoria = document.getElementById('filtro-categoria');
      const filtroPrecio = document.getElementById('filtro-precio');
      const precioValor = document.getElementById('precio-valor');
      const filtroIdioma = document.getElementById('filtro-idioma');

      productos = data.filter(p =>
        (esCajas && p.tipo === 'caja') ||
        (esCartas && p.tipo === 'carta') ||
        esTodo
      );

      const render = (lista) => {
        contenedor.innerHTML = lista.map(p => `
          <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}" style="cursor:zoom-in;" onclick="abrirImagenGrande('${p.imagen}')">
            <h3>${p.nombre}</h3>
            <p><strong>Categoría:</strong> ${p.categoria}</p>
            <p><strong>Idioma:</strong> ${p.idioma}</p>
            <p><strong>Precio:</strong> ${p.precio}€</p>
            <p><strong>Stock:</strong> ${p.stock}</p>
          </div>
        `).join('');
      };

      const aplicarFiltros = () => {
        let filtrados = [...productos];
        const q = filtroNombre?.value.toLowerCase() || "";
        const cat = filtroCategoria?.value.toLowerCase() || "";
        const idioma = filtroIdioma?.value.toLowerCase() || "";
        const max = parseFloat(filtroPrecio?.value) || 1000;

        if (q) filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(q));
        if (cat) filtrados = filtrados.filter(p => p.categoria.toLowerCase().includes(cat));
        if (idioma) filtrados = filtrados.filter(p => (p.idioma || "").toLowerCase().includes(idioma));
        filtrados = filtrados.filter(p => parseFloat(p.precio) <= max);

        render(filtrados);
      };

      render(productos);

      filtroNombre?.addEventListener('input', aplicarFiltros);
      filtroCategoria?.addEventListener('change', aplicarFiltros);
      filtroIdioma?.addEventListener('change', aplicarFiltros);
      filtroPrecio?.addEventListener('input', () => {
        precioValor.textContent = filtroPrecio.value;
        aplicarFiltros();
      });
    });
});

// Imagen grande al hacer clic
function abrirImagenGrande(src) {
  const producto = productos.find(p => p.imagen === src);
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.85)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 1000;
  overlay.style.padding = "2em";
  overlay.innerHTML = `
    <div style="display: flex; gap: 2em; align-items: flex-start; max-width: 90vw; background: white; border-radius: 12px; padding: 2em;">
      <img src="${src}" style="width: 400px; height: 400px; object-fit: contain; border-radius: 12px; background: #f4f4f4;">
      <div style="color: #111; max-width: 400px;">
        <h2>${producto.nombre}</h2>
        <p><strong>Categoría:</strong> ${producto.categoria}</p>
        <p><strong>Idioma:</strong> ${producto.idioma}</p>
        <p><strong>Precio:</strong> ${producto.precio}€</p>
        <p><strong>Stock:</strong> ${producto.stock > 0 ? 'Disponible' : 'Agotado'}</p>
        <hr>
        <p>${producto.descripcion || 'Sin descripción disponible.'}</p>
      </div>
    </div>
  `;
  overlay.addEventListener("click", () => document.body.removeChild(overlay));
  document.body.appendChild(overlay);
}
