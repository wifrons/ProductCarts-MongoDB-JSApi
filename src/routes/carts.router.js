import { Router } from "express";
import mongoose from "mongoose";
import CartManager from "../managers/cart.manager.js";
import CartsModel from "../models/carts.model.js";

const router = Router();
const cartManager = new CartManager("/data/carts.json");

// OBTIENE TODOS LOS CARITOS
router.get("/api/carts/", async (req, res) => {
    /* const carts = await cartManager.getCarts()
    res.send(carts); */
    try {
        const response = await CartsModel.find().lean();
        if (response) {
            await cartManager.syncData(response);
            res.status(200).json({ status: "success CartsModel.find", response });
        } else {
            res.status(404).json({ status: "failed CartsModel.find", message: "no carts found" });
        }
    } catch (error) {
        res.status(404).json({ status: "error CartsModel.find", error });
    }
});

// OBTIENE EL CARRITO ESPECIFICADO
router.get("/api/carts/:cid", async (req, res) => {
    /*     const cid = parseInt(req.params.cid);
        const carts = await cartManager.getCarts(cid);
        const cart = carts.find((c) => c.id === cid);
        res.json(cart); */

    const cid = req.params.cid;
    try {
        const response = await CartsModel.findOne({ _id: cid });
        if (response) {
            res.status(200).json({ status: "success CartsModel.findOne", response });
        } else {
            res.status(404).json({ status: "failed CartsModel.findOne", message: "cart not found" });
        }

    } catch (error) {
        res.status(400).json({ status: "error findOne", error });
    }

});

// GENERA UN CARRITO
router.put("/api/carts/", async (req, res) => {
    /*     const cart = await cartManager.addCart();
        res.json(cart ? cart : []); */

    try {
        const response = await CartsModel.insertOne({ products: [] });
        if (response) {
            await cartManager.addCart(response._id);
            res.status(200).json({ status: "success CartsModel.Create", response });
        } else {
            res.status(404).json({ status: "failed CartsModel.Create", message: "cart not create" });
        }

    } catch (error) {
        res.status(400).json({ status: "error CartsModel.Create", error });
    }
});

//AGREGA UN PRODUCTO A UN CARRITO EXISTENTE
router.post("/api/carts/:cid/product/:pid", async (req, res) => {
    const cid = new mongoose.Types.ObjectId(req.params.cid);
    const pid = new mongoose.Types.ObjectId(req.params.pid);
    let response;

    try {
        const cart = await CartsModel.findOne({ _id: cid, "products.pid": pid });
        if (cart) {
            response = await CartsModel.updateOne(
                { _id: cid, "products.pid": pid },
                { $inc: { "products.$.quantity": 1 } }
            );
        } else {
            response = await CartsModel.updateOne(
                { _id: cid },
                { $push: { products: { pid: pid, quantity: 1 } } }
            );
        }

        if (response) {
            const newProductCart = await cartManager.addProductCart(cid.toString(), pid.toString());
            if (!newProductCart) return resp.status(404).json({ error: "Carrito no se pudo guardar en el archivo." });

            res.status(200).json({ status: "success updateOne", response });

        } else {
            res.status(404).json({ status: "failed updateOne", message: "no products found" });
        }

    } catch (error) {
        res.status(400).json({ status: "error updateOne", error });
        console.error("Error al actualizar el carrito:", error);
    }
});

//ELIMINA TODOS LOS PRODUCTOS DEL CARRITO ESPECIFICADO
router.delete("/api/carts/:cid", async (req, res) => {
    const cid = new mongoose.Types.ObjectId(req.params.cid);
    let response = null;

    try {
        const cart = await CartsModel.findOne({ _id: cid });
        if (cart) {
            response = await CartsModel.updateOne(
                { _id: cid },
                { $set: { products: [] } } // Elimina el campo `products` por completo
            );
        }

        if (response) {
            const result = await cartManager.delProductCart(cid.toString());
            if (!result) return resp.status(404).json({ error: "Los Productos no se pudieron borrar en el archivo." });

            res.status(200).json({ status: "success updateOne", response });

        } else {
            res.status(404).json({ status: "failed updateOne", message: "No se pudo borrar los productos del carrito." });
        }

    } catch (error) {
        res.status(400).json({ status: "error updateOne", error });
        console.error("Error al borrar los productos del carrito:", error);
    }
});

export default router;