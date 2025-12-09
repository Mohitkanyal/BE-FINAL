

import React, { useState } from 'react';
import loginimg from '../asset/login3.png'
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { useDispatch } from 'react-redux';
import { fetchUserDetails } from '../store/userSlice';
import axios from 'axios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validateInputs = () => {
    const errors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(data.email)) {
      toast.error("Please enter a valid email address.");
      errors.email = "Please enter a valid email address.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await axios({
        url: SummaryApi.login.url,
        method: SummaryApi.login.method,
        data,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      const dataApi = response.data;

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate('/Home');
        dispatch(fetchUserDetails());
      } else if (dataApi.error) {
        toast.error(dataApi.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="w-[90%] md:w-[75%] lg:w-[65%] flex bg-[#111] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Section */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 bg-[#1a1a1a]">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Ready to streamline your standups?
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Discover the best ways to collaborate!
          </p>
          <img
            src={loginimg}  // 👉 replace with your image
            alt="login-illustration"
            className="w-72 h-auto"
          />
          <p className="text-gray-500 text-sm mt-6">
            Manage your team’s daily check-ins!
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-[#0d0d0d]">
          <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex items-center border border-gray-700 rounded-full px-4 py-3 bg-black">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Your email"
                className="w-full bg-transparent outline-none text-white"
                required
              />
            </div>

            <div className="flex items-center border border-gray-700 rounded-full px-4 py-3 bg-black">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-transparent outline-none text-white"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 ml-2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-400 my-4">or sign in with</p>
          <div className="flex gap-4 justify-center">
            <button className="w-32 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200">
              Google
            </button>
            <button className="w-32 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200">
              Facebook
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6">
            Don’t have an account?{" "}
            <NavLink to="/register" className="text-green-500 hover:underline">
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;