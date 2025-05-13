import { Router } from "express";
import ProductManager from "../managers/product.manager.js";
import ProductsModel from "../models/products.model.js";
import dotenv from "dotenv";
import { PaginationParameters } from "mongoose-paginate-v2";

dotenv.config();
const router = Router();
const productManager = new ProductManager("/data/products.json");

/* const initialProducts = await ProductsModel.find()
await productManager.syncData(initialProducts); */

//Obtener todos los productos
router.get("/api/products/", async (req, res) => {
    /*     try {
            const response = await ProductsModel.find();
            if (response) {
                await productManager.syncData(response);
                res.status(200).json({ status: "success find", response });
            } else {
                res.status(404).json({ status: "failed find", message: "no products found" });
            }
        } catch (error) {
            res.status(400).json({ status: "error find", message: error.description });
            console.error(error.message );
        } */

    try {
        //const { page } = req.query;
        const queries = new PaginationParameters(req).get();
        const response = await ProductsModel.paginate({}, { queries });

        if (response) {
            await productManager.syncData(response);

/*             response.status = "success";
            response.prevLink = "";
            response.nextLink = ""; */

            let prevLink = null;
            let nextLink = null;
            if (response.hasPrevLink) prevLink = `${process.env.PATH_GETPRODUCTS}/?page=${response.prevLink}`;
            if (response.hasNextLink) nextLink = `${process.env.PATH_GETPRODUCTS}/?page=${response.nextLink}`;

            delete response.offset;
            response.prevLink = prevLink;
            response.nextLink = nextLink;

            res.json(response)
        } else {
            res.status(404).json({ status: "failed find", message: "no products found" });
        }
    } catch (error) {
        res.status(400).json({ status: "error find", message: error.description });
        console.error(error.message);
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
        res.status(400).json({ status: "error findOne", message: error.description });
        console.error(error.message);
    }
});
//ingresar un producto
router.post("/api/products/", async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
            return res.status(404).json({ error: `Faltan datos. 🙃` });
        }
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
        res.status(400).json({ status: "error insertOne", message: error.description });
        console.error(error.message);
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
        res.status(400).json({ status: "error updateOne", message: error.description });
    }
});
//ELIMINAR UN PRODUCTO ESPECIFICADO
router.delete("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const response = await ProductsModel.findByIdAndDelete(pid);
        if (response) {
            await productManager.delProduct(pid);
            res.status(200).json({ status: "success findByIdAndDelete", response });
        } else {
            res.status(404).json({ status: "failed findByIdAndDelete", message: "product not found" });
        }
    } catch (error) {
        res.status(400).json({ status: "error findByIdAndDelete", message: error.description });
        console.log(error)
    }
});

export default router;