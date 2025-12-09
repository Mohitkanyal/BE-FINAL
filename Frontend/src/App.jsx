import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Temp";1
import FullPipeline from "./pages/FullPipeline";
import ViewEditStandup from "./pages/ViewEditStandup";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ScrumDashboard from "./pages/ScrumDashboard";
import SprintGeneration from "./pages/SprintGenerator";
import ReportGeneration from "./pages/ReportGenerator";
import ProjectTracking from "./pages/ProjectTracking";
import logo from './logo.svg';
import './App.css';
import Context from "./context";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUserDetails } from './store/userSlice';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AllUsers from './components/AllUsers';
import AdminPanel from './pages/AdminPanel';
import RoleLogin from './pages/RoleLogin';
import ScrumHome from './pages/ScrumHome';
import DeveloperHome from './pages/DeveloperHome';
import Contact from './pages/Contact';
import AboutUs from './pages/Aboutus';
import Features from './pages/Features';
import Blog from './pages/Blog';
import Retrospectives from './pages/Retrospectives';
import TeamChat from './pages/TeamChat';
import AccountPreferences from './pages/Preferences';
import Responses from './pages/Responses';
import Performance from './pages/Performance';
import AllQueries from './components/AllQueries';
import AllTeams from './components/AllTeams';
import CreateTeam from './pages/CreateTeam';
import TeamMembers from './components/TeamMembers';
import ScrumTeams from './components/ScrumTeams';
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);

  useEffect(() => {
    dispatch(fetchUserDetails()); 
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <Home  />
        </>
      ),
    },
    {
      path: '/Home',
      element: (
        <>
          <Navbar />
          <Home  />
        </>
      ),
    },
    {
      path: '/Login',
      element: (
        <>
          <Navbar />
          <Login  />
        </>
      ),
    },
    {
      path: '/Register',
      element: (
        <>
          <Navbar />
          <Register  />
        </>
      ),
    },
    {
      path: '/Profile',
      element: (
        <>
          <Navbar />
          <Profile />
        </>
      ),
    },
    {
      path: '/Contact',
      element: (
        <>
          <Navbar />
          <Contact />
        </>
      ),
    },
    {
      path: '/Aboutus',
      element: (
        <>
          <Navbar />
          <AboutUs />
        </>
      ),
    },
    {
      path: '/Features',
      element: (
        <>
          <Navbar />
          <Features />
        </>
      ),
    },
    {
      path: '/Blog',
      element: (
        <>
          <Navbar />
          <Blog />
        </>
      ),
    },
    {
      path: '/Developer/Login',
      element: (
        <>
          <Navbar />
          <RoleLogin />
        </>
      ),
    },
    {
      path: '/ScrumMaster/Login',
      element: (
        <>
          <Navbar />
          <RoleLogin />
        </>
      ),
    },
    {
      path: '/Developer/Dashboard',
      element: (
        <>
          <DeveloperHome />
        </>
      ),
    },
    {
      path: '/ScrumMaster/Dashboard',
      element: (
        <>
          <ScrumHome />
        </>
      ),
    },
    {
      path: '/TeamMembers',
      element: (
        <>
          <TeamMembers />
        </>
      ),
    },
    {
      path: '/ScrumDashboard',
      element: (
        <>
          <ScrumDashboard />
        </>
      ),
    },
    {
      path: '/DeveloperHome',
      element: (
        <>
          <DeveloperHome />
        </>
      ),
    },
    {
      path: '/standups',
      element: (
        <>
          <ViewEditStandup />
        </>
      ),
    },
    {
      path: '/ScrumHome',
      element: (
        <>
          <ScrumHome />
        </>
      ),
    },
    {
      path: '/ScrumTeams',
      element: (
        <>
          <ScrumTeams />
        </>
      ),
    },
    {
      path: '/Sprint',
      element: (
        <>
          <SprintGeneration />
        </>
      ),
    },
    {
      path: '/projects',
      element: (
        <>
          <ProjectTracking />
        </>
      ),
    },
    {
      path: '/Reports',
      element: (
        <>
          <ReportGeneration />
        </>
      ),
    },
    {
      path: '/Retrospectives',
      element: (
        <>  
          <Retrospectives />
        </>
      ),
    },
    {
      path: '/Performance',
      element: (
        <>  
          <Performance />
        </>
      ),
    },
    {
      path: '/Preferences',
      element: (
        <>  
          <AccountPreferences />
        </>
      ),
    },
    {
      path: '/Responses',
      element: (
        <>  
          <FullPipeline />
        </>
      ),
    },
    {
      path:"/AdminPanel",
      element: user?.role === "ADMIN" ? ( 
        <>
          <Navbar />
          <AdminPanel />
        </>
      ) : (
        <>
          <Navbar />
          <Login /> 
        </>
      ),
      children:[
        {
          path:"AllUsers",
          element:<AllUsers/>
        },
        {
          path:"AllTeams",
          element:<AllTeams/>
        },
        {
          path:"AllQueries",
          element:<AllQueries/>
        },
        {
          path:"AllTeams/CreateTeam",
          element:<CreateTeam/>
        },
        // {
        //   path:"AllFeedbacks",
        //   element:<AllFeedbacks/>
        // }
      ]
    }
  ]);

  return (
    <>
      <Context.Provider value={{fetchUserDetails}}>
        <RouterProvider router={router} />
        <ToastContainer />
      </Context.Provider>
    </>
  );
}


export default App;
// const App = () => {
//   return (
//     <Router>
//       <div className="flex min-h-screen bg-slate-950 text-white">
//         <Sidebar />
//         <div className="flex-1 overflow-y-auto">
//           <Routes>
//             <Route path="/employee" element={<EmployeeDashboard />} />
//             <Route path="/bot" element={<FullPipeline />} />
//             <Route path="/standups" element={<ViewEditStandup />} />
//             <Route path="/scrummaster" element={<ScrumMasterDashboard />} />
//             <Route path="/sprint" element={<SprintGeneration />} />
//             <Route path="/reports" element={<ReportGeneration />} />
//             <Route path="/projects" element={<ProjectTracking />} />
//             <Route path="*" element={<EmployeeDashboard />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };
