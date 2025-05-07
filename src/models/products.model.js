import mongoose from "mongoose";

const productsCollection = "products";
const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Number, default: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    thumbnails: { type: Array, required: true }
},
    { versionKey: false });

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;