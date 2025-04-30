import { Router } from "express";
import CartManager from "../managers/cart.manager.js";
import ProductManager from "../managers/product.manager.js";

const router = Router();
const cartManager = new CartManager("/data/carts.json");
const productManager = new ProductManager("/data/products.json");

router.get("/api/carts/", async (req, res) => {
    const carts = await cartManager.getCarts()
    res.send(carts);
});

router.get("/api/carts/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const carts = await cartManager.getCarts(pid);
    const cart = carts.find((c) => c.id === pid);
    res.json(cart);
});

router.put("/api/carts/", async (req, res) => {
    const cart = await cartManager.addCart();
    res.json(cart ? cart : []);
});

router.post("/api/carts/:cid/product/:pid", async (req, resp) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const product = await productManager.getProductsById(pid);
    if (!product) return resp.status(404).json({ error: "Producto no existe." })

    const newProductCart = await cartManager.addProductCart(cid, pid);
    if (!newProductCart) return resp.status(404).json({ error: "Carrito no encontrado" });

    resp.json({ message: "Se agrego el producto al carrito", cart: newProductCart });
});

router.delete("/api/carts/:cid", async (req, res) => { 
    const cid = parseInt(req.params.cid);
    const result = await cartManager.delCart(cid);
    res.json(result);
});

export default router;