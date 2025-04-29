import { Router } from "express";

const router = Router();

router.get("/api/carts/", async (req, res) => {
    res.send("estoy en carts");
});

router.get("/api/carts/:pid", async (req, res) => {});

router.post("/api/carts/", async (req, res) => {});

router.put("/api/carts/:pid", async (req, res) => {});

router.delete("/api/carts/:pid", async (req, res) => {});

export default router;