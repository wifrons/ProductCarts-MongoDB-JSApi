import ProductManager from "./managers/product.manager.js"

const productManager = new ProductManager("/data/products.json");

export default (io) => {
    io.on("connection", async (socket) => {
        console.log("Un nuevo cliente se ha conectado");
        console.log("ID del cliente: ", socket.id);

        // Obtener productos al conectar
        const initialProducts = await productManager.getProducts();
        socket.emit("all-products", initialProducts);

        socket.on("new-product", async (data) => {
            // guardar el nuevo producto
            await productManager.addProduct(data);

            // actualizar todos los clientes
            const updatedProducts = await productManager.getProducts();
            io.emit("all-products", updatedProducts);
        });

        socket.on("del-product", async (data) => {
            // eliminar el producto
            console.log(data);
            await productManager.delProduct(data);

            // actualizar todos los clientes
            const updatedProducts = await productManager.getProducts();
            io.emit("all-products", updatedProducts);
        });
    });
};