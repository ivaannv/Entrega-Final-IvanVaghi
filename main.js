let products = [];
let total = 0;
let arrayCard = [];
const cardContainer = document.getElementById("modal-container");
const buttomdelate = document.getElementById('eliminar-carrito');
const totalprice = document.getElementById('precio-total');
let modalCounter = document.getElementById('btn-menu');
let buttonCompra = document.getElementById("comprar-btn")
let counter = document.getElementById('counter')

buttonCompra.addEventListener('click', () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Gracias por tu compra!',
        showConfirmButton: false,
        timer: 1500
    })
    arrayCard.length = 0;
    counter.innerText = 0;
    totalprice.innerText = 0;
    renderizarCard()
})





document.addEventListener("DOMContentLoaded", () => {
    boxCreate();
    aJson();
    obtenerObjetos();
    
    const filtroMenorBtn = document.getElementById("filtro-menor");
    filtroMenorBtn.addEventListener("click", () => {
        filtrarPorPrecioMenor();
    });

    
    const filtroMayorBtn = document.getElementById("filtro-mayor");
    filtroMayorBtn.addEventListener("click", () => {
        filtrarPorPrecioMayor();
    });
});

function filtrarPorPrecioMenor() {
    const precioLimite = 8000; // Precio límite para el filtro por precio menor

    const productosFiltrados = products.filter((producto) => {
        return producto.precio <= precioLimite;
    });

    renderizarProductosFiltrados(productosFiltrados);
}

function filtrarPorPrecioMayor() {
    const precioLimite = 7600; // Precio límite para el filtro por precio mayor

    const productosFiltrados = products.filter((producto) => {
        return producto.precio > precioLimite;
    });

    renderizarProductosFiltrados(productosFiltrados);
}

function renderizarProductosFiltrados(productos) {
    const containerProducts = document.getElementById("container-productos");
    containerProducts.innerHTML = ""; // Limpiamos el contenedor antes de renderizar los productos filtrados

    productos.forEach((prod) => {
        const div = document.createElement('div')
        div.classList.add('cajaProductos')
        div.innerHTML = `
      <div class="container-cart-card-card">
       <h5 class="titulo-cart">${prod.nombre}</h5>
       <h4 class="price-cart">$${prod.precio}</h4>
       <a class="cantidad-cart">Cantidad:${prod.cantidad}</a>
      <img src=${prod.img} alt=""/>
      <a class="agregar__carrito" id="button${prod.id}">Agregar al carrito</a>
       </div>
       `;

        containerProducts.appendChild(div)
        const agregar = document.getElementById(`button${prod.id}`);
        agregar.addEventListener("click", () => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tu producto fue agregado correctamente',
                showConfirmButton: false,
                timer: 1500
            })
            pushearCard(`${prod.id}`);
        });
    });
}


function aJson() {
    if (localStorage.getItem('cart')) {
        arrayCard = JSON.parse(localStorage.getItem('cart'))
        renderizarCard()
    }
}



async function obtenerObjetos() {
    const direccion = await fetch("./data.json");
    const response = await direccion.json();
    
    products = response;
    boxCreate();
}



function boxCreate() {
    const containerProducts = document.getElementById("container-productos");
    products.forEach((prod) => {
        const div = document.createElement("div");
        div.classList.add("cajaProductos");
        div.innerHTML = `
        <h4 class='title-product'>${prod.nombre}</h4>
        <img src=${prod.img} alt='camiseta'/>
        <p>Cantidad: ${prod.cantidad}</p>
        <p>Precio: $ ${prod.precio}</p>
        <a class="agregar__carrito" id="button${prod.id}">Agregar al carrito</a>
        `;
        containerProducts.appendChild(div);
        // agregamos funcionalidad al boton
        const agregar = document.getElementById(`button${prod.id}`);
        agregar.addEventListener("click", () => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tu producto fue agregado correctamente',
                showConfirmButton: false,
                timer: 1500
            })
            pushearCard(`${prod.id}`);
        });
    });
}

function pushearCard(id) {
    const producto = products.find((p) => p.id == id);
    if (!producto) {
        return;
    }
    const existe = arrayCard.some((prod) => prod.id == id);
    if (existe) {
        arrayCard.map((prod) => {
            if (prod.id == id) {
                prod.cantidad++;
            }
        });
    } else {
        arrayCard.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(arrayCard))
    renderizarCard();
}

function renderizarCard() {
    cardContainer.innerHTML = "";
    if (arrayCard.length < 1) {
        return;
    }
    arrayCard.forEach(function renderizarProducto(producto) {
        let productoContainer = document.createElement("div");
        productoContainer.id = producto.id;
        productoContainer.innerHTML = `
        <div class="container-cart-card">
         <h5 class="titulo-cart">${producto.nombre}</h5>
         <h4 class="price-cart">$${producto.precio}</h4>
         <a class="cantidad-cart">Cantidad:${producto.cantidad}</a>
        <img src=${producto.img} alt="" class="img-cart"/>
         <a class="agregar_carrito" id="eliminar${producto.id}">Retirar</a>
         </div>
         `;
        cardContainer.appendChild(productoContainer);
        const eliminar = document.getElementById(`eliminar${producto.id}`);
        eliminar.addEventListener("click", (id) => {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Tu producto fue eliminado correctamente',
                showConfirmButton: false,
                timer: 1500
            })
            eliminarDelCard(producto.id);
        });
        counter.innerText = arrayCard.length
        totalprice.innerText = arrayCard.reduce((acc, producto) => acc + producto.cantidad * producto.precio, 0);

    });
}

function eliminarDelCard(id) {
    const existe = arrayCard.some((prod) => prod.id == id);
    if (existe) {
        arrayCard.map((prod) => {
            if (prod.id == id) {
                prod.cantidad--;
                counter.innerText = 0;
                if (prod.cantidad < 1) {
                    arrayCard = arrayCard.filter((prod) => prod.id != id);
                }
            }
        });
    }

    totalprice.textContent = arrayCard.reduce((acc, producto) => acc - producto.precio, 0);
    localStorage.setItem('cart', JSON.stringify(arrayCard));


    renderizarCard();
}

buttomdelate.addEventListener('click', () => {
    alert('se vacio del carrito')
    arrayCard.length = 0;
    counter.innerText = 0;
    totalprice.innerText = arrayCard.reduce((acc, producto) => acc - producto.precio, 0);
    localStorage.setItem('cart', JSON.stringify(arrayCard))
    renderizarCard();
})