const socket = io();

const productForm = document.querySelector("#productForm");
const productsBox = document.querySelector("#products-box");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const code = document.querySelector("#code");

const price = document.querySelector("#price");
const productStatus = document.querySelector("#productStatus");
const stock = document.querySelector("#stock");
const category = document.querySelector("#category");
const thumbnails = document.querySelector("#thumbnails");


socket.on("all-products", (data) => {
    let messages;
    if (data.length) {
        // Crear plantilla Handlebars
        const templateSource = `
        <table border="1">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Código</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Imagenes</th>
                    <th>Accion</th>
                </tr>
            </thead>
            <tbody>
                {{#each products}}
                <tr>
                    <td>{{title}}</td>
                    <td>{{description}}</td>
                    <td>{{code}}</td>
                    <td>{{price}}</td>
                    <td>{{status}}</td>
                    <td>{{stock}}</td>
                    <td>{{category}}</td>
                    <td>{{thumbnails}}</td>
                    <td><button type="button" class="delete-btn" data-id="{{id}}">Eliminar</button></td>
                </tr>
                {{/each}}
            </tbody>
        </table>
        `;

        // Compilar plantilla
        const template = Handlebars.compile(templateSource);

        // Pasar el valor de data como products
        messages = template({ products: data });
    } else {
        messages = "<p>No hay productos disponibles.</p>";
    }

    // Renderizar el resultado
    productsBox.innerHTML = `<div>${messages}</div>`;
});

productsBox.addEventListener("click", (e) => {
    // Verificar si el elemento clicado es un botón con la clase "delete-btn"
    if (e.target && e.target.classList.contains("delete-btn")) {
        // Obtener el ID del producto del atributo data-id
        const productId = e.target.getAttribute("data-id");

        // Lógica para manejar la eliminación
        console.log(`Eliminar producto con ID: ${productId}`);
        socket.emit("del-product", productId); // Enviar el ID al servidor

        Swal.fire({
            position: "center",
            icon: 'success',
            text: `${productId} Eliminado exitosamente!`,
            showConfirmButton: false,
            timer: 1500
        });
    }
});

productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newProduct = {
        title: title.value,
        description: description.value,
        code: code.value,
        price: price.value,
        status: productStatus.value,
        stock: stock.value,
        category: category.value,
        thumbnails: thumbnails.value
    };
    socket.emit("new-product", newProduct);

    Swal.fire({
        position: "center",
        icon: 'success',
        text: `${newProduct.title} agregado exitosamente!`,
        showConfirmButton: false,
        timer: 1500
    });
});

console.log("se conectaron los archivos estaticos con el servidor mediante handlebars")
