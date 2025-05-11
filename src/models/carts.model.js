import mongoose from "mongoose";

const cartsCollection = "carts";
const cartsSchema = new mongoose.Schema({
    products: { type: Array, required: true }
},
    { versionKey: false });

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;