const aboutusModel = require("../models/aboutusModel");

async function AllAboutUs(req, res) {
    try {
        const allAboutUs = await aboutusModel.find();

        res.json({
            message: "All About Us Details",
            data: allAboutUs,
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

module.exports = AllAboutUs;
