// models/teamModel.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    teamLeader: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: false
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    projectName: {
        type: String,
        required: true
    },
    completionDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const teamModel = mongoose.model("teams", teamSchema);


module.exports = teamModel;
