const teamModel = require("../models/teamModel");

async function updateTeams(req, res) {
  try {
    const { teamId, projectName, teamLeader, members, completionDate } = req.body;

    // Validate required fields
    if (!teamId) {
      return res.json({
        message: "Team ID is required",
        error: true,
        success: false,
      });
    }

    // Build payload dynamically
    const payload = {
      ...(projectName && { projectName }),
      ...(teamLeader && { teamLeader }),
      ...(Array.isArray(members) && { members }),
      ...(completionDate && { completionDate }),
    };

    // Update team
    const updatedTeam = await teamModel.findByIdAndUpdate(teamId, payload, {
      new: true,
      runValidators: true,
    })
    .populate("teamLeader", "name email")
    .populate("members", "name email");

    if (!updatedTeam) {
      return res.json({
        message: "Team not found",
        error: true,
        success: false,
      });
    }

    res.json({
      data: updatedTeam,
      message: "Team updated successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    console.error(err);
    res.json({
      message: err.message || "Error updating team",
      error: true,
      success: false,
    });
  }
}

module.exports = updateTeams;
