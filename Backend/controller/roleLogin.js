
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

async function roleLogin(req,res) {
    try{
        const { roleId, rolePassword } = req.body;

        if(!roleId){
            throw new Error("Please Provide Role ID")
        }
        if(!rolePassword){
            throw new Error("Please Provide Role Password")
        }

        const user = await userModel.findOne({roleId});
        console.log("User found for role login:", user);
    if(!user){
        throw new Error("User Not Found");
    }
    const checkPassword = rolePassword === user.rolePassword;
    // const checkPassword = await bcrypt.compare(rolePassword,user.rolePassword);
    console.log("Password check result:", user.rolePassword);
    if(checkPassword){
        const tokenData ={
            _id: user._id,
            roleId: user.roleId,
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

        const tokenOption = {
            httpOnly : true,
            secure : true
        }

        res.cookie("token",token,tokenOption).json({
            message: "Login Successfully! ",
            data: token,
            success: true,
            error: false
        })

    }else{
        throw new Error(" Please check password.");
    }


    }catch(err){
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = roleLogin;
