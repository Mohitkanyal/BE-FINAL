
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { NavLink, useNavigate } from 'react-router-dom';
// import SummaryApi from '../common';
// import { toast } from 'react-toastify';
// import { setUserDetails } from '../store/userSlice';
// import logo from '../asset/logo192.png';
// import { FaRegUserCircle } from "react-icons/fa";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const user = useSelector(state => state?.user?.user);
//   const [isHovered, setIsHovered] = useState(false);
//   const [menuVisible, setMenuVisible] = useState(false);

//   const handleLogout = async () => {
//     const fetchData = await fetch(SummaryApi.logout_user.url, {
//       method: SummaryApi.logout_user.method,
//       credentials: 'include'
//     });

//     const data = await fetchData.json();

//     if (data.success) {
//       toast.success(data.message);
//       dispatch(setUserDetails(null));
//       navigate('/');
//     } else {
//       toast.error(data.message);
//     }
//   };

//   const toggleMenu = () => setMenuVisible(prev => !prev);

//   return (
//     <div>
//       <nav className="bg-[#121212] bg-opacity-40 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-md h-[80px]">
//         <div className="mx-auto px-4 sm:px-6 lg:px-8 h-full">
//           <div className="flex items-center justify-between h-full">
//             {/* Logo */}
//             <div className="flex items-center flex-1">
//               <div className="flex items-center space-x-2">
//                 <img src={logo} alt="Logo" className="h-10" />
//                 <span className="text-2xl font-bold text-green-400">SCRUMX</span>
//               </div>
//             </div>

//             {/* Links */}
//             <div className="hidden sm:flex sm:space-x-6 items-center">
//               {["Home", "Aboutus", "Features", "Contact", "Blog"].map((link) => (
//                 <NavLink
//                   key={link}
//                   to={`/${link}`}
//                   className={({ isActive }) =>
//                     isActive
//                       ? "text-green-700 bg-green-200 px-3 py-2 rounded-md text-lg font-medium"
//                       : "text-white hover:bg-green-600 hover:text-green-200 px-3 py-2 rounded-md text-lg font-medium transition"
//                   }
//                 >
//                   {link}
//                 </NavLink>
//               ))}

//               {/* User Dropdown */}
//               {user?.name ? (
//                 <div
//                   className="relative"
//                   onMouseEnter={() => setIsHovered(true)}
//                   onMouseLeave={() => setIsHovered(false)}
//                   onClick={toggleMenu}
//                 >
//                   <div className="flex items-center space-x-1 cursor-pointer text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-lg font-medium">
//                     <span>{user?.name}</span>
//                     <FaRegUserCircle />
//                   </div>

//                   {isHovered && (
//                     <div className="absolute right-0 mt-2 w-40 bg-[#1b1b1b] shadow-lg rounded-md z-50 flex flex-col">
//                       {/* Triangle */}
//                       <div className="absolute -top-2 right-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#1b1b1b]"></div>

//                       <NavLink
//                         to="/Profile"
//                         className="cursor-pointer text-white hover:bg-green-600 px-4 py-2 w-full text-left text-lg rounded-t-md"
//                       >
//                         Profile
//                       </NavLink>

//                       {user?.role === "ADMIN" && (
//                         <NavLink
//                           to="/AdminPanel"
//                           className="cursor-pointer text-white hover:bg-green-600 px-4 py-2 w-full text-left text-lg"
//                         >
//                           Admin Panel
//                         </NavLink>
//                       )}

//                       <div
//                         onClick={handleLogout}
//                         className="cursor-pointer text-white hover:bg-green-600 px-4 py-2 w-full text-left text-lg rounded-b-md"
//                       >
//                         Logout
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <NavLink
//                   to="/Login"
//                   className={({ isActive }) =>
//                     isActive
//                       ? "text-green-700 bg-green-200 px-3 py-2 rounded-md text-lg font-medium"
//                       : "text-white hover:bg-green-600 hover:text-green-200 px-3 py-2 rounded-md text-lg font-medium transition"
//                   }
//                 >
//                   Login
//                 </NavLink>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;



import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import logo from '../asset/logo192.png';
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user?.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate('/');
    } else {
      toast.error(data.message);
    }
  };

  return (
    <nav className="bg-[#121212] bg-opacity-40 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-md h-[80px]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center flex-1">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-10" />
              <span className="text-2xl font-bold text-green-400">SCRUMX</span>
            </div>
          </div>

          {/* Links */}
          <div className="hidden sm:flex sm:space-x-6 items-center">
            {["Home", "Aboutus", "Features", "Contact", "Blog"].map((link) => (
              <NavLink
                key={link}
                to={`/${link}`}
                className={({ isActive }) =>
                  isActive
                    ? "text-green-700 bg-green-200 px-3 py-2 rounded-md text-lg font-medium"
                    : "text-white hover:bg-green-600 hover:text-green-200 px-3 py-2 rounded-md text-lg font-medium transition"
                }
              >
                {link}
              </NavLink>
            ))}

            {/* User Dropdown */}
            {user?.name ? (
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div
                  className="flex items-center space-x-1 cursor-pointer text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-lg font-medium"
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                >
                  <span>{user?.name}</span>
                  <FaRegUserCircle />
                </div>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-44 bg-[#1b1b1b] shadow-lg rounded-md z-50 flex flex-col border border-gray-700"
                    onMouseEnter={() => setIsDropdownOpen(true)} // keep open while hovering dropdown
                    onMouseLeave={() => setIsDropdownOpen(false)} // close only when leaving dropdown
                  >
                    {/* Triangle */}
                    <div className="absolute -top-2 right-3 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-[#1b1b1b]"></div>

                    <NavLink
                      to="/Profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="cursor-pointer text-white hover:bg-green-600 px-4 py-2 w-full text-left text-lg rounded-t-md"
                    >
                      Profile
                    </NavLink>

                    {user?.role === "ADMIN" && (
                      <NavLink
                        to="/AdminPanel"
                        onClick={() => setIsDropdownOpen(false)}
                        className="cursor-pointer text-white hover:bg-green-600 px-4 py-2 w-full text-left text-lg"
                      >
                        Admin Panel
                      </NavLink>
                    )}

                    <div
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="cursor-pointer text-white hover:bg-green-600 px-4 py-2 w-full text-left text-lg rounded-b-md"
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/Login"
                className={({ isActive }) =>
                  isActive
                    ? "text-green-700 bg-green-200 px-3 py-2 rounded-md text-lg font-medium"
                    : "text-white hover:bg-green-600 hover:text-green-200 px-3 py-2 rounded-md text-lg font-medium transition"
                }
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
