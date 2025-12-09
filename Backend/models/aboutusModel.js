const mongoose = require('mongoose');

const aboutusschema = new mongoose.Schema({
    name:String,
    email:String,
    number:String,
    message:String,
    sendedAt: {
        type: Date,
        default: Date.now,
    },
},{
    timestamps: true
})


const aboutusModel = mongoose.model("aboutus",aboutusschema);


module.exports = aboutusModel;