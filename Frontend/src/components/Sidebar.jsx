import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import { toggleSidebar } from "../store/sidebarSlice";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import {
  FaClipboardList, FaComments, FaUsers,
  FaBan, FaChartLine, FaTasks,
  FaCog , FaSignOutAlt
} from "react-icons/fa";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.user?.user);
  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "guest@email.com";
  const userRole = user?.role || "developer"; // 👈 role check
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });
    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#1E1E1E] text-white flex flex-col justify-between px-3 py-6 shadow-lg z-50
        ${isOpen ? "w-64" : "w-20"} `}
    >
      {/* Top Section with Profile */}
      <div>
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-bold text-sm">
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
          className="p-2 mb-6 rounded-md hover:bg-gray-700 flex items-center justify-center"
          onClick={() => dispatch(toggleSidebar())}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation based on role */}
        <nav className="flex flex-col space-y-1">
          {userRole === "SCRUM_MASTER" ? (
            <>
              <NavLink
                to="/ScrumMaster/Dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaClipboardList />
                {isOpen && <span>Dashboard</span>}
              </NavLink>

              <NavLink
                to="/Sprint"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaComments />
                {isOpen && <span>Sprint Generation</span>}
              </NavLink>

              {/* <NavLink
                to="/Retrospectives"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaUsers />
                {isOpen && <span>Retrospectives</span>}
              </NavLink> */}

              <NavLink
                to="/ScrumTeams"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaBan />
                {isOpen && <span>Teams Performance</span>}
              </NavLink>

              <NavLink
                to="/Reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaChartLine />
                {isOpen && <span>Reports</span>}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/Developer/Dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaClipboardList />
                {isOpen && <span>Dashboard</span>}
              </NavLink>

              {/* <NavLink
                to="/MyTasks"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaTasks />
                {isOpen && <span>My Tasks</span>}
              </NavLink> */}
              <NavLink
                to="/Reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaChartLine />
                {isOpen && <span>Reports</span>}
              </NavLink>

              <NavLink
                to="/Sprint"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaChartLine />
                {isOpen && <span>Sprints</span>}
              </NavLink>

              <NavLink
                to="/TeamMembers"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
                  }`
                }
              >
                <FaUsers />
                {isOpen && <span>Team Members</span>}
              </NavLink>
            </>
          )}

          {/* Account settings for all */}
          {/* <NavLink
            to="/Preferences"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive ? "bg-gray-800 font-semibold" : "hover:bg-gray-700"
              }`
            }
          >
            <FaCog />
            {isOpen && <span>Account</span>}
          </NavLink> */}
        </nav>
      </div>

      {/* Bottom Section */}
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

export default SideBar;
