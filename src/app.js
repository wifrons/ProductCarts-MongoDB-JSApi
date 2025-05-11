import http from "http";
import express from "express";
import hbs from "express-handlebars";
import { Server } from "socket.io";

import viewsRouter from "./routes/views.routes.js";
import websockets from "./websockets.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

//VARIABLES DE ENTORNO
import dotenv from "dotenv";
import mongoose from "mongoose";
import { error } from "console";
dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
console.log(MONGO_URI);

const httpServer = http.createServer(app);
const io = new Server(httpServer);
websockets(io);

app.engine("handlebars", hbs.engine());
app.set("views", import.meta.dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(import.meta.dirname + "/public"));
app.use("/", viewsRouter);

app.use("/", productsRouter);
app.use("/", cartsRouter);

httpServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));

mongoose.connect(MONGO_URI, { dbName: "icoremar", })
    .then(() => console.log("DB Connected successfully"))
    .catch((error) => console.log(`DB connection error: \n ${error}`));
