const teamModel = require("../models/teamModel");

// Controller to get all teams
async function allTeams(req, res) {
    try {
        const allTeams = await teamModel.find().populate("members teamLeader", "name email role"); 

        res.json({
            message: "All Teams Details",
            data: allTeams,
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

module.exports = allTeams;
