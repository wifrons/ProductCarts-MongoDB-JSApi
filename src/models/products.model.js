import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { 
        type: Number, 
        default: true 
    },

    stock: { 
        type: Number, required: true 
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: { 
        type: Array, 
        required: true 
    }
},
    { versionKey: false });

mongoosePaginate.paginate.options = {
    customLabels: {
        docs: "payload",
        page: "currentPage",
        limit: false,
        pagingCounter: false,
        totalDocs: false
    }

};

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;