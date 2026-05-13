let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedor = document.getElementById("resumenCarrito");
const totalSpan = document.getElementById("totalFinal");

// 🧾 mostrar productos
let totalGeneral = 0;

carrito.forEach(item => {
    const div = document.createElement("div");

    div.innerHTML = `
    <p>${item.nombre} - $${item.total}</p>
  `;

    contenedor.appendChild(div);

    totalGeneral += item.total;
});

totalSpan.textContent = totalGeneral;

// botón pagar
document.querySelector(".botonPagar").addEventListener("click", () => {

    const titular = document.getElementById("titular").value;
    const numero = document.getElementById("numero").value;
    const vencimiento = document.getElementById("vencimiento").value;
    const cvv = document.getElementById("cvv").value;

    if (!titular || !numero || !vencimiento || !cvv) {
        Swal.fire({
            icon: "error",
            title: "Faltan datos",
            text: "Completá todos los campos de pago"
        });
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Pago realizado",
        text: "Gracias por tu compra",
        timer: 2000,
        showConfirmButton: false
    });

    // 🧹 limpiar carrito
    localStorage.removeItem("carrito");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
});

const botonVolver = document.querySelector(".botonVolver");

botonVolver.addEventListener("click", () => {
    Swal.fire({
        title: "¿Volver al inicio?",
        text: "Perderás el progreso del pago",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, volver",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "index.html";
        }
    });
});

