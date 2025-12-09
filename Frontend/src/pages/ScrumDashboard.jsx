import React, { useEffect, useState } from "react";

export default function ScrumDashboard() {
  const [sprints, setSprints] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/get_sprints")
      .then(res => res.json())
      .then(data => setSprints(data.sprints || []));

    fetch("http://localhost:5000/get_reports")
      .then(res => res.json())
      .then(data => setReports(data.reports || []));
  }, []);

  return (
    <div className="p-6 text-white bg-[#121212] min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-blue-400">🌀 Scrum Dashboard</h2>

      <section className="mb-6">
        <h3 className="text-2xl mb-2 text-green-400">Active Sprints</h3>
        {sprints.length > 0 ? (
          <ul className="space-y-2">
            {sprints.map((s, i) => (
              <li key={i} className="p-3 bg-gray-800 rounded-lg">
                <strong>{s.name}</strong> — {s.status} ({s.progress}% complete)
              </li>
            ))}
          </ul>
        ) : (
          <p>No sprints yet.</p>
        )}
      </section>

      <section>
        <h3 className="text-2xl mb-2 text-yellow-400">Reports</h3>
        {reports.length > 0 ? (
          <ul className="space-y-2">
            {reports.map((r, i) => (
              <li key={i} className="p-3 bg-gray-800 rounded-lg">
                <strong>{r.project}</strong>: {r.summary}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reports available.</p>
        )}
      </section>
    </div>
  );
}
