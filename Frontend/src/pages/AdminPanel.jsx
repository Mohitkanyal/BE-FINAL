import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { MdCampaign, MdMessage } from "react-icons/md";
import { BsMicrosoftTeams } from "react-icons/bs";
import { VscFeedback } from "react-icons/vsc";

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);

    return (
        <div className="flex min-h-screen bg-[#121212]">
            {/* Sidebar */}
            <aside className='bg-[#1b1b1b] w-[400px] min-h-screen pt-5 shadow-md'>
                <div className='m-10 mt-16'>
                    <h1 className='flex justify-center text-blue-400 text-xl font-bold'>{user?.role}</h1>
                    <div className='text-lg text-gray-300 flex mt-2'>Name: {user?.name}</div>
                    <div className='text-lg text-gray-300 flex mt-1'>Email: {user?.email}</div>
                    <div className='mt-6'>
                        <nav className='p-1 gap-2'>
                            <NavLink 
                                to={'AllUsers'} 
                                className={({ isActive }) => isActive 
                                    ? "text-blue-400 bg-[#2a2a2a] p-2 rounded-md flex items-center gap-3" 
                                    : "text-gray-300 text-lg p-2 hover:bg-[#2a2a2a] rounded-md flex items-center gap-3"}>
                                <FaUser size={20} /> Users
                            </NavLink>

                            <NavLink 
                                to={'AllQueries'} 
                                className={({ isActive }) => isActive 
                                    ? "text-blue-400 bg-[#2a2a2a] p-2 rounded-md flex items-center gap-3" 
                                    : "text-gray-300 text-lg p-2 hover:bg-[#2a2a2a] rounded-md flex items-center gap-3"}>
                                <MdMessage size={20}/> Queries (About Us)
                            </NavLink>
                            <NavLink 
                                to={'AllTeams'} 
                                className={({ isActive }) => isActive 
                                    ? "text-blue-400 bg-[#2a2a2a] p-2 rounded-md flex items-center gap-3" 
                                    : "text-gray-300 text-lg p-2 hover:bg-[#2a2a2a] rounded-md flex items-center gap-3"}>
                                <BsMicrosoftTeams size={20}/> Teams
                            </NavLink>
                            {/* 
                            

                            <NavLink 
                                to={'AllJobTrends'} 
                                className={({ isActive }) => isActive 
                                    ? "text-blue-400 bg-[#2a2a2a] p-2 rounded-md flex items-center gap-3" 
                                    : "text-gray-300 text-lg p-2 hover:bg-[#2a2a2a] rounded-md flex items-center gap-3"}>
                                <BsBank2 size={20}/> Job Trends
                            </NavLink>

                            <NavLink 
                                to={'AllFeedbacks'} 
                                className={({ isActive }) => isActive 
                                    ? "text-blue-400 bg-[#2a2a2a] p-2 rounded-md flex items-center gap-3" 
                                    : "text-gray-300 text-lg p-2 hover:bg-[#2a2a2a] rounded-md flex items-center gap-3"}>
                                <VscFeedback size={20}/> Feedbacks
                            </NavLink> 
                            */}
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className='flex-1 min-h-screen p-5 pt-16 bg-[#121212]'>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;
