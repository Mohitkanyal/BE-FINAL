import React, { useEffect, useState } from "react";
import axios from "axios";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

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
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName || !projectName || !completionDate || selectedUsers.length === 0) {
      toast.error("Please fill all fields and select team members");
      return;
    }

    const teamLeaderId = selectedUsers[0]; 

    try {
        const response = await axios({
            url: SummaryApi.createTeam.url,
            method: SummaryApi.createTeam.method,
            data: {
                teamName,
                projectName,
                completionDate,
            members: selectedUsers,
            teamLeader: teamLeaderId,
        },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,           
    });

    const dataResponse = response.data;

        if (dataResponse.success) {
            toast.success("Team created successfully!");
            navigate("/AdminPanel/AllTeams");
        } else {
            toast.error(dataResponse.message || "Failed to create team");
        }
    } catch (err) {
        console.error(err);
        toast.error("Failed to create team");
    }
  };

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Create Team</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-2 rounded-md bg-[#1f1f1f] border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 rounded-md bg-[#1f1f1f] border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1">Completion Date</label>
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="w-full p-2 rounded-md bg-[#1f1f1f] border border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-2">Select Team Members</label>
          <div className="max-h-60 overflow-y-auto border border-gray-600 rounded-md p-2 space-y-1">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 hover:bg-[#2a2a2a] p-1 rounded-md cursor-pointer"
                  onClick={() => handleUserSelect(user._id)}
                >
                  <input type="radio" checked={selectedUsers.includes(user._id)} readOnly />
                  <span>{user.name} ({user.email})</span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No users available</div>
            )}
          </div>
          {selectedUsers.length > 0 && (
            <div className="mt-2 text-gray-300 text-sm">
              <strong>Team Leader:</strong> {users.find(u => u._id === selectedUsers[0])?.name || '-'}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          Create Team
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
