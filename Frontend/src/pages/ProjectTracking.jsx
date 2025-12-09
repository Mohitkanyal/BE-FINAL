import React, { useEffect, useState } from "react";

export default function ProjectTracking() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/get_projects")
      .then(res => res.json())
      .then(data => setProjects(data.projects || []));
  }, []);

  return (
    <div className="p-6 bg-[#0b0b0b] text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-purple-400">📊 Project Tracking</h2>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <div key={i} className="p-4 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p>Status: <span className="text-green-400">{p.status}</span></p>
              <p>Deadline: {p.deadline}</p>
              <p>Progress: {p.progress}%</p>
              <p>Team: {p.team.join(", ")}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}
