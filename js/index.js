// Elementos del DOM
const contenedorCursos = document.querySelector("#lista-cursos");
const carrito = document.querySelector("#carrito");
const listaCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
let productosCarrito = [];


cargarEventos();
cargarCarritoStorage();


function cargarEventos() {
    contenedorCursos.addEventListener("click", agregarCurso);
    vaciarCarrito.addEventListener("click", vaciarCarritoHandler);
}


function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains("agregar-carrito")) {
        console.log("Añadiendo");
        const curso = e.target.parentElement.parentElement;
        const producto = construirProducto(curso);
        añadirProductoACarrito(producto);
    }
}


function construirProducto(curso) {
    return {
        id: curso.querySelector(".agregar-carrito").getAttribute("data-id"),
        nombre: curso.querySelector("h4").textContent,
        precio: parseFloat(curso.querySelector(".precio span").textContent),
        imagen: curso.querySelector("img").src,
        cantidad: 1
    };
}


function añadirProductoACarrito(producto) {
    const productoExistente = productosCarrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        productosCarrito.push(producto);
    }

    actualizarCarrito();
    guardarCarritoStorage();
}


function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    productosCarrito.forEach(producto => {
        const row = crearFilaProducto(producto);
        listaCarrito.appendChild(row);
    });

    agregarEventosEliminar();
}


function crearFilaProducto(producto) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><img src="${producto.imagen}" width="100"></td>
        <td>${producto.nombre}</td>
        <td>${producto.precio}€</td>
        <td>${producto.cantidad}</td>
        <td><a href="#" class="button borrar-curso" data-id="${producto.id}">X</a></td>
    `;
    return row;
}


function agregarEventosEliminar() {
    const eliminarBtns = document.querySelectorAll(".borrar-curso");
    eliminarBtns.forEach(btn => {
        btn.addEventListener("click", eliminarProducto);
    });
}


function eliminarProducto(e) {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");

    productosCarrito = productosCarrito.filter(producto => producto.id !== id);
    actualizarCarrito();
    guardarCarritoStorage();
}


function vaciarCarritoHandler() {
    productosCarrito = [];
    actualizarCarrito();
    guardarCarritoStorage();
}

// Guarda el carrito en el almacenamiento local
function guardarCarritoStorage() {
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));
}

// Carga el carrito desde el almacenamiento local
function cargarCarritoStorage() {
    const carritoLocal = localStorage.getItem('carrito');
    if (carritoLocal) {
        productosCarrito = JSON.parse(carritoLocal);
        actualizarCarrito();
    }
}