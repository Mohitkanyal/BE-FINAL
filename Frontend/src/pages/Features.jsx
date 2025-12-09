import React from "react";
import Footer from "../components/Footer";

const features = [
  {
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    title: "Automated Standups",
    description:
      "AI-powered daily standups—collect updates, send reminders & generate instant summaries.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/681/681494.png",
    title: "Smart Analytics",
    description:
      "Track burndown, velocity & trends with predictive insights for better sprint decisions.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/2085/2085269.png",
    title: "Sprint Planning AI",
    description:
      "Balanced sprint plans with story-point suggestions & workload optimization.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
    title: "Retro Summaries",
    description:
      "Aggregate team feedback & auto-generate clear action items for improvement.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/6715/6715979.png",
    title: "Impediment Tracker",
    description:
      "Identify & escalate blockers automatically—no issue slips through the cracks.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135714.png",
    title: "Stakeholder Updates",
    description:
      "Automated reports & dashboards to keep leadership aligned effortlessly.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/3233/3233561.png",
    title: "Backlog Grooming",
    description:
      "Declutter tasks with AI—detect duplicates, suggest priorities & refine stories.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
    title: "Custom Workflows",
    description:
      "Automate routine tasks—reminders, ticket moves & meeting setups with ease.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/1141/1141771.png",
    title: "AI Coaching",
    description:
      "ScrumX coaches Scrum Masters with tips, health-checks & growth insights.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/709/709496.png",
    title: "Collaboration Boost",
    description:
      "Keep teams engaged with auto-synced tasks & transparent communication flows.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135783.png",
    title: "Knowledge Hub",
    description:
      "Auto-generate sprint wikis & documentation—your team’s memory bank.",
  },
  {
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135800.png",
    title: "Global Sync",
    description:
      "Handle distributed teams with timezone-aware scheduling & reminders.",
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gray-900 text-green-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14 mt-10">
          <h1 className="text-5xl font-extrabold text-green-400 tracking-wide drop-shadow-md">
            ScrumX Features
          </h1>
          <p className="text-lg text-green-200 mt-4 max-w-3xl mx-auto">
            Transform the way your team works. ScrumX automates standups,
            sprint planning, retros, and reporting—so you focus on building, not
            busywork. 🚀
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-green-900/20 border border-green-700/30 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 hover:bg-green-900/30 transition transform duration-300"
            >
              <img src={f.img} alt={f.title} className="w-20 h-20 mb-4" />
              <h3 className="text-xl font-bold text-green-300 mb-2">
                {f.title}
              </h3>
              <p className="text-green-200 text-sm">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Workflow Section */}
        <div className="bg-gradient-to-r from-black via-green-950 to-black rounded-3xl shadow-2xl mt-20 py-12 px-8 text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-4">
            Why ScrumX?
          </h2>
          <p className="text-lg text-green-200 max-w-4xl mx-auto leading-relaxed">
            ScrumX is your digital Scrum Master—running standups, tracking
            blockers, generating insights, and keeping stakeholders aligned.
            Teams save hours every sprint while improving transparency,
            collaboration, and delivery speed.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
