
import { Router } from "express";
import ProductsModel from "../models/products.model.js";

const router = Router();

router.get("/Home", async (req, res) => {
    const products = await ProductsModel.find().lean();
    res.render("home", { products }); 
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await ProductsModel.find()
    res.render("realTimeProducts", { products }); 
});

export default router;