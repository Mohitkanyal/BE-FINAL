import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Users, UserCheck, Calendar, ClipboardCheck, Star } from "lucide-react";
import SideBar from "../components/Temp";
import SummaryApi from "../common";
import { useSelector } from "react-redux";

const TeamMembers = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const user = useSelector((state) => state?.user?.user);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await axios.post(
          SummaryApi.teamdetail.url,
          { memberId: user._id },
          { withCredentials: true }
        );

        if (res.data?.success) {
          setTeamData(res.data.data);
        } else {
          toast.error(res.data?.message || "Failed to fetch team data");
        }
      } catch (err) {
        console.error("Error fetching team:", err);
        toast.error(err.response?.data?.message || "Failed to fetch team data");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchTeamData();
  }, [user]);

  if (loading)
    return <div className="ml-20 p-6 text-white">Loading team details...</div>;
  if (!teamData)
    return <div className="ml-20 p-6 text-white">No team data available.</div>;

  const progress = teamData.project?.progress || 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <SideBar />

      <main
        className={`flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"} p-6`}
      >
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-green-400 flex items-center gap-2 animate-fade-in">
          <Users size={32} /> My Team
        </h1>

        {/* Project Card */}
        <div className="relative backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-6 mb-8 overflow-hidden">
          <div className="absolute -inset-1 bg-white/10 blur-xl animate-pulse opacity-30 rounded-2xl"></div>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4 relative z-10">
            <ClipboardCheck /> Project: {teamData.projectName || "N/A"}
          </h2>

          <p className="flex items-center gap-2 mb-2 relative z-10">
            <Calendar /> Completion Date:{" "}
            {teamData.completionDate
              ? new Date(teamData.completionDate).toLocaleDateString()
              : "N/A"}
          </p>

          <p className="flex items-center gap-2 font-semibold relative z-10">
            <UserCheck /> Team Leader: {teamData.teamLeader?.name || "N/A"}{" "}
            <Star className="text-yellow-400" />
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamData.members?.length > 0 ? (
            teamData.members.map((member) => {
              const isLeader = member._id === teamData.teamLeader?._id;

              return (
                <div
                  key={member._id}
                  className={`relative rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:brightness-125 duration-500 backdrop-blur-md bg-white/10 overflow-hidden`}
                >
                  {/* Glow effect */}
                  {isLeader && (
                    <div className="absolute -inset-1 bg-white/20 opacity-40 animate-pulse blur-xl rounded-2xl"></div>
                  )}

                  {/* Avatar */}
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-4 z-10 border-2 border-white/30`}
                  >
                    {member.name?.charAt(0) || "U"}
                  </div>

                  {/* Info */}
                  <div className="z-10">
                    <h3 className="font-semibold text-xl mb-1">{member.name}</h3>
                    <p className="text-sm mb-1">{member.email}</p>
                    <p className="text-sm mb-1">Role: {member.role || "Developer"}</p>
                    <p className="text-sm mb-1">
                      Joined: {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-300">No members found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeamMembers;
