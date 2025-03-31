document.addEventListener("DOMContentLoaded", function () {
  const listaProductos = document.getElementById("listaProductos");
  const listaCarrito = document.getElementById("listaCarrito");
  const totalCarrito = document.getElementById("totalCarrito");
  const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
  const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

  let carrito = [];

  // Datos de productos (simulados)
  const productos = [
    { id: 1, nombre: "Harina", precio: 1500, imagen: "./imagenes/harina.jpg" },
    { id: 2, nombre: "Bebida", precio: 2000, imagen: "./imagenes/coca.png" },
    { id: 3, nombre: "Arvejas", precio: 900, imagen: "./imagenes/arvejas.png" },
    { id: 4, nombre: "Fideos", precio: 2300, imagen: "./imagenes/fideos.png" },
    { id: 5, nombre: "Arroz", precio: 1200, imagen: "./imagenes/arroz.png" },
    {
      id: 6,
      nombre: "Comida para perro",
      precio: 14000,
      imagen: "./imagenes/comida-perros.png",
    },
    {
      id: 7,
      nombre: "Comida para gato",
      precio: 16000,
      imagen: "./imagenes/comida-gato.png",
    },
    {
      id: 8,
      nombre: "Espirales",
      precio: 2600,
      imagen: "./imagenes/espirales.png",
    },
    {
      id: 9,
      nombre: "Pan Rallado",
      precio: 2350,
      imagen: "./imagenes/pan-rallado.png",
    },
    {
      id: 10,
      nombre: "Galletitas",
      precio: 1600,
      imagen: "./imagenes/pepas.png",
    },
  ];

  function mostrarProductos() {
    productos.forEach((producto) => {
      const divProducto = document.createElement("div");
      divProducto.classList.add("producto");
      divProducto.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
                <button data-id="${
                  producto.id
                }" class="agregar-carrito">Agregar al Carrito</button>
            `;
      listaProductos.appendChild(divProducto);
    });
  }

  function agregarAlCarrito(id) {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      const productoEnCarrito = carrito.find((p) => p.id === id);
      if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }
      actualizarCarrito();
      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: `${producto.nombre} ha sido agregado al carrito.`,
        confirmButtonText: "Aceptar",
      });
    }
  }

  function eliminarDelCarrito(id) {
    carrito = carrito.filter((producto) => producto.id !== id);
    actualizarCarrito();
  }

  function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    Swal.fire({
      icon: "success",
      title: "Carrito vaciado",
      text: "Todos los productos han sido eliminados del carrito.",
      confirmButtonText: "Aceptar",
    });
  }

  function finalizarCompra() {
    if (carrito.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "No hay productos en el carrito para finalizar la compra.",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Compra finalizada",
      text: "¡Gracias por tu compra!",
      confirmButtonText: "Aceptar",
    }).then(() => {
      vaciarCarrito();
    });
  }

  function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((producto) => {
      const li = document.createElement("li");
      li.innerHTML = `
                ${producto.nombre} - $${producto.precio.toFixed(2)}
                <div>
                    <button data-id="${
                      producto.id
                    }" class="disminuir">-</button>
                    <span>${producto.cantidad}</span>
                    <button data-id="${producto.id}" class="aumentar">+</button>
                    <button data-id="${
                      producto.id
                    }" class="eliminar-producto">Eliminar</button>
                </div>
            `;
      listaCarrito.appendChild(li);
      total += producto.precio * producto.cantidad;
    });

    totalCarrito.textContent = total.toFixed(2);

    document.querySelectorAll(".aumentar").forEach((boton) => {
      boton.addEventListener("click", function () {
        const id = parseInt(this.getAttribute("data-id"));
        const producto = carrito.find((p) => p.id === id);
        if (producto) {
          producto.cantidad += 1;
          actualizarCarrito();
        }
      });
    });

    document.querySelectorAll(".disminuir").forEach((boton) => {
      boton.addEventListener("click", function () {
        const id = parseInt(this.getAttribute("data-id"));
        const producto = carrito.find((p) => p.id === id);
        if (producto && producto.cantidad > 1) {
          producto.cantidad -= 1;
        } else {
          eliminarDelCarrito(id);
        }
        actualizarCarrito();
      });
    });

    document.querySelectorAll(".eliminar-producto").forEach((boton) => {
      boton.addEventListener("click", function () {
        const id = parseInt(this.getAttribute("data-id"));
        eliminarDelCarrito(id);
      });
    });
  }

  listaProductos.addEventListener("click", function (e) {
    if (e.target.classList.contains("agregar-carrito")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      agregarAlCarrito(id);
    }
  });

  btnVaciarCarrito.addEventListener("click", vaciarCarrito);
  btnFinalizarCompra.addEventListener("click", finalizarCompra);

  mostrarProductos();
});
