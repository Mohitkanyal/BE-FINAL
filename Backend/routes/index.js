const express = require('express');
const router = express.Router();

// Controller imports
const userRegisterController = require('../controller/userRegister');
const userLoginController = require('../controller/userLogin');
const userDetailsController = require('../controller/userDetails');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/userLogout');
const allUsers = require('../controller/allUsers');
const updateUser = require('../controller/updateUser');
const roleLogin = require('../controller/roleLogin');
const aboutusDetails = require('../controller/aboutusDetails');
const createBlog = require('../controller/createBlog');
const blogDetailsController = require('../controller/blogDetails');
const blogUser = require('../controller/blogUser');
const AllAboutUs = require('../controller/allQueries');
const createTeam = require('../controller/createTeam');
const allTeams = require('../controller/teamDetails');
const updateTeams = require('../controller/updateTeams');
const getTeamDetail = require('../controller/teamDetail');


// Routes
router.post("/Register", userRegisterController);
router.post("/Login", userLoginController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);
router.get("/AllUser", allUsers);
router.post("/UpdateUser", updateUser);
router.post("/rolelogin", roleLogin);
router.post("/aboutusdetail", aboutusDetails);
router.post("/create-blog", createBlog);
router.get("/blogdetails", blogDetailsController);
router.get("/blog-user", blogUser);
router.get("/AllAboutus", AllAboutUs);
router.post("/CreateTeam", createTeam);
router.get("/AllTeams", allTeams);
router.post("/UpdateTeam", updateTeams);
router.post("/TeamDetail", getTeamDetail);

module.exports = router;
