import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";

export default function SprintGeneration() {
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/generate_sprint", {
        project_name: projectName,
        project_description: projectDesc,
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error generating sprint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#1b1b1b] border-b border-gray-700">
          <h2 className="text-2xl font-bold text-blue-400">🌀 Sprint Generator</h2>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto bg-[#1f1f1f] border border-white/10 rounded-2xl shadow-lg p-6">
            <label className="block mb-2 font-medium">Project Name</label>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full p-3 mb-4 rounded-lg bg-[#2a2a2a] text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <label className="block mb-2 font-medium">Project Description</label>
            <textarea
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="Describe the project..."
              className="w-full p-3 h-28 rounded-lg bg-[#2a2a2a] text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Generate Sprint"}
            </button>

            {error && <p className="text-red-400 mt-4">{error}</p>}

            {response && (
              <div className="mt-6 bg-[#2a2a2a] p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-semibold text-blue-300">Sprint Details:</h3>
                <pre className="text-gray-200 mt-3 overflow-auto text-sm max-h-96">
                  {JSON.stringify(response.sprint_details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
