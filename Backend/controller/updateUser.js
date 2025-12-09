const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

async function updateUser(req, res) {
    try {
        const sessionUser = req.userId; // (Optional: can be used for admin auth)

        const { userId, email, name, role, roleId, rolePassword } = req.body;

        // Build payload dynamically
        const payload = {
            ...(email && { email }),
            ...(name && { name }),
            ...(role && { role }),
            ...(roleId && { roleId })
        };

        if (rolePassword) {
            const salt = await bcrypt.genSalt(10);  
            const hashedPassword = await bcrypt.hash(rolePassword, salt);
            payload.rolePassword = hashedPassword;
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, payload, {
            new: true,
            runValidators: true
        });

        res.json({
            data: updatedUser,
            message: "User Updated Successfully",
            success: true,
            error: false
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = updateUser;
