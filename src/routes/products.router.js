import { Router } from "express";
import ProductManager from "../managers/product.manager.js";
import ProductsModel from "../models/products.model.js";
import { PaginationParameters } from "mongoose-paginate-v2";

const router = Router();
const productManager = new ProductManager("/data/products.json");

//OBTENER TODOS LOS PRODUCTOS(Pagination)
router.get("/api/products/", async (req, res) => {
    try {

        const customLabels = {
            totalDocs: 'totalDocs',
            docs: 'payload',
            limit: "limit",
            page: "currentPage",
            nextPage: "nextPage",
            prevPage: "prevPage",
            hasNextPage: "hasNextPage",
            hasPrevPage: "hasPrevPage"
        };

        let [filterQuery, options] = new PaginationParameters(req).get();

        if (!options.page) options.page = parseInt(req.query.page) || 1;
        if (!options.limit) options.limit = parseInt(req.query.limit) || 10;

        const sortOrder = req.query.sort || "price";
        options.sort = { [sortOrder.replace("-", "")]: sortOrder.startsWith("-") ? -1 : 1 };

        const response = await ProductsModel.paginate(filterQuery, { ...options, customLabels, lean: true });

        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl.split("?")[0];
        const params = new URLSearchParams(req.query);
        params.delete("page");

        let prevLink = response.hasPrevPage ? `${baseUrl}?${params.toString()}&page=${response.prevPage}` : null;
        let nextLink = response.hasNextPage ? `${baseUrl}?${params.toString()}&page=${response.nextPage}` : null;

        response.status = "success";
        response.prevLink = prevLink;
        response.nextLink = nextLink;
        res.json(response);

    } catch (error) {
        res.status(400).json({ status: "error find", message: error.message });
        console.error(error.message);
    }
});

//OBTENER UN PRODUCTO ESPECIFICO
router.get("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const response = await ProductsModel.findOne({ _id: pid });
        if (response) {
            res.status(200).json({ status: "success to product get by id", message: response });
        } else {
            res.status(404).json({ status: "failed to product get by id", message: response });
        }
    } catch (error) {
        res.status(500).json({ status: "error to product get by id", message: error.message });
        console.error("error to product get by id", error.message);
    }
});

//INSERTAR UN PRODUCTO ESPECIFICADO
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
            res.status(200).json({ status: "success to product insert", message: response });
        } else {
            res.status(404).json({ status: "failed to product insert", message: response });
        }
    } catch (error) {
        res.status(500).json({ status: "error to product insert", message: error.message });
        console.error("error to product insert", error.message);
    }
});

//ACTUALIZAR UN PRODUCTO ESPECIFICADO
router.put("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const { body } = req;
        const response = await ProductsModel.updateOne({ _id: pid }, {
            $set: { ...body }
        });
        if (response) {
            await productManager.updProduct(pid, { ...body });
            res.status(200).json({ status: "success to product update", message: response });
        } else {
            res.status(404).json({ status: "failed to product update", message: response });
        }

    } catch (error) {
        res.status(500).json({ status: "error to product update", message: error.message });
        console.error("error to product update", error.message);
    }
});

//ELIMINAR UN PRODUCTO ESPECIFICADO
router.delete("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const response = await ProductsModel.findByIdAndDelete(pid);
        if (response) {
            await productManager.delProduct(pid);
            res.status(200).json({ status: "success to product delete", message: response });
        } else {
            res.status(404).json({ status: "failed to product delete", message: response });
        }
    } catch (error) {
        res.status(500).json({ status: "error to product delete", message: error.message });
        console.error("error to product delete", error.message);
    }
});

//CARGAR PRODUCTS DESDE SEED A LA BD
router.put("/api/ProductsSeedToBD", async (req, res) => {
    try {
        const prodSeed = await productManager.getProductsSeed(import.meta.dirname + "/seed/products.seed.json");
        await ProductsModel.deleteMany({});
        const response = await ProductsModel.insertMany(prodSeed);

        if (response) {
            res.status(200).json({ status: "success to products Seed To BD", message: response });
        } else {
            res.status(404).json({ status: "failed to products Seed To BD", message: response });
        }

    } catch (error) {
        res.status(500).json({ status: "error to products Seed To BD", message: error.message });
        console.error("error to products Seed To BD", error.message);
    }
});

//CARGAR PRODUCTS DESDE BD A LA SEMILLA
router.put("/api/ProductsBDToSeed", async (req, res) => {
    try {

        const response = await ProductsModel.find();
        
        if (response) {
            await productManager.syncData(response);
            res.status(200).json({ status: "success find", response });
        } else {
            res.status(404).json({ status: "failed find", message: "no products found" });
        }

    } catch (error) {
        res.status(500).json({ status: "error to products seed", error: error.message });
        console.error("error to products seed", error.message);
    }
});

export default router;