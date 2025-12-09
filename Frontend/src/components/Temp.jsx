import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../store/sidebarSlice";
import { setUserDetails } from "../store/userSlice";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { Menu, X } from "lucide-react";
import {
  FaRobot,
  FaUserTie,
  FaProjectDiagram,
  FaClipboardList,
  FaChartBar,
  FaCogs,
  FaSignOutAlt
} from "react-icons/fa";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const user = useSelector((state) => state?.user?.user);

  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "guest@email.com";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    const res = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      window.location.href = "/";
    } else {
      toast.error(data.message);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#1E1E1E] text-white flex flex-col justify-between px-3 py-6 shadow-lg z-50 transition-all duration-300
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* === Top Section (Profile + Toggle) === */}
      <div>
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
            {userInitials}
          </div>
          {isOpen && (
            <div className="ml-3">
              <p className="font-semibold">{userName}</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 mb-6 rounded-md hover:bg-gray-700 flex items-center justify-center"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* === Navigation Links === */}
        <nav className="flex flex-col space-y-1">
          <NavLink
            to="/DeveloperHome"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            <FaUserTie />
            {isOpen && <span>Employee Dashboard</span>}
          </NavLink>

          <NavLink
            to="/Responses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            <FaRobot />
            {isOpen && <span>Bot Assistant</span>}
          </NavLink>
          <NavLink
            to="/TeamMembers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            <FaRobot />
            {isOpen && <span>Team Members</span>}
          </NavLink>

          {/* <NavLink
            to="/scrummaster"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            <FaClipboardList />
            {isOpen && <span>Scrum Master Dashboard</span>}
          </NavLink> */}

          {/* <NavLink
            to="/sprint"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            <FaCogs />
            {isOpen && <span>Sprint Generation</span>}
          </NavLink> */}

          {/* <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            <FaChartBar />
            {isOpen && <span>Report Generation</span>}
          </NavLink> */}

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            <FaProjectDiagram />
            {isOpen && <span>Project Tracking</span>}
          </NavLink>
        </nav>
      </div>

      {/* === Bottom Section (Logout) === */}
      <div className="border-t border-gray-700 pt-4">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-md text-red-500 hover:bg-red-700 flex items-center gap-2"
        >
          <FaSignOutAlt /> {isOpen && "Log Out"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
