import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipboardCheck, UserCheck, Calendar } from "lucide-react";
import SideBar from "../components/Sidebar";
import SummaryApi from "../common";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ScrumTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        const res = await axios.get(SummaryApi.allTeams.url, { withCredentials: true });
        if (res.data?.success) {
          setTeams(res.data.data);
        } else {
          toast.error(res.data?.message || "Failed to fetch teams");
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
        toast.error(err.response?.data?.message || "Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTeams();
  }, []);

  if (loading) return <div className="ml-20 p-6 text-white">Loading teams...</div>;
  if (!teams?.length) return <div className="ml-20 p-6 text-white">No teams available.</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <SideBar />

      <main className={`flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"} p-6`}>
        <h1 className="text-3xl font-bold mb-8 text-green-400 flex items-center gap-2">
          Scrum Dashboard: All Teams
        </h1>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => (
            <div
              key={team._id}
              className="relative bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:brightness-110 overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute -inset-1 bg-white/5 blur-xl rounded-2xl animate-pulse opacity-20"></div>

              <div className="z-10 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                  <ClipboardCheck /> {team.teamName}
                </h2>

                <div className="space-y-2 text-gray-200">
                  <p className="flex items-center gap-2">
                    <ClipboardCheck /> <span className="font-medium">Project:</span> {team.projectName}
                  </p>
                  <p className="flex items-center gap-2">
                    <UserCheck /> <span className="font-medium">Team Leader:</span> {team.teamLeader?.name || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar /> <span className="font-medium">Completion:</span>{" "}
                    {team.completionDate ? new Date(team.completionDate).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Members:</span> {team.members?.length || 0}
                  </p>
                </div>

                <button
      onClick={() => navigate("/Performance")}
      className="mt-4 bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 w-full"
    >
      View Team Performance
    </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ScrumTeams;
