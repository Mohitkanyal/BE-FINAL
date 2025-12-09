const userModel = require("../models/userModel");

async function blogUser(req,res) {
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: " User details "
        })

    }catch(err){
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = blogUser