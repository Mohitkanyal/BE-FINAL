import React, { useEffect, useState } from "react";

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/get_employees")
      .then(res => res.json())
      .then(data => setEmployees(data.employees || []));
  }, []);

  return (
    <div className="p-6 text-white bg-[#101820] min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-teal-400">👥 Employee Dashboard</h2>
      {employees.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Completed Tasks</th>
              <th className="p-3">Current Sprint</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={i} className="border-b border-gray-700">
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.role}</td>
                <td className="p-3">{emp.completed_tasks}</td>
                <td className="p-3">{emp.current_sprint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employee data found.</p>
      )}
    </div>
  );
}
