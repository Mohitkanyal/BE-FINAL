// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import SummaryApi from '../common';
// import { toast } from "react-toastify";
// import { formatDate } from '../utils/dateFormator';
// import { FaEdit } from "react-icons/fa";
// import ChangeUserRole from '../components/ChangeUserRole';

// const AllUsers = () => {
//   const [openUpdateRole, setOpenUpdateRole] = useState(false);
//   const [allUsers, setAllUsers] = useState([]);
//   const [updateUserDetails, setUpdateUserDetails] = useState({
//     email: "",
//     name: "",
//     role: "",
//     _id: ""
//   });

//   const fetchAllUsers = async () => {
//     try {
//       const response = await axios({
//         method: SummaryApi.allUser.method,
//         url: SummaryApi.allUser.url,
//         withCredentials: true, // same as credentials: 'include'
//       });

//       const dataResponse = response.data;

//       if (dataResponse.success) {
//         setAllUsers(dataResponse.data);
//       } else if (dataResponse.error) {
//         toast.error(dataResponse.message);
//       }
//     } catch (error) {
//       toast.error("Failed to fetch users");
//       console.error("Error fetching users:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   return (
//     <div className='overflow-x-auto p-4'>
//       <table className='w-full bg-blue-100 border border-gray-300'>
//         <thead>
//           <tr className='border-b-2 border-gray-400'>
//             <th className='text-lg text-purple-700 text-center border-r border-gray-300 p-2'>Sr No.</th>
//             <th className='text-lg text-purple-700 text-center border-r border-gray-300 p-2'>Name</th>
//             <th className='text-lg text-purple-700 text-center border-r border-gray-300 p-2'>Email</th>
//             <th className='text-lg text-purple-700 text-center border-r border-gray-300 p-2'>Role</th>
//             <th className='text-lg text-purple-700 text-center border-r border-gray-300 p-2'>Created Date</th>
//             <th className='text-lg text-purple-700 text-center p-2'>Action</th>
//           </tr>
//         </thead>
//         <tbody className='border-b-2 border-gray-400'>
//           {allUsers.length > 0 &&
//             allUsers.map((el, index) => (
//               <tr key={el._id || index} className='border-b border-gray-300 text-center text-lg hover:bg-gray-100'>
//                 <td className='border-r text-purple-700 border-gray-300 p-4'>{index + 1}</td>
//                 <td className='border-r text-purple-700 border-gray-300 p-4'>{el.name}</td>
//                 <td className='border-r text-purple-700 border-gray-300 p-4'>{el.email}</td>
//                 <td className='border-r text-purple-700 border-gray-300 p-4'>{el.role}</td>
//                 <td className='border-r text-purple-700 border-gray-300 p-4'>{formatDate(el?.createdAt)}</td>
//                 <td className='p-4'>
//                   <div 
//                     className='w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-purple-400'
//                     onClick={() => {
//                       setUpdateUserDetails(el);
//                       setOpenUpdateRole(true);
//                     }}
//                   >
//                     <FaEdit />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//       {openUpdateRole && (
//         <ChangeUserRole 
//           onClose={() => setOpenUpdateRole(false)} 
//           name={updateUserDetails.name} 
//           email={updateUserDetails.email} 
//           role={updateUserDetails.role}
//           userId={updateUserDetails._id}
//           callFunc={fetchAllUsers}
//         />
//       )}
//     </div>
//   );
// };

// export default AllUsers;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryApi from '../common';
import { toast } from "react-toastify";
import { formatDate } from '../utils/dateFormator';
import { FaEdit } from "react-icons/fa";
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    _id: ""
  });

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(SummaryApi.allUser.url, {
        withCredentials: true
      });

      if (response.data.success) {
        setAllUsers(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to load users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full bg-[#1b1b1b] border border-gray-700">
        <thead>
          <tr className="border-b-2 border-gray-700">
            <th className="text-lg text-blue-400 text-center border-r border-gray-700 p-2">Sr No.</th>
            <th className="text-lg text-blue-400 text-center border-r border-gray-700 p-2">Name</th>
            <th className="text-lg text-blue-400 text-center border-r border-gray-700 p-2">Email</th>
            <th className="text-lg text-blue-400 text-center border-r border-gray-700 p-2">Role</th>
            <th className="text-lg text-blue-400 text-center border-r border-gray-700 p-2">Created Date</th>
            <th className="text-lg text-blue-400 text-center p-2">Action</th>
          </tr>
        </thead>
        <tbody className="border-b-2 border-gray-700">
          {allUsers.length > 0 ? (
            allUsers.map((el, index) => (
              <tr
                key={el._id || index}
                className="border-b border-gray-700 text-center text-lg hover:bg-[#2a2a2a]"
              >
                <td className="border-r text-gray-300 border-gray-700 p-4">
                  {index + 1}
                </td>
                <td className="border-r text-gray-300 border-gray-700 p-4">
                  {el.name}
                </td>
                <td className="border-r text-gray-300 border-gray-700 p-4">
                  {el.email}
                </td>
                <td className="border-r text-gray-300 border-gray-700 p-4">
                  {el.role}
                </td>
                <td className="border-r text-gray-300 border-gray-700 p-4">
                  {formatDate(el?.createdAt)}
                </td>
                <td className="p-4">
                  <div
                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-md"
                    onClick={() => {
                      setUpdateUserDetails(el);
                      setOpenUpdateRole(true);
                    }}
                  >
                    <FaEdit /> Edit
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-400 p-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          roleId={updateUserDetails.roleId}
          rolePassword={updateUserDetails.rolePassword}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
