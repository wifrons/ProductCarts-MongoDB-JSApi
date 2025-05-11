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
            return null;
        }
    }

    // Método generico para leer datos desde un archivo
    async readData() {
        try {
            const json = await fsPromises.readFile(this.filePath, "utf-8");
            const data = JSON.parse(json);
            return data;
        } catch (error) {
            return null
        }
    }

    // Método generico para reconstruir los datos en el archivo
    async syncData(doc) {

        await fsPromises.truncate(this.filePath);

        const docToString = JSON.stringify(doc, null, 2);

        await fsPromises.writeFile(this.filePath, docToString);
    }

    // Método para obtener todos los productos
    async getCarts() {
        return await this.readData();
    }

    // Método para crear carrito
    async addCart(cid) {

        /*         const carts = await this.readData();
                const newCart = {
                    id: carts.length ? carts[carts.length - 1].id + 1 : 1,
                    products: []
                } */

        const carts = await this.readData();
        const newCart = {
            _id: cid,
            products: []
        }
        carts.push(newCart);
        await this.saveData(carts);
        return newCart;
    }

    // Método para agregar producto en el carrito
    async addProductCart(cid, pid) {
        const carts = await this.readData();
        console.log(carts);
        console.log(cid)
        console.log(pid)
        const index = carts.findIndex((c) => c._id === cid);
        console.log(index)
        if (index === -1) {
            return null;
        }

        const cart = carts[index];
        console.log(cart);
        const cartProduct = cart.products.find((productid) => productid.pid === pid)
        console.log(cartProduct)
        if (cartProduct)
            cartProduct.quantity += 1;
        else
            cart.products.push({ pid: pid, quantity: 1 });

        await this.saveData(carts);
        return cart;
    }

    // ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO
    async delProductCart(cid) {
        const carts = await this.readData();
        const indexCart = carts.findIndex((pr) => pr._id === cid);

        if (indexCart === -1) return null;

        carts[indexCart].products = [];
        await this.saveData(carts);
        return cid;
    }

    // ELEMINAR EL CARRITO ESPECIFICADO
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