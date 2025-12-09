
import React, { useState } from "react";
import { Search, Bell, Calendar, CheckCircle } from "lucide-react";
import SideBar from "../components/Temp";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import daily from '../asset/daily.jpg';
import person from '../asset/person.jpg';
import metric from '../asset/metric.jpg';
import discuss from '../asset/discuss.jpg';
import meeting from '../asset/meeting.jpg';

const DeveloperHome = () => {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startDay = startOfMonth.getDay();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const events = [
    { date: 3, title: "Retrospective", subtitle: "Sprint 10 Feedback", status: "Scheduled" },
    { date: 10, title: "Action Items Review", subtitle: "Check progress", status: "Pending" },
    { date: 22, title: "Team Feedback Meeting", subtitle: "Discuss improvements", status: "Planned" },
  ];

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <SideBar />

      <main className={`flex-1 flex flex-col ${isOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#1b1b1b] border-b border-gray-700">
          <h1 className="text-2xl font-bold">Retrospectives</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search retrospectives"
                className="pl-8 pr-3 py-2 rounded-md bg-[#2a2a2a] text-sm text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
            <Bell className="cursor-pointer text-gray-300 hover:text-white" />
            <Calendar className="cursor-pointer text-gray-300 hover:text-white" />
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Top Cards + Calendar */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { title: "Daily Standup", subtitle: "Share updates", status: "Session 1/5", img: daily },
                { title: "Retrospective", subtitle: "What went well?", status: "Session 2/5", img: person },
                { title: "Team Metrics", subtitle: "Review progress", status: "Weekly report", img: metric },
                { title: "Feedback Session", subtitle: "Discuss with AI Bot", status: "Scheduled", img: discuss },
              ].map((card, i) => (
                <div key={i} className="bg-[#1f1f1f] rounded-xl p-4 shadow hover:bg-[#2a2a2a]">
                  <img src={card.img} alt={card.title} className="w-full h-24 object-cover rounded-lg mb-3" />
                  <h2 className="font-semibold">{card.title}</h2>
                  <p className="text-sm text-gray-400">{card.subtitle}</p>
                  <div className="mt-2 text-xs text-gray-500">{card.status}</div>
                </div>
              ))}
            </div>

            {/* Calendar Section */}
            <div className="p-6 bg-[#1f1f1f] rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-2 rounded-full hover:bg-[#2a2a2a]"><ChevronLeft size={20} className="text-gray-400" /></button>
                <h2 className="text-lg font-semibold text-white">{monthYear}</h2>
                <button onClick={nextMonth} className="p-2 rounded-full hover:bg-[#2a2a2a]"><ChevronRight size={20} className="text-gray-400" /></button>
              </div>

              <div className="grid grid-cols-7 text-center text-sm mb-2 font-semibold text-gray-400">
                {daysOfWeek.map((day, i) => <div key={i} className="py-1">{day}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-2 text-sm">
                {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const dayNumber = i + 1;
                  const today = new Date();
                  const isToday = today.getDate() === dayNumber && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();
                  const event = events.find(e => e.date === dayNumber);

                  return (
                    <div key={i} className={`p-2 rounded-lg transition cursor-pointer flex flex-col items-start ${isToday ? "bg-blue-600 text-white font-bold shadow-md" : "bg-[#2a2a2a] hover:bg-[#374151] text-gray-300"}`}>
                      <div className="text-xs font-semibold mb-1">{dayNumber}</div>
                      {event && (
                        <div className="bg-[#111111] text-white text-xs rounded-md p-1 w-full shadow-inner">
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-gray-400">{event.subtitle}</div>
                          <div className="text-gray-500 text-[10px]">{event.status}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 bg-[#1b1b1b] border-l border-gray-700 p-6 flex flex-col gap-6 overflow-y-auto">
            {/* Current Retrospective */}
            <div>
              <h3 className="font-semibold mb-3">Current Retrospective</h3>
              <div className="bg-[#2a2a2a] p-4 rounded-lg">
                <img src={meeting} alt="Retrospective" className="w-full h-28 object-cover rounded mb-3" />
                <p className="text-sm font-medium">Sprint 10 Feedback</p>
                <p className="text-xs text-gray-400">Participants: 12/15 · In Progress</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="font-semibold mb-3">Performance</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between bg-[#2a2a2a] p-3 rounded-md">
                  <span>Team Engagement</span>
                  <span className="text-green-400">85%</span>
                </li>
                <li className="flex justify-between bg-[#2a2a2a] p-3 rounded-md">
                  <span>Blockers Identified</span>
                  <span className="text-red-400">3</span>
                </li>
                <li className="flex justify-between bg-[#2a2a2a] p-3 rounded-md">
                  <span>Action Items</span>
                  <span className="text-yellow-400">5</span>
                </li>
              </ul>
            </div>

            {/* Inbox */}
            <div>
              <h3 className="font-semibold mb-3">Inbox</h3>
              <div className="bg-[#2a2a2a] p-4 rounded-lg flex items-start gap-2">
                <CheckCircle className="text-green-400 mt-0.5" size={18} />
                <p className="text-sm">
                  Retrospective summary is ready! <br />
                  <span className="text-xs text-gray-400">For assistance, contact the AI Bot.</span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default DeveloperHome;