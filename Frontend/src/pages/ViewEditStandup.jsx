// ViewEditStandup.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewEditStandup = () => {
  const [standup, setStandup] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // yyyy-mm-dd format
  const [form, setForm] = useState({
    yesterday_work: "",
    today_plan: "",
    blockers: "",
  });
  const employeeId = 1; // You can replace with dynamic login later

  const fetchStandup = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/fullpipeline/view`, {
        params: { employee_id: employeeId, date },
      });
      if (res.data) {
        setStandup(res.data);
        setForm({
          yesterday_work: res.data.yesterday_work || "",
          today_plan: res.data.today_plan || "",
          blockers: res.data.blockers || "",
        });
      } else {
        setStandup(null);
      }
    } catch (err) {
      console.error("Error fetching standup:", err);
      setStandup(null);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://127.0.0.1:8000/fullpipeline/edit`, {
        employee_id: employeeId,
        date,
        ...form,
      });
      alert("✅ Standup updated successfully!");
      fetchStandup();
    } catch (err) {
      console.error("Error updating standup:", err);
      alert("❌ Failed to update standup");
    }
  };

  useEffect(() => {
    fetchStandup();
  }, [date]);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl max-w-2xl mx-auto mt-10 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🧾 View / Edit Standup</h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4 p-2 rounded text-black"
      />

      {standup ? (
        <div className="space-y-4">
          <textarea
            className="w-full p-3 rounded text-black"
            value={form.yesterday_work}
            onChange={(e) => setForm({ ...form, yesterday_work: e.target.value })}
            placeholder="What did you do yesterday?"
          />
          <textarea
            className="w-full p-3 rounded text-black"
            value={form.today_plan}
            onChange={(e) => setForm({ ...form, today_plan: e.target.value })}
            placeholder="What are you planning today?"
          />
          <textarea
            className="w-full p-3 rounded text-black"
            value={form.blockers}
            onChange={(e) => setForm({ ...form, blockers: e.target.value })}
            placeholder="Any blockers?"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Update Standup
          </button>
        </div>
      ) : (
        <p>No standup found for this date.</p>
      )}
    </div>
  );
};

export default ViewEditStandup;
