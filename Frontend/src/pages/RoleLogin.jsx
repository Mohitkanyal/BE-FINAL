import React, { useState } from "react";
import loginimg from "../asset/login3.png"; // updated image
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import SummaryApi from "../common";

const RoleLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ roleId: "", rolePassword: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.roleId || !data.rolePassword) {
      toast.error("Please enter both Role ID and Role Password.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios({
        url: SummaryApi.roleLogin.url,
        method: SummaryApi.roleLogin.method,
        data,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      const dataApi = response.data;

      if (dataApi.success) {
        toast.success(dataApi.message);
        if (user?.role?.toLowerCase() === "developer") {
          navigate("/Developer/Dashboard");
        } else if (user?.role?.toLowerCase() === "scrum_master") {
          navigate("/ScrumMaster/Dashboard");
        } else {
          navigate("/home");
        }
      } else {
        toast.error(dataApi.message);
      }
    } catch (err) {
      console.error("Role login error:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="w-[90%] md:w-[70%] lg:w-[60%] flex bg-[#111] rounded-2xl shadow-2xl overflow-hidden">

        {/* Left Section */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 bg-[#1a1a1a]">
          <h1 className="text-3xl font-bold text-gray-300 mb-6">Welcome Back</h1>
          <img
            src={loginimg}
            alt="login-illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-[#0d0d0d] rounded-r-2xl">
          <h2 className="text-start text-gray-400 text-xl mb-6">
            Login as {user?.role}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="flex items-center border border-gray-700 rounded-full px-4 py-3 bg-black">
              <FaUser className="text-gray-400 text-xl mr-3" />
              <input
                type="text"
                name="roleId"
                value={data.roleId}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white"
                placeholder="Enter your Role ID"
                required
              />
            </div>

            <div className="flex items-center border border-gray-700 rounded-full px-4 py-3 bg-black">
              <FaLock className="text-gray-400 text-xl mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="rolePassword"
                value={data.rolePassword}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-white"
                placeholder="Enter your Role Password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 text-xl ml-3 focus:outline-none"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;
