
import { FaCode, FaProjectDiagram } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase();

  const roleOptions = {
    developer: {
      label: "DEVELOPER",
      icon: <FaCode className="text-green-400 text-4xl mb-3" />,
      path: "/Developer/Login",
    },
    scrum_master: {
      label: "SCRUM MASTER",
      icon: <FaProjectDiagram className="text-green-400 text-4xl mb-3" />,
      path: "/ScrumMaster/Login",
    },
  };

  const selectedRole = roleOptions[role];

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="container w-full px-6 md:px-28 pt-20 flex-grow">
        {/* Heading */}
        <h1 className="text-4xl font-bold pb-8 mt-12 text-green-400 text-center">
          Profile
        </h1>

        {/* User Details */}
        <div className="mb-10 bg-gray-800 shadow-lg rounded-2xl p-8">
          <h1 className="text-2xl font-semibold border-b border-gray-700 pb-3 text-green-300">
            User
          </h1>
          <div className="text-lg pt-4 max-w-4xl text-gray-300">
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-2">
                <span className="font-medium w-40">Email:</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-40">Name:</span>
                <span>{user?.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-40">Role:</span>
                <span className="capitalize">{role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue As Section */}
        {selectedRole && (
          <div className="mb-10 bg-gray-800 shadow-lg rounded-2xl p-8">
            <h1 className="text-2xl font-semibold border-b border-gray-700 pb-4 text-green-300">
              Continue As
            </h1>

            <div className="flex justify-start mt-6">
              <button
                onClick={() => navigate(selectedRole.path)}
                className="flex flex-col items-center bg-gradient-to-tr from-green-900 via-gray-900 to-green-900 shadow-lg hover:shadow-xl p-8 rounded-2xl transition transform hover:scale-105 w-56"
              >
                {selectedRole.icon}
                <span className="text-xl font-semibold text-green-400">
                  {selectedRole.label}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {!selectedRole && (
          <p className="text-red-500 font-medium">
            Role not recognized. Please contact admin.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
