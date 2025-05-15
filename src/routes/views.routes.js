import { Router } from "express";
import ProductsModel from "../models/products.model.js";

import dotenv from "dotenv";
import { PaginationParameters } from "mongoose-paginate-v2";

dotenv.config();
const router = Router();

router.get("/icoremar", async (req, res) => {
    const products = await ProductsModel.find().lean();
    res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await ProductsModel.find().lean();
    res.render("realTimeProducts", { products });
});

router.get("/Home", async (req, res) => {

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

        res.render("home", { response });

    } catch (error) {
        res.status(400).json({ status: "error find", message: error.message });
        console.error(error.message);
    }
});

export default router;