import AllQueries from "../components/AllQueries";

const backendDomain = "http://localhost:8080";

const SummaryApi = {
    register :{
        url: `${backendDomain}/api/Register`,
        method : "post"
    },
    login :{
        url: `${backendDomain}/api/Login`,
        method : "post"
    },
    current_user :{
        url: `${backendDomain}/api/user-details`,
        method : "get"
    },
    logout_user :{
        url: `${backendDomain}/api/userLogout`,
        method : "get"
    },
    allUser :{
        url: `${backendDomain}/api/AllUser`,
        method : "get"
    },
    updateUser :{
        url: `${backendDomain}/api/UpdateUser`,
        method : "post"
    },
    roleLogin :{
        url: `${backendDomain}/api/rolelogin`,
        method : "post"
    },
    aboutusDetail :{
        url: `${backendDomain}/api/aboutusdetail`,
        method : "post"
    },
    createBlog :{
        url: `${backendDomain}/api/create-blog`,
        method : "post"
    },
    bloguser :{
        url: `${backendDomain}/api/blog-user`,
        method : "post"
    },
    blogDetails :{
        url: `${backendDomain}/api/blogdetails`,
        method : "get"
    },
    allQueries : {
        url: `${backendDomain}/api/AllAboutus`,
        method : "get"
    },
    createTeam : {
        url: `${backendDomain}/api/CreateTeam`,
        method : "post"
    },
    allTeams : {
        url: `${backendDomain}/api/AllTeams`,
        method : "get"
    },
    updateTeam : {
        url: `${backendDomain}/api/UpdateTeam`,
        method : "post"
    },
    teamdetail : {
        url: `${backendDomain}/api/TeamDetail`,
        method : "post"
    }
}


export default SummaryApi;
