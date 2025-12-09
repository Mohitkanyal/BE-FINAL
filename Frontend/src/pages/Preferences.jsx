import React, { useState } from "react";
import { Upload, Edit3, Eye, Star, Sidebar } from "lucide-react";
import { useSelector } from "react-redux";
import SideBar from "../components/Sidebar";
export default function AccountPreferences() {
  const [profilePic, setProfilePic] = useState("/default-avatar.png");
  const [profile, setProfile] = useState({
    displayName: "Alex Jones",
    username: "@Alex.Jones",
    workEmail: "alex.jones@company.com",
    contact: "+91 9876543210",
    birthDate: "1992-04-15",
    country: "India",
    languages: "English, Hindi",
    office: "Mumbai Office",
    emergency: "John Jones - +91 9876543000",
    dietary: "Vegetarian",
    specialNeeds: "None",
  });

  const [uploadedDocs] = useState([
    "Sprint Report",
    "Retrospective Notes",
    "Project Charter",
    "Team Guidelines",
  ]);

  const [idDocs, setIdDocs] = useState([
    { name: "Employee ID", file: "employee_id.pdf" },
    { name: "Company Passport", file: "company_passport.pdf" },
    { name: "Residence Proof", file: "residence_proof.pdf" },
  ]);

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleDocReplace = (index, file) => {
    const updated = [...idDocs];
    updated[index].file = file.name;
    setIdDocs(updated);
  };

  const handleDocUpload = (file) => {
    setIdDocs([...idDocs, { name: "New Document", file: file.name }]);
  };
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-950 min-h-screen text-white">
      {/* Left - Profile Details */} <SideBar />
      <div className={`transition-all duration-300 p-6 ${isOpen ? "ml-64" : "ml-20"}`}>
        <div className="flex flex-col items-center space-y-3">
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
          />
          <label className="cursor-pointer text-sm text-blue-400 hover:underline flex items-center gap-2">
            <Upload size={16} />
            Update Picture
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePicChange}
            />
          </label>
          <p className="text-lg font-semibold">{profile.username}</p>
        </div>

        <div className="space-y-4">
          {Object.keys(profile).map((key) => (
            <div key={key}>
              <p className="capitalize text-gray-400 text-xs">{key}</p>
              <input
                className="mt-1 w-full bg-gray-800 border-none rounded-xl text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={profile[key]}
                onChange={(e) => handleProfileChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2 font-medium">
          Upgrade Plan
        </button>
      </div>

      {/* Right - Documents */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Uploaded Documents */}
        <div className="bg-gray-900 shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
          <div className="space-y-3">
            {uploadedDocs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-xl"
              >
                <span>{doc}</span>
                <button
                  onClick={() => alert(`Viewing ${doc}`)}
                  className="flex items-center gap-1 text-blue-400 border border-blue-400 px-3 py-1 rounded-lg hover:bg-blue-600 hover:text-white"
                >
                  <Eye size={16} /> View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Identification Documents */}
        <div className="bg-gray-900 shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Identification Documents
          </h2>
          <div className="space-y-3">
            {idDocs.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-xl"
              >
                <span>
                  {doc.name} ({doc.file})
                </span>
                <label className="flex items-center gap-1 text-yellow-400 border border-yellow-400 px-3 py-1 rounded-lg hover:bg-yellow-500 hover:text-white cursor-pointer">
                  <Edit3 size={16} /> Edit
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleDocReplace(idx, e.target.files[0])}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 rounded-xl px-4 py-2 cursor-pointer">
              <Star size={16} /> Upload Document
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleDocUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
