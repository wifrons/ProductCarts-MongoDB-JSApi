import ProductManager from "./managers/product.manager.js"
import ProductsModel from "./models/products.model.js";

const productManager = new ProductManager("/data/products.json");

export default (io) => {
    io.on("connection", async (socket) => {
        console.log("Un nuevo cliente se ha conectado, ID del cliente:", socket.id);

        const initialProducts = await ProductsModel.find()

        socket.emit("all-products", initialProducts); 

        socket.on("new-product", async (data) => {
            // guardar el nuevo producto en BD
            const { title, description, code, price, status, stock, category, thumbnails } = data;
            const result = await ProductsModel.insertOne({
                title, 
                description, 
                code, 
                price, 
                status: 1, 
                category, 
                stock, 
                thumbnails});

            // guardar el nuevo producto en archivo
            if (result){
                const insertedProduct = await ProductsModel.findOne({ _id: result._id }).lean();
                if (insertedProduct) await productManager.addProduct(insertedProduct);
            }

            // actualizar todos los clientes
            const updatedProducts = await ProductsModel.find()
            io.emit("all-products", updatedProducts);
        });

        socket.on("del-product", async (data) => {
            // eliminar el producto
            const result = await ProductsModel.deleteOne({ _id: data });

            // eliminar el producto en archivo
            if (result){
                await productManager.delProduct(data);
            }
  
            const updatedProducts = await ProductsModel.find()
            io.emit("all-products", updatedProducts);
        });
    });
};