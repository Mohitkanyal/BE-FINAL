import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Simulate burndown data dynamically
const generateBurndown = (sprintId) => {
  const totalPoints = 40 - sprintId * 2; // example: reduce total points per sprint
  return Array.from({ length: 10 }, (_, i) => ({
    day: `Day ${i + 1}`,
    Ideal: Math.max(totalPoints - i * 4, 0),
    Actual: Math.max(totalPoints - i * (3 + Math.floor(Math.random() * 2)), 0),
  }));
};

export default function SprintDetails() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const { sprintId } = useParams();
  const navigate = useNavigate();
  const [burndownData, setBurndownData] = useState([]);

  useEffect(() => {
    setBurndownData(generateBurndown(Number(sprintId)));
  }, [sprintId]);

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SideBar />
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 bg-[#1f1f1f] px-4 py-2 rounded-lg hover:bg-[#2a2a2a] flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold mb-6">Sprint {sprintId} Burndown</h1>

          <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Sprint Burndown Chart</h3>
            {burndownData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={burndownData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid stroke="#2a2a2a" strokeDasharray="5 5" />
                  <XAxis dataKey="day" tick={{ fill: "#cbd5e1" }} />
                  <YAxis tick={{ fill: "#cbd5e1" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", border: "none", color: "#fff" }} />
                  <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                  <Line type="monotone" dataKey="Ideal" stroke="#3b82f6" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="Actual" stroke="#22c55e" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">Loading burndown chart...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
