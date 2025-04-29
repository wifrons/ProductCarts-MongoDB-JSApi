import http from "http";
import express from "express";
import hbs from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.routes.js";
import websockets from "./websockets.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = 8080;
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
