import React from "react";
import SideBar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Users, CheckCircle, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const performanceMetrics = [
  { title: "Team Engagement", value: "85%", icon: <Users size={20} className="text-green-400" /> },
  { title: "Blockers Resolved", value: "12/15", icon: <CheckCircle size={20} className="text-red-400" /> },
  { title: "Sprint Velocity", value: "32 Points", icon: <TrendingUp size={20} className="text-yellow-400" /> },
];

const barData = [
  { name: "Sprint 1", Completed: 20, Pending: 5, Overdue: 2 },
  { name: "Sprint 2", Completed: 25, Pending: 3, Overdue: 1 },
  { name: "Sprint 3", Completed: 32, Pending: 2, Overdue: 0 },
  { name: "Sprint 4", Completed: 28, Pending: 4, Overdue: 1 },
];

const pieData = [
  { name: "Completed", value: 60 },
  { name: "Pending", value: 25 },
  { name: "Overdue", value: 15 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function Performance() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SideBar />
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Team Performance</h1>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {performanceMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-[#1f1f1f] p-4 rounded-xl shadow hover:bg-[#2a2a2a] flex items-center gap-4"
              >
                <div>{metric.icon}</div>
                <div>
                  <h2 className="font-semibold text-lg">{metric.title}</h2>
                  <p className="text-gray-400">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-[#1f1f1f] rounded-xl shadow p-6">
              <h3 className="font-semibold mb-4">Sprint Completion</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid stroke="#2a2a2a" />
                  <XAxis dataKey="name" tick={{ fill: "#cbd5e1" }} />
                  <YAxis tick={{ fill: "#cbd5e1" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", border: "none", color: "#fff" }} />
                  <Bar
                    dataKey="Completed"
                    fill="#22c55e"
                    cursor="pointer"
                    onClick={(bar) => {
                      // Extract sprint number from name
                      const sprintId = bar.payload.name.split(" ")[1];
                      navigate(`/sprint/${sprintId}`);
                    }}
                  />
                  <Bar
                    dataKey="Pending"
                    fill="#f59e0b"
                    cursor="pointer"
                    onClick={(bar) => {
                      const sprintId = bar.payload.name.split(" ")[1];
                      navigate(`/sprint/${sprintId}`);
                    }}
                  />
                  <Bar
                    dataKey="Overdue"
                    fill="#ef4444"
                    cursor="pointer"
                    onClick={(bar) => {
                      const sprintId = bar.payload.name.split(" ")[1];
                      navigate(`/sprint/${sprintId}`);
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-[#1f1f1f] rounded-xl shadow p-6">
              <h3 className="font-semibold mb-4">Task Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" wrapperStyle={{ color: "#cbd5e1" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="mt-6 bg-[#1f1f1f] rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Insights</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>✅ Overall team engagement is above 80%.</li>
              <li>⚠️ 3 blockers are unresolved from the last sprint.</li>
              <li>📈 Sprint velocity has improved by 10% compared to previous sprint.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
