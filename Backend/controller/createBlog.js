const uploadCampiagnPermission = require("../helper/permission");
const blogModel = require("../models/blogModel");


async function createBlog(req,res) {
    try{

        const sessioUserId = req.userId

        if(!uploadCampiagnPermission(sessioUserId)){
            throw new Error("Permission Denied, First Login!");
        }

        const { title, story, amount, image, category, creator, location} = req.body;

        
        const campaign = await blogModel.findOne({title});
        if(campaign){
            throw new Error("Title Already Taken, Give Another Title");
        }
        if(!title){
            throw new Error("Please Provide title")
        }
        if(!image){
            throw new Error("Please Provide image")
        }
        if(!creator){
            throw new Error("Please Provide creator")
        }


        const userData = new blogModel(req.body);
        const saveBlog = await userData.save()

        res.status(201).json({
            data: saveBlog,
            success:true,
            error:false,
            message: "Blog Created Successfully!"
        })

    }catch(err){
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = createBlog;