document.addEventListener("DOMContentLoaded", async function () {
  const listaProductos = document.getElementById("listaProductos");
  const listaCarrito = document.getElementById("listaCarrito");
  const totalCarrito = document.getElementById("totalCarrito");
  const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
  const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
    
  
  

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let productos = [];

  async function cargarProductos() {
    try {
      const respuesta = await fetch("productos.json");
      productos = await respuesta.json();
      mostrarProductos();
    } catch (error) {
      console.error("Error cargando los productos: ", error);
    }
  }

  function mostrarProductos() {
    listaProductos.innerHTML = "";
    productos.forEach((producto) => {
      const divProducto = document.createElement("div");
      divProducto.classList.add("producto");
      divProducto.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p class="precio">$${producto.precio.toFixed(2)}</p>
        <button data-id="${producto.id}" class="agregar-carrito">Agregar al Carrito</button>
      `;
      listaProductos.appendChild(divProducto);
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
          <button data-id="${producto.id}" class="disminuir">-</button>
          <span>${producto.cantidad}</span>
          <button data-id="${producto.id}" class="aumentar">+</button>
          <button data-id="${producto.id}" class="eliminar">Eliminar</button>
        </div>
      `;
      listaCarrito.appendChild(li);
      total += producto.precio * producto.cantidad;
    });

    totalCarrito.textContent = total.toFixed(2);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  listaProductos.addEventListener("click", function (e) {
    if (e.target.classList.contains("agregar-carrito")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      const producto = productos.find((p) => p.id === id);
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
  });

  listaCarrito.addEventListener("click", function (e) {
    const id = parseInt(e.target.getAttribute("data-id"));
    const producto = carrito.find((p) => p.id === id);

    if (e.target.classList.contains("aumentar")) {
      producto.cantidad += 1;
    } else if (e.target.classList.contains("disminuir")) {
      if (producto.cantidad > 1) {
        producto.cantidad -= 1;
      } else {
        carrito = carrito.filter((p) => p.id !== id);
      }
    } else if (e.target.classList.contains("eliminar")) {
      carrito = carrito.filter((p) => p.id !== id);
    }

    actualizarCarrito();
  });

  btnVaciarCarrito.addEventListener("click", function () {
    Swal.fire({
      title: "¿Seguro que quiere vaciar el carrito?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        actualizarCarrito();
        Swal.fire({
          icon: "success",
          title: "Carrito vaciado",
          text: "Todos los productos han sido eliminados del carrito.",
          confirmButtonText: "Aceptar",
        });
      }
    });
  });
  

  btnFinalizarCompra.addEventListener("click", function () {
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
      carrito = [];
      actualizarCarrito();
    });
  });

  async function obtenerClima() {
    const apiKey = "b552266d03694be0fed1b145703e2004"; // Acá va la API Key
    const ciudad = "Buenos Aires";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`;
  
    try {
      const respuesta = await fetch(url);
      if (!respuesta.ok) throw new Error("No se pudo obtener el clima");
      
      const datos = await respuesta.json();
      const temperatura = datos.main.temp;
      const descripcion = datos.weather[0].description;
      const icono = `https://openweathermap.org/img/wn/${datos.weather[0].icon}.png`;
  
      // Mostrar los datos en la página
      document.getElementById("clima").innerHTML = `
        <p>Clima en ${ciudad}: ${descripcion}, ${temperatura}°C</p>
        <img src="${icono}" alt="${descripcion}">
      `;
    } catch (error) {
      console.error("Error obteniendo el clima:", error);
      document.getElementById("clima").textContent = "No se pudo obtener el clima.";
    }
  }
  
  
  obtenerClima();
  cargarProductos();
  actualizarCarrito();
});
