import { Router } from "express";
import ProductManager from "../managers/product.manager.js";

const router = Router();
const productManager = new ProductManager("/data/products.json");

router.get("/api/products/", async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get("/api/products/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductsById(pid);
    res.json(product);
});

router.post("/api/products/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(404).json({ error: `Faltan datos. 🙃` });
    }

    const result = await productManager.addProduct(req.body);
    res.json(result);
});

router.put("/api/products/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(404).json({ error: `Faltan datos. 🙃` });
    }

    const result = await productManager.updProduct(pid, { title, description, code, price, status, stock, category, thumbnails });
    res.json(result);
});

router.delete("/api/products/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const result = await productManager.delProduct(pid);
    res.json(result);
});

export default router;