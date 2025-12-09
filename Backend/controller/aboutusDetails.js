const uploadCampiagnPermission = require("../helper/permission");
const aboutusModel = require("../models/aboutusModel")


async function aboutusDetails(req,res) {
    try{

        const sessioUserId = req.userId
        
        const { name, email, number, message} = req.body;

        if(!name){
            throw new Error("Please Provide name")
        }
        if(!email){
            throw new Error("Please Provide email")
        }
        if(!number){
            throw new Error("Please Provide number")
        }
        if(!message){
            throw new Error("Please Provide message")
        }

        const aboutusData = new aboutusModel(req.body);
        const saveAboutus = await aboutusData.save()

        res.status(201).json({
            data: saveAboutus,
            success:true,
            error:false,
            message: "Message Sended To Admin"
        })

    }catch(err){
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = aboutusDetails;