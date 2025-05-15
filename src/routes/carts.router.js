import { Router } from "express";
import mongoose from "mongoose";
import CartManager from "../managers/cart.manager.js";
import CartsModel from "../models/carts.model.js";

const router = Router();
const cartManager = new CartManager("/data/carts.json");

// OBTIENE TODOS LOS CARRITOS.
router.get("/api/carts/", async (req, res) => {
    try {
        const response = await CartsModel.find().lean();
        if (response) {
            await cartManager.syncData(response);
            res.status(200).json({ status: "success CartsModel.find", response });
        } else {
            res.status(404).json({ status: "failed CartsModel.find", message: "no carts found" });
        }
    } catch (error) {
        res.status(500).json({ status: "error CartsModel.find", error: error.message });
        console.error(error.message);
    }
});

// OBTIENE EL CARRITO ESPECIFICADO.
router.get("/api/carts/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const response = await CartsModel.findById(cid).populate("products.product").lean();

        if (response) {
            res.status(200).json({ status: "success CartsModel.findOne", message: response });
        } else {
            res.status(404).json({ status: "failed CartsModel.findOne", message: "cart not found" });
        }

    } catch (error) {
        res.status(500).json({ status: "error findOne", error: error.message });
        console.error(error.message);
    }
});

// GENERA UN CARRITO.
router.post("/api/carts/", async (req, res) => {
    try {
        const response = await CartsModel.insertOne({ products: [] });
        if (response) {
            await cartManager.addCart(response._id);
            res.status(200).json({ status: "success CartsModel.insertOne", message: response });
        } else {
            res.status(404).json({ status: "failed CartsModel.insertOne", message: "cart not create" });
        }

    } catch (error) {
        res.status(500).json({ status: "error CartsModel.insertOne", error: error.message });
        console.error(error.message );
    }
});

// REEMPLAZA LA LISTA ACTUAL DE PRODUCTOS, POR UNA NUEVA ENVIADA DESDE EL BODY.
router.post("/api/carts/:cid", async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid);
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ message: "The list is not an array." });
        }

        const updatedCart = await CartsModel.findByIdAndUpdate(
            cid,
            //{ $push: { "products": { $each: products } } }, // Agrega cada producto al array existente
            { $set: { products: products } }, // - reemplaza el contenido del array con el nuevo
            { new: true, runValidators: true } // Devuelve el carrito actualizado
        );

        if (!updatedCart) {
            return res.status(404).json({ message: "cart not found." });
        }

        if (updatedCart) {
            const productListCart = await cartManager.addProductListCart(cid.toString(), products);
            if (!productListCart) return res.status(404).json({ error: "Carrito no se pudo guardar en el archivo." });

            res.status(200).json({ status: "success updateOne", message: "products save in cart." });

        } else {
            res.status(404).json({ status: "failed updateOne", message: "no products found" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error updating cart", error: error.message });
        console.error(error.message );
    }
});

//AGREGA UN PRODUCTO A UN CARRITO EXISTENTE.
router.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        let response;

        const cart = await CartsModel.findOne({ _id: cid, "products.product": pid });

        if (cart) {
            response = await CartsModel.updateOne(
                { _id: cid, "products.product": pid },
                { $inc: { "products.$.quantity": 1 } }
            );
        } else {
            response = await CartsModel.updateOne(
                { _id: cid },
                { $push: { products: { product: { _id: pid, quantity: 1 } } } }
            );
        }

        if (response) {
            const newProductCart = await cartManager.addProductCart(cid.toString(), pid.toString());
            if (!newProductCart) return res.status(404).json({ error: "Carrito no se pudo guardar en el archivo." });

            res.status(200).json({ status: "success updateOne", response });

        } else {
            res.status(404).json({ status: "failed updateOne", message: "no products found" });
        }

    } catch (error) {
        res.status(500).json({ status: "error updateOne", error: error.message  });
        console.error(error.message );
    }
});

//ELIMINA TODOS LOS PRODUCTOS DEL CARRITO ESPECIFICADO
router.delete("/api/carts/:cid", async (req, res) => {
    try {
        const cid = new mongoose.Types.ObjectId(req.params.cid);
        let response = null;
        const cart = await CartsModel.findOne({ _id: cid });
        if (cart) {
            response = await CartsModel.updateOne(
                { _id: cid },
                { $set: { products: [] } } // Elimina el campo `products` por completo
            );
        }

        if (response) {
            const result = await cartManager.delProductCart(cid.toString());
            if (!result) return res.status(404).json({ error: "Los Productos no se pudieron borrar en el archivo." });

            res.status(200).json({ status: "success updateOne", response });

        } else {
            res.status(404).json({ status: "failed updateOne", message: "No se pudo borrar los productos del carrito." });
        }

    } catch (error) {
        res.status(500).json({ status: "error updateOne", error: error.message  });
        console.error(error.message );
    }
});

export default router;