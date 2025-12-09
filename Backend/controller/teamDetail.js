// const teamModel = require("../models/teamModel"); // Your Team schema
// const userModel = require("../models/userModel"); // Optional if you want user details

// async function getTeamDetail(req, res) {
//   try {
//     const { memberId } = req.body; // POST body contains memberId

//     if (!memberId) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Member ID is required",
//       });
//     }

//     // Find the team where this member belongs
//     const team = await teamModel
//       .findOne({ "members._id": memberId }) // Assuming members is an array of objects with _id
//       .populate("teamLeader") // Populate teamLeader details
//       .populate("members");   // Populate all members' details if needed

//     if (!team) {
//       return res.status(404).json({
//         success: false,
//         error: true,
//         message: "No team found for this member",
//       });
//     }

//     res.json({
//       success: true,
//       error: false,
//       data: team,
//       message: "Team data fetched successfully",
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       error: true,
//       message: err.message || "Something went wrong",
//     });
//   }
// }

// module.exports = getTeamDetail;

// controllers/getTeamDetail.js
const teamModel = require("../models/teamModel");
const userModel = require("../models/userModel"); // in case you need extra user info

async function getTeamDetail(req, res) {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Member ID is required",
      });
    }

    // Find the team where this member belongs
    const team = await teamModel
      .findOne({ members: memberId }) // members is array of ObjectIds
      .populate("teamLeader", "name email role") // populate selected fields
      .populate("members", "name email role joinDate"); // populate member info

    if (!team) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No team found for this member",
      });
    }

    res.json({
      success: true,
      error: false,
      data: team,
      message: "Team data fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: true,
      message: err.message || "Something went wrong",
    });
  }
}

module.exports = getTeamDetail;
