import React from "react";
import Footer from "../components/Footer";

const Aboutus = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-grow px-6 py-12">
        {/* Header Section */}
        <header className="text-center mb-16 mt-10">
          <h1 className="text-4xl font-bold text-green-400 mb-4">About ScrumX</h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            ScrumX is a task automation and project management platform that
            empowers teams to collaborate better, track progress effectively, and
            achieve goals faster with transparency.
          </p>
        </header>

        {/* Vision Section */}
        <section className="flex flex-col md:flex-row items-center gap-10 mb-20 max-w-6xl mx-auto">
          {/* Image */}
          <div className="flex-1">
            <img
              src="https://img.freepik.com/free-vector/vision-concept-illustration_114360-2581.jpg"
              alt="Our Vision"
              className="rounded-2xl shadow-lg"
            />
          </div>
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-semibold text-green-400 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-300 text-lg">
              To revolutionize project management by offering an AI-powered Scrum
              assistant that simplifies tasks, boosts productivity, and ensures
              collaboration at every step of a project.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="flex flex-col md:flex-row-reverse items-center gap-10 mb-20 max-w-6xl mx-auto">
          {/* Image */}
          <div className="flex-1">
            <img
              src="https://img.freepik.com/free-vector/mission-concept-illustration_114360-5142.jpg"
              alt="Our Mission"
              className="rounded-2xl shadow-lg"
            />
          </div>
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-semibold text-green-400 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-300 text-lg">
              To build a platform that helps organizations adapt to change, deliver
              value faster, and foster an environment of trust, accountability, and
              innovation across all teams.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-semibold text-center text-green-400 mb-10">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Team Members */}
            {[
              {
                name: "Dipesh H Jha",
                role: "Project Lead",
                task: "Coordinates the overall ScrumX platform and manages task automation modules.",
              },
              {
                name: "Aashish R Gupta",
                role: "Backend Developer",
                task: "Handles APIs, authentication, and integration with databases.",
              },
              {
                name: "Mohit S Kanyal",
                role: "Frontend Developer",
                task: "Designs interactive UI and ensures smooth user experience.",
              },
              {
                name: "Dixit K Jain",
                role: "AI Specialist",
                task: "Develops AI models that power automation and recommendations.",
              },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform"
              >
                {/* WhatsApp style DP */}
                <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center mb-4">
                  <span className="text-2xl text-gray-300">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-green-300">
                  {member.name}
                </h3>
                <p className="text-gray-400 text-sm">{member.role}</p>
                <p className="text-gray-300 mt-3 text-center text-sm">
                  {member.task}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Aboutus;
