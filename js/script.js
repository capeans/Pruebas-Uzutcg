document.addEventListener("DOMContentLoaded", () => {
  // Carrusel funcional
  document.querySelectorAll(".carousel-container").forEach(container => {
    const track = container.querySelector(".carousel-track");
    const left = container.querySelector(".carousel-btn.left");
    const right = container.querySelector(".carousel-btn.right");

    left?.addEventListener("click", () => {
      track.scrollBy({ left: -300, behavior: "smooth" });
    });
    right?.addEventListener("click", () => {
      track.scrollBy({ left: 300, behavior: "smooth" });
    });
  });

  // Carga y filtro de productos
  fetch("data/productos.json")
    .then(res => res.json())
    .then(data => {
      const pagina = document.body.dataset.page;
      const contenedor = document.getElementById(
        pagina === 'cajas' ? 'productos-cajas' :
        pagina === 'cartas' ? 'productos-cartas' :
        'productos-todo'
      );

      const filtroCategoria = document.getElementById("filtro-categoria");
      const filtroNombre = document.getElementById("filtro-nombre");
      const filtroIdioma = document.getElementById("filtro-idioma");
      const filtroPrecio = document.getElementById("filtro-precio");
      const precioValor = document.getElementById("precio-valor");

      let productos = data.filter(p =>
        (pagina === 'cajas' && p.tipo === 'caja') ||
        (pagina === 'cartas' && p.tipo === 'carta') ||
        pagina === 'todo'
      );
      const productosOriginales = [...productos];

      // Filtrar por URL si hay categoria
      const params = new URLSearchParams(window.location.search);
      const categoriaInicial = params.get("categoria")?.toLowerCase();
      let productosMostrados = [...productosOriginales];
      if (categoriaInicial) {
        productosMostrados = productosOriginales.filter(p =>
          p.categoria.toLowerCase().replace(/ /g, "-") === categoriaInicial
        );
        if (filtroCategoria) filtroCategoria.value = categoriaInicial.replace(/-/g, " ");
      }

      const render = (lista) => {
        contenedor.innerHTML = lista.map(p => `
          <div class="producto">
            <img src="${p.imagen}" alt="${p.nombre}" onclick="abrirImagenGrande('${p.imagen}')" style="cursor:zoom-in;">
            <h3>${p.nombre}</h3>
            <p><strong>Categoría:</strong> ${p.categoria}</p>
            <p><strong>Idioma:</strong> ${p.idioma}</p>
            <p><strong>Precio:</strong> ${p.precio}€</p>
            <p><strong>Stock:</strong> ${p.stock}</p>
          </div>
        `).join('');
      };

      const aplicarFiltros = () => {
        let filtrados = [...productosOriginales];
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

      render(productosMostrados);
      filtroNombre?.addEventListener("input", aplicarFiltros);
      filtroCategoria?.addEventListener("change", aplicarFiltros);
      filtroIdioma?.addEventListener("change", aplicarFiltros);
      filtroPrecio?.addEventListener("input", () => {
        precioValor.textContent = filtroPrecio.value;
        aplicarFiltros();
      });
    });
});
