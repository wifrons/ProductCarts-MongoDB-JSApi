import fs from "fs";

const fsPromises = fs.promises;

class CartManager {

    constructor(cartFilePath) {
        this.filePath = import.meta.dirname + cartFilePath;
    }

    // Método generico para guardar datos en un archivo
    async saveData(doc) {
        try {
            const docToString = JSON.stringify(doc, null, 2);
            await fsPromises.writeFile(this.filePath, docToString);
        } catch (error) {
            return [];
        }
    }

    // Método generico para leer datos desde un archivo
    async readData() {
        try {
            const json = await fsPromises.readFile(this.filePath, "utf-8");
            const data = JSON.parse(json);
            return data;
        } catch (error) {
            return []
        }
    }

    // Método para obtener todos los productos
    async getCarts() {
        return await this.readData();
    }

    // Método para crear carrito
    async addCart() {

        const carts = await this.readData();

        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1,
            products: []
        }
        carts.push(newCart);
        await this.saveData(carts);
        return newCart;
    }

    // Método para agregar producto en el carrito
    async addProductCart(cid, pid) {
        const carts = await this.readData();
        const index = carts.findIndex((p) => p.id === cid)
        if (index === -1) {
            return [];
        }

        const cart = carts[index];
        const cartProduct = cart.products.find((productid) => productid.product === pid)

        if (cartProduct)
            cartProduct.quantity += 1;
        else
            cart.products.push({ product: pid, quantity: 1 });
        await this.saveData(carts);
        return cart;
    }

    // Método para eliminar carrito
    async delCart(cid) {
        const carts = await this.readData();
        const indexCart = carts.findIndex((pr) => pr.id === parseInt(cid));

        if (indexCart === -1) return { Mensaje: `Id cart: ${cid}, no existe. 🤔` };
        carts.splice(indexCart, 1);

        await this.saveData(carts);
        return { deleted: cid };
    }

}

export default CartManager;