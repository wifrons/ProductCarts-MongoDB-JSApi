import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    products: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"products",
                required: true
            },
            quantity:{
                type: Number,
                default: 1
            }
        }
    ]
},
    { versionKey: false });
    

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;