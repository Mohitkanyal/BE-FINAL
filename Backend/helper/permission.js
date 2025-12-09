const userModel = require("../models/userModel")

const uploadCampiagnPermission = async(userId) => {
    const user = await userModel.findById(userId)

    if(user){
        return false
    }

    return false
}



module.exports = uploadCampiagnPermission;
