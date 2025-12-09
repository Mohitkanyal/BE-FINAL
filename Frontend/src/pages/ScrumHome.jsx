
import React, { useState } from "react";
import { Search, Bell, Calendar, CheckCircle } from "lucide-react";
import SideBar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import daily from '../asset/daily.jpg';
import person from '../asset/person.jpg';
import metric from '../asset/metric.jpg';
import discuss from '../asset/discuss.jpg';
import meeting from '../asset/meeting.jpg';

const ScrumHome = () => {
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
        <div>Hi0</div>
        </main>
    </div>
  );
};

export default ScrumHome;