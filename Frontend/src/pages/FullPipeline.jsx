import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Temp"; // ✅ Import Sidebar component

export default function FullPipeline() {
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [insertedData, setInsertedData] = useState(null);
  const navigate = useNavigate();

  // --- Step 1: Run pipeline ---
  const handleSubmit = async () => {
    if (!sentence.trim()) {
      setError("Please enter your standup sentence.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);
    setConfirmed(false);
    setInsertedData(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/fullpipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence,
          employee_id: 1,
          confirm_insert: 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Confirm Insert into DB ---
  const handleConfirmInsert = async (confirm) => {
    if (!confirm) {
      setConfirmed(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/fullpipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence,
          employee_id: 1,
          confirm_insert: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setInsertedData(data);
      setConfirmed(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main content area */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-sky-400 text-transparent bg-clip-text">
              Daily Standup Board
            </h1>
            <p className="text-gray-300 mt-2 text-sm">
              Track, log, and analyze your daily standup updates effortlessly.
            </p>
          </header>

          {/* Chat/Input Section */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-inner">
              <textarea
                rows="4"
                className="w-full bg-transparent border border-gray-600 rounded-xl p-4 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400 resize-none"
                placeholder="Type your daily standup here..."
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-sky-500 hover:opacity-90 hover:scale-[1.02]"
                }`}
              >
                {loading ? "Processing..." : "Submit Standup"}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="text-center bg-red-500/10 text-red-300 border border-red-400/30 py-3 px-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Response Section */}
            {response && !confirmed && (
              <div className="space-y-5">
                <div className="flex flex-col items-start">
                  <div className="bg-indigo-600/20 border border-indigo-500/40 px-5 py-4 rounded-2xl max-w-lg shadow-sm">
                    <p className="text-indigo-300 font-semibold mb-2">
                      Assistant Response
                    </p>
                    <p className="text-gray-100">
                      <span className="font-medium">Intent:</span> {response.intent}
                    </p>

                    {Object.keys(response.entities || {}).length > 0 && (
                      <div className="mt-3 text-sm">
                        <p className="font-medium text-indigo-200">Entities:</p>
                        <ul className="list-disc list-inside text-gray-300">
                          {Object.entries(response.entities).map(([key, val]) => (
                            <li key={key}>
                              <span className="font-semibold text-gray-100">{key}</span>: {val}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-4">
                  {response.intent === "log_update" && (
                    <>
                      <button
                        onClick={() => handleConfirmInsert(true)}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:scale-105 transition"
                      >
                        Save to Database
                      </button>
                      <button
                        onClick={() => handleConfirmInsert(false)}
                        className="bg-gradient-to-r from-rose-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:scale-105 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {response.intent === "query_update" && (
                    <button
                      onClick={() => navigate("/standups")}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow hover:scale-105 transition"
                    >
                      View Logs
                    </button>
                  )}

                  {response.intent === "update_entry" && (
                    <button
                      onClick={() => navigate("/standups")}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-medium shadow hover:scale-105 transition"
                    >
                      Edit Standup
                    </button>
                  )}

                  {response.intent === "unknown" && (
                    <p className="text-gray-400 italic text-center w-full">
                      Couldn’t determine intent. Try rephrasing your message.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Success */}
            {confirmed && insertedData && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-emerald-300 mb-2">
                  Standup Saved Successfully
                </h3>
                <p className="text-gray-100">
                  <strong>Intent:</strong> {insertedData.intent}
                </p>
                <ul className="list-disc list-inside text-gray-300 mt-2">
                  {Object.entries(insertedData.entities).map(([key, val]) => (
                    <li key={key}>
                      <b>{key}</b>: {val}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-gray-200">
                  <strong>ID:</strong> {insertedData.standup_id}
                </p>
                <button
                  onClick={() => navigate("/standups")}
                  className="mt-5 bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 rounded-xl font-medium text-white hover:scale-105 transition"
                >
                  View / Edit Standup
                </button>
              </div>
            )}

            {/* Cancelled */}
            {confirmed && !insertedData && (
              <div className="bg-gray-600/20 border border-gray-500/30 p-5 rounded-2xl text-center">
                <h3 className="text-gray-300 font-medium">Entry not saved.</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
