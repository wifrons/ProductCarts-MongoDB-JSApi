import fs from "fs";

const fsPromises = fs.promises;

class ProductManager {

    constructor(productFilePath) {
        this.filePath = import.meta.dirname + productFilePath;
    }

    // Método generico para guardar datos en un archivo
    async saveDate(doc) {
        const docToString = JSON.stringify(doc, null, 2);
        await fsPromises.writeFile(this.filePath, docToString);
    }

    // Método generico para leer datos desde un archivo
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
    async getProducts() {
        return await this.readData();
    }

    // Método para obtener un producto desde id
    async getProductsById(pid) {
        const products = await this.readData();
        const product = products.find((p) => p.id === parseInt(pid));
        if (!product) return [];
        return product;
    }

    // Método para agregar productos
    async addProduct(product) {
        const { title, description, code, price, status, stock, category, thumbnails } = product;

        const products = await this.readData();
        const foundCode = products.find((pr) => pr.code === code);
        if (foundCode) return { addProduct: `Product code: [${code}] already exists.` }

        let id;
        if (!products.length) id = 1;
        else {
            const lastId = products[products.length - 1].id;
            id = lastId + 1;
        }

        const newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
            id,
        };

        products.push(newProduct);
        await this.saveDate(products);
        return newProduct;

    }

    // Método para actualizar producto
    async updProduct(pid, obj) {
        const products = await this.readData();
        const indexProduct = products.findIndex((pr) => pr.id === parseInt(pid));
        if (indexProduct === -1) return { updProduct: `Product ${obj.code} not exist. 🤔` };

        console.log(obj);
        products[indexProduct] = { ...products[indexProduct], ...obj };

        await this.saveDate(products);
        return products[indexProduct];
    }

    // Método para eliminar producto
    async delProduct(pid) {
        const products = await this.readData();
        console.log(pid)
        const indexProduct = products.findIndex((pr) => pr.id === parseInt(pid));
        if (indexProduct === -1) return { delProduct: `Id Product: ${pid}, not exist. 🤔` };

        products.splice(indexProduct, 1);
        await this.saveDate(products);
        return { deleted: pid };
    }

}

export default ProductManager;