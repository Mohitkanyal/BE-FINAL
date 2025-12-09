// import React, { useState } from 'react';
// import loginimg from "../asset/login.png";
// import { FaUser , FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import { FaPhone } from "react-icons/fa6";
// import SummaryApi from '../common';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const Register = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const navigate = useNavigate();
//     const [data, setData] = useState({
//         name: '',
//         number: '',
//         email: '',
//         password: ''
//     });

//     const [errors, setErrors] = useState({});

//     const validateInputs = () => {
//         const errors = {};
//         if (!/^[A-Za-z\s]{2,}$/.test(data.name)) {
//             toast.error("Name must be at least 2 characters and contain only letters.");
//             errors.password = "Name must be at least 2 characters and contain only letters.";
//         }

        
//         if (!/^[6-9]\d{9}$/.test(data.number)) {
//             toast.error("Phone number must be 10 digits.");
//             errors.password = "Phone number must be 10 digits.";
//         }

        
//         const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         if (!emailPattern.test(data.email)) {
//             toast.error("Please enter a valid email address.");
//             errors.password = "Please enter a valid email address.";
//         }

//         const pass =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
//         if (!pass.test(data.password)) {
//             toast.error("Password must be at least 6 characters, with at least one letter and one number.");
//             errors.password = "Password must be at least 6 characters, with at least one letter and one number.";
//         }

//         setErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setData((prev) => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateInputs()) {
//     return;
//   }

//   try {
//     const response = await axios({
//       url: SummaryApi.register.url,
//       method: SummaryApi.register.method,
//       data,                             
//       headers: {
//         "Content-Type": "application/json",
//       },
//       withCredentials: true,            
//     });

//     const dataApi = response.data;

//     if (dataApi.success) {
//       toast.success(dataApi.message);
//       navigate('/Login');
//     } else if (dataApi.error) {
//       toast.error(dataApi.message);
//     }

//     console.log("data", dataApi);
//   } catch (err) {
//     console.error("Register error:", err);
//     toast.error("Something went wrong. Try again.");
//   }
// };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-[#f3e8ff] to-[#e9d5ff] flex items-center justify-center relative overflow-hidden">
      
//       <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-lg shadow-lg opacity-70 transform rotate-12"></div>
//       <div className="absolute bottom-20 left-10 w-60 h-60 bg-[#e9d5ff] rounded-lg shadow-lg opacity-70 transform -rotate-12"></div>
//       <div className="absolute bottom-20 right-16 w-60 h-60 bg-[#f3e8ff] rounded-lg shadow-lg opacity-80 transform -rotate-6"></div>
//       <div className="absolute top-32 right-32 w-52 h-52 bg-[#e9d5ff] rounded-lg shadow-lg opacity-80 transform rotate-3"></div>

//       <div className="top-12 w-[90%] md:w-[70%] lg:w-[60%] bg-[#C7D2FE] p-8 rounded-lg shadow-2xl relative z-10">
        
//         <h1 className="text-left text-gray-700 text-3xl font-bold mb-6">Welcome To ROC8</h1>
        
//         <div className="flex flex-col md:flex-row items-center gap-12">
          
//           <div className="md:w-1/2">
//             <img className="w-full rounded-lg" src={loginimg} alt="register-img" />
//           </div>
          
//           <div className="md:w-1/2 bg-[#C4B5FD] p-10 rounded-lg">
//             <h2 className="text-start text-gray-500 text-xl mb-6">Please Register to Continue..</h2>
//             <form className="space-y-6" onSubmit={handleSubmit} method='post'>
              
//               <div className="flex items-center border rounded-md p-3 bg-[#faf5ff]">
//                 <FaUser className="text-gray-500 text-xl mr-3" />
//                 <input
//                   type="text"
//                   name='name'
//                   value={data.name}
//                   onChange={handleChange}
//                   className="w-full focus:outline-none bg-[#faf5ff]"
//                   placeholder="Enter your full name"
//                   required
//                 />
//               </div>

//               <div className="flex items-center border rounded-md p-3 bg-[#faf5ff]">
//                 <FaPhone className="text-gray-500 text-xl mr-3" />
//                 <input
//                   type="text"
//                   name='number'
//                   value={data.number}
//                   onChange={handleChange}
//                   className="w-full focus:outline-none bg-[#faf5ff]"
//                   placeholder="Enter your mobile number"
//                   required
//                 />
//               </div>

//               <div className="flex items-center border rounded-md p-3 bg-[#faf5ff]">
//                 <FaEnvelope className="text-gray-500 text-xl mr-3" />
//                 <input
//                   type="email"
//                   name='email'
//                   value={data.email}
//                   onChange={handleChange}
//                   className="w-full focus:outline-none bg-[#faf5ff]"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>

//               <div className="flex items-center border rounded-md p-3 bg-[#faf5ff]">
//                 <FaLock className="text-gray-500 text-xl mr-3" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name='password'
//                   value={data.password}
//                   onChange={handleChange}
//                   className="w-full focus:outline-none bg-[#faf5ff]"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="text-gray-500 text-xl ml-3 focus:outline-none"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition-all"
//               >
//                 Register
//               </button>
//             </form>
//             <p className="text-center text-gray-500 mt-6">
//               Already have an account? <NavLink to="/login" className="text-purple-600 font-medium hover:underline">Login here</NavLink>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from 'react';
import loginimg from '../asset/login1.jpg'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import SummaryApi from '../common';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    number: '',
    email: '',
    password: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateInputs = () => {
    const errors = {};

    if (!/^[A-Za-z\s]{2,}$/.test(data.name)) {
      toast.error("Name must be at least 2 characters and contain only letters.");
      errors.name = "Invalid name";
    }

    if (!/^[6-9]\d{9}$/.test(data.number)) {
      toast.error("Phone number must be 10 digits.");
      errors.number = "Invalid phone";
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(data.email)) {
      toast.error("Please enter a valid email address.");
      errors.email = "Invalid email";
    }

    const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{6,}$/;
    if (!pass.test(data.password)) {
      toast.error("Password must be at least 6 characters, include uppercase, lowercase, number, and special character.");
      errors.password = "Weak password";
    }

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
        url: SummaryApi.register.url,
        method: SummaryApi.register.method,
        data,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const dataApi = response.data;

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate('/Login');
      } else if (dataApi.error) {
        toast.error(dataApi.message);
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="w-[90%] md:w-[75%] lg:w-[65%] flex bg-[#111] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Section */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-10 bg-[#1a1a1a]">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Join ScrumX Today 🚀
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Create your account and start collaborating!
          </p>
          <img
            src={loginimg} // 👉 replace with your image
            alt="register-illustration"
            className="w-72 h-auto"
          />
          <p className="text-gray-500 text-sm mt-6">
            Stay connected with your team.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-[#0d0d0d]">
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="flex items-center border border-gray-700 rounded-full px-4 py-3 bg-black">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-transparent outline-none text-white"
                required
              />
            </div>

            <div className="flex items-center border border-gray-700 rounded-full px-4 py-3 bg-black">
              <FaPhone className="text-gray-400 mr-3" />
              <input
                type="text"
                name="number"
                value={data.number}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full bg-transparent outline-none text-white"
                required
              />
            </div>

            <div className="flex items-center border border-gray-700 rounded-full px-4 py-3 bg-black">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Email Address"
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
              Register
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <NavLink to="/login" className="text-green-500 hover:underline">
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;