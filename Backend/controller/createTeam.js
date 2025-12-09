const uploadTeamPermission = require("../helper/permission"); // optional, if you want to check admin permission
const teamModel = require("../models/teamModel");
const userModel = require("../models/userModel"); // to validate user IDs

async function createTeam(req, res) {
    try {
        const sessionUserId = req.userId; // Logged in admin user

        // Check permission (optional)
        if (!uploadTeamPermission(sessionUserId)) {
            throw new Error("Permission Denied, Only Admins can create team!");
        }

        const { teamName, projectName, completionDate, members, teamLeader } = req.body;

        // Validate required fields
        if (!teamName) throw new Error("Please provide a team name");
        if (!projectName) throw new Error("Please provide a project name");
        if (!completionDate) throw new Error("Please provide completion date");
        if (!members || members.length === 0) throw new Error("Please select at least one team member");
        if (!teamLeader) throw new Error("Team leader must be selected");

        // Validate that teamLeader exists in members array
        if (!members.includes(teamLeader)) {
            throw new Error("Team leader must be included in team members");
        }

        // Optional: Check if all member IDs exist in users collection
        const validUsers = await userModel.find({ _id: { $in: members } });
        if (validUsers.length !== members.length) {
            throw new Error("Some selected users are invalid");
        }

        // Check if team name already exists
        const existingTeam = await teamModel.findOne({ teamName });
        if (existingTeam) {
            throw new Error("Team name already exists, choose another name");
        }

        // Create team
        const newTeam = new teamModel({
            teamName,
            projectName,
            completionDate,
            members,
            teamLeader,
        });

        const savedTeam = await newTeam.save();

        res.status(201).json({
            data: savedTeam,
            success: true,
            error: false,
            message: "Team created successfully!"
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = createTeam;
