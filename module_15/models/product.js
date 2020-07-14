const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const productSchema = new Schema({
    title: {
        type: String,
        required: true 
    },
    price:{
        type: Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User', // 어떤 model과 relation을 맺을 것인지!
        required:true
    }
});

module.exports = mongoose.model('Product', productSchema);