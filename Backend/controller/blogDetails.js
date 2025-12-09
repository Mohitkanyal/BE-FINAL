const blogModel = require("../models/blogModel");

const blogDetailsController = async(req,res) => {
    try{
        const blog = await blogModel.find().sort({ createdAt : -1 });

        res.json({
            data: blog,
            error: false,
            success: true,
            message: " Blog details "
        })

    }catch(err){
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = blogDetailsController;