import { Router } from "express";
import ProductManager from "../managers/product.manager.js";
import ProductsModel from "../models/products.model.js";

const router = Router();
const productManager = new ProductManager("/data/products.json");
//const initialProducts = await ProductsModel.find()
//await productManager.syncData(initialProducts);

//Obtener todos los productos
router.get("/api/products/", async (req, res) => {
    try {
        const response = await ProductsModel.find();
        if (response) {
            await productManager.syncData(response);
            res.status(200).json({ status: "success find", response });
        } else {
            res.status(404).json({ status: "failed find", message: "no products found" });
        }
    } catch (error) {
        res.status(400).json({ status: "error find", error });
    }
});
//Obtener un producto
router.get("/api/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    try {
        const response = await ProductsModel.findOne({ _id: pid });
        if (response) {
            res.status(200).json({ status: "success findOne", response });
        } else {
            res.status(404).json({ status: "failed findOne", message: "product not found" });
        }

    } catch (error) {
        res.status(400).json({ status: "error findOne", error });
    }
});
//ingresar un producto
router.post("/api/products/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(404).json({ error: `Faltan datos. 🙃` });
    }

    /*     const result = await productManager.addProduct(req.body);
        res.json(result); */

    try {
        const response = await ProductsModel.insertOne(
            { title, description, code, price, status, stock, category, thumbnails }
        );
        if (response) {
            await productManager.addProduct(req.body);
            res.status(200).json({ status: "success insertOne", response });
        } else {
            res.status(404).json({ status: "failed insertOne", message: "product not found" });
        }
    } catch (error) {
        res.status(400).json({ status: "error insertOne", error });
    }

});
//Actualizar un producto
router.put("/api/products/:pid", async (req, res) => {

    const pid = req.params.pid;
    const { body } = req;
    try {
        const response = await ProductsModel.updateOne({ _id: pid }, {
            $set: { ...body }
        });
        if (response) {
            await productManager.updProduct(pid, { ...body });
            res.status(200).json({ status: "success updateOne", response });
        } else {
            res.status(404).json({ status: "failed updateOne", message: "product not found" });
        }

    } catch (error) {
        res.status(400).json({ status: "error updateOne", error });
    }
});
//ELIMINAR UN PRODUCTO ESPECIFICADO
router.delete("/api/products/:pid", async (req, res) => {
    /*     const pid = parseInt(req.params.pid);
        const result = await productManager.delProduct(pid);
        res.json(result); */

    const pid = req.params.pid;
    try {
        const response = await ProductsModel.findByIdAndDelete(pid);
        if (response) {
            await productManager.delProduct(pid);
            res.status(200).json({ status: "success findByIdAndDelete", response });
        } else {
            res.status(404).json({ status: "failed findByIdAndDelete", message: "product not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: "error findByIdAndDelete", error });
    }
});

export default router;