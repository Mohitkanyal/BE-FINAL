// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
// import { NavLink } from 'react-router-dom';
// import SummaryApi from '../common';

// const AllTeams = () => {
//   const [teams, setTeams] = useState([]);
//   const [expandedTeam, setExpandedTeam] = useState(null);

//   const fetchAllTeams = async () => {
//     try {
//       const response = await axios.get(SummaryApi.allTeams.url, { withCredentials: true });
//       if (response.data.success) {
//         setTeams(response.data.data);
//       } else {
//         toast.error(response.data.message || 'Failed to load teams');
//       }
//     } catch (error) {
//       toast.error('Failed to fetch teams');
//       console.error('Error fetching teams:', error);
//     }
//   };

//   useEffect(() => {
//     fetchAllTeams();
//   }, []);

//   return (
//     <div className="overflow-x-auto p-4">
//       <table className="w-full border-collapse border border-gray-300 bg-[#1f1f1f] text-white">
//         <thead>
//           <tr className="text-lg text-center border-b-2 border-gray-600">
//             <th className="p-2 border-r border-gray-600">Sr No.</th>
//             <th className="p-2 border-r border-gray-600">Team Name</th>
//             <th className="p-2 border-r border-gray-600">Project</th>
//             <th className="p-2 border-r border-gray-600">Completion Date</th>
//             <th className="p-2 border-r border-gray-600">Details</th>
//             <th className="p-2">Edit</th>
//           </tr>
//         </thead>
//         <tbody className="text-center border-b-2 border-gray-600">
//           {teams.length > 0 ? (
//             teams.map((team, index) => {
//               const isExpanded = expandedTeam === team._id;
//               return (
//                 <React.Fragment key={team._id || index}>
//                   {/* Main Row */}
//                   <tr
//                     className="border-b border-gray-600 text-lg hover:bg-[#2a2a2a] cursor-pointer"
//                     onClick={() => setExpandedTeam(isExpanded ? null : team._id)}
//                   >
//                     <td className="border-r border-gray-600 p-4">{index + 1}</td>
//                     <td className="border-r border-gray-600 p-4">{team.teamName}</td>
//                     <td className="border-r border-gray-600 p-4">{team.projectName}</td>
//                     <td className="border-r border-gray-600 p-4">{new Date(team.completionDate).toLocaleDateString()}</td>
//                     <td className="border-r border-gray-600 p-4">
//                       {isExpanded ? <FaChevronUp className="mx-auto" /> : <FaChevronDown className="mx-auto" />}
//                     </td>
//                     <td className="p-4">
//                       <button className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-md">
//                         <FaEdit /> Edit
//                       </button>
//                     </td>
//                   </tr>

//                   {/* Expanded Members */}
//                   {isExpanded && (
//                     <tr className="bg-[#2a2a2a]">
//                       <td colSpan="6" className="p-4 text-left text-gray-300">
//                         <div className="mb-2">
//                           <strong>Team Leader:</strong> {team.teamLeader?.name || '-'} ({team.teamLeader?.email || '-'})
//                         </div>
//                         <div>
//                           <strong>Members:</strong>
//                           <table className="w-full mt-2 border border-gray-500 text-white">
//                             <thead>
//                               <tr className="bg-gray-700 text-left">
//                                 <th className="p-2 border-r border-gray-500">Name</th>
//                                 <th className="p-2 border-r border-gray-500">Email</th>
//                                 <th className="p-2 border-r border-gray-500">Role</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {team.members?.map((m, i) => (
//                                 <tr key={m._id || i} className="hover:bg-gray-600 text-gray-200">
//                                   <td className="p-2 border-r border-gray-500">{m.name}</td>
//                                   <td className="p-2 border-r border-gray-500">{m.email}</td>
//                                   <td className="p-2 border-r border-gray-500">{m.role}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="6" className="text-center p-4 text-gray-300">
//                 No teams found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Create Team Button */}
//       <div className="flex justify-end mt-4">
//         <NavLink
//           to={'/AdminPanel/AllTeams/CreateTeam'}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
//         >
//           Create Team
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default AllTeams;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import SummaryApi from '../common';
import EditTeam from './EditTeam'; // ⬅️ Import the modal

