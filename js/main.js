let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = [];
let envios = [];

async function cargarDatos() {

  try {

    const responseProductos = await fetch("./json/productos.json");

    if (!responseProductos.ok) {
      throw new Error("Error al cargar productos");
    }

    productos = await responseProductos.json();


    const responseEnvios = await fetch("./json/envios.json");

    if (!responseEnvios.ok) {
      throw new Error("Error al cargar envíos");
    }

    envios = await responseEnvios.json();

  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar los datos"
    });

  }

}

cargarDatos();

const boton = document.querySelector(".boton");

const botonContinuar = document.querySelector(".botonContinuar");



boton.addEventListener("click", () => {

  const nombre = document.getElementById("nombre").value;
  const mail = document.getElementById("mail").value;

  if (!mail || !nombre) {
    Swal.fire({
      icon: "error",
      title: "Faltan datos",
      text: "Tenés que completar nombre y mail"
    });
    return;
  }

  const chicas = parseInt(document.getElementById("chicas").value) || 0;
  const medianas = parseInt(document.getElementById("medianas").value) || 0;
  const grandes = parseInt(document.getElementById("grandes").value) || 0;

  if (chicas < 0 || medianas < 0 || grandes < 0) {
    Swal.fire({
      icon: "error",
      title: "Cantidad inválida",
      text: "No podés ingresar números negativos"
    });
    return;
  }

  if (chicas === 0 && medianas === 0 && grandes === 0) {
    Swal.fire({
      icon: "error",
      title: "Carrito vacío",
      text: "Tenés que elegir al menos un producto"
    });
    return;
  }

  const zona = parseInt(document.getElementById("opciones").value);

  const precioChica = productos.find(p => p.tipo === "chica")?.precio || 0;
  const precioMediana = productos.find(p => p.tipo === "mediana")?.precio || 0;
  const precioGrande = productos.find(p => p.tipo === "grande")?.precio || 0;

  const envioSeleccionado = envios[zona - 1]?.precio || 0;

  let total =
    chicas * precioChica +
    medianas * precioMediana +
    grandes * precioGrande +
    envioSeleccionado;

  // 📦 crear objeto pedido
  const pedido = {
    nombre,
    mail,
    chicas,
    medianas,
    grandes,
    zona,
    total
  };

  // 🛒 agregar al carrito
  carrito.push(pedido);

  //  guardar en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // 🖥️ mostrar en pantalla
  renderCarrito();

  // ✅ alerta linda
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Producto agregado al carrito",
    showConfirmButton: false,
    timer: 1500
  });
});

botonContinuar.addEventListener("click", () => {

  if (carrito.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Carrito vacío",
      text: "Primero agregá productos"
    });
    return;
  }

  let timerInterval;
  Swal.fire({
    title: "Redirigiendo...",
    html: "Te llevo en <b></b> ms.",
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getPopup().querySelector("b");
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      window.location.href = "checkout.html";
    }
  });

});


function renderCarrito() {
  const historial = document.getElementById("historial");
  historial.innerHTML = "";

  carrito.forEach((item, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p><strong>Nombre:</strong> ${item.nombre}</p>
      <p><strong>Mail:</strong> ${item.mail}</p>
      <p><strong>Chicas:</strong> ${item.chicas}</p>
      <p><strong>Medianas:</strong> ${item.medianas}</p>
      <p><strong>Grandes:</strong> ${item.grandes}</p>
      <p><strong>Total:</strong> $${item.total}</p>

      <button class="eliminar" data-index="${index}">Eliminar</button>
      <hr>
    `;

    historial.appendChild(div);
  });

  // 👉 listeners de eliminar
  document.querySelectorAll(".eliminar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;

      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderCarrito();

      Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        timer: 1000,
        showConfirmButton: false
      });
    });
  });
}


function mostrarResultado(total) {
  let resultado = document.getElementById("resultado");

  if (!resultado) {
    resultado = document.createElement("p");
    resultado.id = "resultado";
    document.querySelector(".entregaMenu").appendChild(resultado);
  }

  resultado.textContent = "Total: $" + total;
}

//checkout
renderCarrito();

#dabcde