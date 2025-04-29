import fs from "fs";

const fsPromises = fs.promises;

class CartManager {

    constructor(productFilePath) {

        this.filePath = import.meta.dirname + productFilePath;
        this.currentId = 0;
        console.log("executing productManager -->> constructor");
    }

    async saveDate(doc) {
        const docToString = JSON.stringify(doc, null, 2);
        await fsPromises.writeFile(this.filePath, docToString);
    }

    async readData() {
        try {
            const json = await fsPromises.readFile(this.filePath, "utf-8");
            const data = JSON.parse(json);
            return data;
        } catch (error) {
            console.log("File not exists. Building...")
            return []
        }
    }

    // Método para obtener todos los productos
    async getCarts() {
        return await this.readData()
    }

}

export default CartManager;