
import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const ChangeUserRole = ({
    name, email, role, roleId, rolePassword, onClose, userId, callFunc
}) => {
    const [userRole, setUserRole] = useState(role);
    const [userRoleId, setUserRoleId] = useState(roleId || "");
    const [userRolePassword, setUserRolePassword] = useState(rolePassword || "");

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value);
    };

    const updateUserRole = async () => {
        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                role: userRole,
                roleId: userRoleId,
                rolePassword: userRolePassword
            })
        });

        const responseData = await fetchResponse.json();

        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            callFunc();
        }
        if (responseData.error) {
            toast.error(responseData.error);
        }
    };

    return (
        <div className='fixed inset-0 bg-gray-200 bg-opacity-10 backdrop-blur-md flex justify-center items-center z-50'>
            <div className="bg-white p-8 w-96 shadow-lg rounded-lg relative">
                {/* Close button */}
                <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
                    <IoMdClose size={25} />
                </div>

                <p className='text-xl font-semibold text-center mb-4'>Change User Role</p>
                
                <div className='text-lg mb-2'>Name: {name}</div>
                <div className='text-lg mb-4'>Email: {email}</div> 

                {/* Role Selection */}
                <div className="flex justify-between items-center mb-4">
                    <label className='text-lg'>Role:</label> 
                    <select 
                        value={userRole} 
                        onChange={handleOnChangeSelect} 
                        className='border border-gray-300 rounded p-2 w-40'
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="GENERAL">GENERAL</option>
                        <option value="DEVELOPER">DEVELOPER</option>
                        <option value="SCRUM_MASTER">SCRUM_MASTER</option>
                    </select>
                </div>

                {/* Role ID input */}
                <div className="mb-4">
                    <label className='text-lg block mb-1'>Role ID:</label>
                    <input 
                        type="text" 
                        value={userRoleId}
                        onChange={(e) => setUserRoleId(e.target.value)}
                        className='border border-gray-300 rounded p-2 w-full'
                        placeholder="Enter Role ID"
                    />
                </div>

                {/* Role Password input */}
                <div className="mb-4">
                    <label className='text-lg block mb-1'>Role Password:</label>
                    <input 
                        type="password" 
                        value={userRolePassword}
                        onChange={(e) => setUserRolePassword(e.target.value)}
                        className='border border-gray-300 rounded p-2 w-full'
                        placeholder="Enter Role Password"
                    />
                </div>

                {/* Submit button */}
                <button 
                    className='w-full mt-6 bg-purple-500 text-white py-2 rounded-lg text-lg hover:bg-purple-600'
                    onClick={updateUserRole}
                >
                    Change Role
                </button>
            </div>
        </div>
    );
};

export default ChangeUserRole;
