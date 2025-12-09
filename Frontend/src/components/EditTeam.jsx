import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import SummaryApi from "../common";

const EditTeam = ({
  teamId,
  teamName,
  projectName,
  completionDate,
  members,
  teamLeader,
  onClose,
  callFunc,
}) => {
  const [updatedProjectName, setUpdatedProjectName] = useState(projectName);
  const [updatedTeamLeader, setUpdatedTeamLeader] = useState(teamLeader);
  const [updatedMembers, setUpdatedMembers] = useState(members || []);
  const [updatedCompletionDate, setUpdatedCompletionDate] = useState(
    completionDate ? completionDate.split("T")[0] : ""
  );
  const [users, setUsers] = useState([]);

  // Fetch all users for selection
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(SummaryApi.allUser.url, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to load users");
      }
    } catch (error) {
      toast.error("Error fetching users");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Handle team member selection
  const handleMemberToggle = (userId) => {
    if (updatedMembers.includes(userId)) {
      setUpdatedMembers(updatedMembers.filter((id) => id !== userId));
    } else {
      setUpdatedMembers([...updatedMembers, userId]);
    }
  };

  // Handle form submission
  const handleUpdateTeam = async () => {
    if (!updatedProjectName || !updatedCompletionDate || updatedMembers.length === 0) {
      toast.error("Please fill all fields and select at least one member");
      return;
    }

    try {
      const response = await axios({
        url: SummaryApi.updateTeam.url,
        method: SummaryApi.updateTeam.method,
        data: {
          teamId,
          projectName: updatedProjectName,
          teamLeader: updatedTeamLeader,
          members: updatedMembers,
          completionDate: updatedCompletionDate,
        },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const data = response.data;

      if (data.success) {
        toast.success("Team updated successfully!");
        onClose();
        callFunc(); // Refresh parent list
      } else {
        toast.error(data.message || "Failed to update team");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating team");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-10 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-8 w-[450px] shadow-lg rounded-lg relative">
        {/* Close button */}
        <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
          <IoMdClose size={25} />
        </div>

        <h2 className="text-xl font-semibold text-center mb-4">Edit Team</h2>

        <p className="text-lg mb-2">
          <strong>Team Name:</strong> {teamName}
        </p>

        {/* Editable Completion Date */}
        <div className="mb-4">
          <label className="block mb-1 text-lg">Completion Date</label>
          <input
            type="date"
            value={updatedCompletionDate}
            onChange={(e) => setUpdatedCompletionDate(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Project Name */}
        <div className="mb-4">
          <label className="block mb-1 text-lg">Project Name</label>
          <input
            type="text"
            value={updatedProjectName}
            onChange={(e) => setUpdatedProjectName(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Enter project name"
          />
        </div>

        {/* Select Team Leader */}
        <div className="mb-4">
          <label className="block mb-1 text-lg">Team Leader</label>
          <select
            value={updatedTeamLeader}
            onChange={(e) => setUpdatedTeamLeader(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="">-- Select Team Leader --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Select Team Members */}
        <div className="mb-4">
          <label className="block mb-2 text-lg">Team Members</label>
          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-1">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-md cursor-pointer"
                onClick={() => handleMemberToggle(user._id)}
              >
                <input
                  type="checkbox"
                  checked={updatedMembers.includes(user._id)}
                  readOnly
                />
                <span>
                  {user.name} ({user.email})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleUpdateTeam}
          className="w-full mt-6 bg-purple-500 text-white py-2 rounded-lg text-lg hover:bg-purple-600"
        >
          Update Team
        </button>
      </div>
    </div>
  );
};

export default EditTeam;