const AllTeams = () => {
  const [teams, setTeams] = useState([]);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchAllTeams = async () => {
    try {
      const response = await axios.get(SummaryApi.allTeams.url, { withCredentials: true });
      if (response.data.success) {
        setTeams(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to load teams');
      }
    } catch (error) {
      toast.error('Failed to fetch teams');
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    fetchAllTeams();
  }, []);

  // Handle Edit Button Click
  const handleEditClick = (team) => {
    setSelectedTeam(team);
    setShowEdit(true);
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full border-collapse border border-gray-300 bg-[#1f1f1f] text-white">
        <thead>
          <tr className="text-lg text-center border-b-2 border-gray-600">
            <th className="p-2 border-r border-gray-600">Sr No.</th>
            <th className="p-2 border-r border-gray-600">Team Name</th>
            <th className="p-2 border-r border-gray-600">Project</th>
            <th className="p-2 border-r border-gray-600">Completion Date</th>
            <th className="p-2 border-r border-gray-600">Details</th>
            <th className="p-2">Edit</th>
          </tr>
        </thead>
        <tbody className="text-center border-b-2 border-gray-600">
          {teams.length > 0 ? (
            teams.map((team, index) => {
              const isExpanded = expandedTeam === team._id;
              return (
                <React.Fragment key={team._id || index}>
                  {/* Main Row */}
                  <tr
                    className="border-b border-gray-600 text-lg hover:bg-[#2a2a2a] cursor-pointer"
                    onClick={() => setExpandedTeam(isExpanded ? null : team._id)}
                  >
                    <td className="border-r border-gray-600 p-4">{index + 1}</td>
                    <td className="border-r border-gray-600 p-4">{team.teamName}</td>
                    <td className="border-r border-gray-600 p-4">{team.projectName}</td>
                    <td className="border-r border-gray-600 p-4">{new Date(team.completionDate).toLocaleDateString()}</td>
                    <td className="border-r border-gray-600 p-4">
                      {isExpanded ? <FaChevronUp className="mx-auto" /> : <FaChevronDown className="mx-auto" />}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row toggle
                          handleEditClick(team);
                        }}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        <FaEdit /> Edit
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Members */}
                  {isExpanded && (
                    <tr className="bg-[#2a2a2a]">
                      <td colSpan="6" className="p-4 text-left text-gray-300">
                        <div className="mb-2">
                          <strong>Team Leader:</strong>{' '}
                          {team.teamLeader?.name || '-'} ({team.teamLeader?.email || '-'})
                        </div>
                        <div>
                          <strong>Members:</strong>
                          <table className="w-full mt-2 border border-gray-500 text-white">
                            <thead>
                              <tr className="bg-gray-700 text-left">
                                <th className="p-2 border-r border-gray-500">Name</th>
                                <th className="p-2 border-r border-gray-500">Email</th>
                                <th className="p-2 border-r border-gray-500">Role</th>
                              </tr>
                            </thead>
                            <tbody>
                              {team.members?.map((m, i) => (
                                <tr key={m._id || i} className="hover:bg-gray-600 text-gray-200">
                                  <td className="p-2 border-r border-gray-500">{m.name}</td>
                                  <td className="p-2 border-r border-gray-500">{m.email}</td>
                                  <td className="p-2 border-r border-gray-500">{m.role}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-300">
                No teams found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Create Team Button */}
      <div className="flex justify-end mt-4">
        <NavLink
          to={'/AdminPanel/AllTeams/CreateTeam'}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          Create Team
        </NavLink>
      </div>

      {/* Edit Modal */}
      {showEdit && selectedTeam && (
        <EditTeam
          teamId={selectedTeam._id}
          teamName={selectedTeam.teamName}
          projectName={selectedTeam.projectName}
          completionDate={selectedTeam.completionDate}
          members={selectedTeam.members.map((m) => m._id)}
          teamLeader={selectedTeam.teamLeader?._id}
          onClose={() => setShowEdit(false)}
          callFunc={fetchAllTeams}
        />
      )}
    </div>
  );
};

export default AllTeams;
