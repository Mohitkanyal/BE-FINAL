// import React, { useEffect, useState } from "react";
// import CountUp from "react-countup";
// import { motion } from "framer-motion";
// import {
//   ClipboardList,
//   Users,
//   Activity,
//   Target,
//   CheckCircle2,
//   Rocket,
// } from "lucide-react";

// // Replace these with your images later
// import HeroBg from "../asset/home1.jpeg";
// import CollaborationBg from "../asset/home2.jpg";
// import SprintBg from "../asset/home3.jpg";
// import Footer from "../components/Footer";

// const Home = () => {
//   const [key, setKey] = useState(0);

//   // 🔄 Change key every 3 seconds to restart CountUp
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setKey((prev) => prev + 1);
//     }, 6000); // repeat every 3s
//     return () => clearInterval(interval);
//   }, []);
//   const features = [
//     {
//       title: "Agile Task Automation",
//       description:
//         "Automate standups, sprint planning, and retrospectives with intelligent AI support.",
//       icon: <ClipboardList size={40} />,
//     },
//     {
//       title: "Team Collaboration",
//       description:
//         "Enhance communication, assign tasks, and track progress with real-time updates.",
//       icon: <Users size={40} />,
//     },
//     {
//       title: "Sprint Tracking",
//       description:
//         "Visualize goals, blockers, and achievements instantly with interactive dashboards.",
//       icon: <Activity size={40} />,
//     },
//     {
//       title: "Goal Alignment",
//       description:
//         "Ensure your team stays focused and aligned with project objectives.",
//       icon: <Target size={40} />,
//     },
//     {
//       title: "Retrospective Insights",
//       description:
//         "Get actionable insights from past sprints to continuously improve performance.",
//       icon: <CheckCircle2 size={40} />,
//     },
//     {
//       title: "Boost Productivity",
//       description:
//         "Empower your Scrum team with AI-driven tools designed for efficiency.",
//       icon: <Rocket size={40} />,
//     },
//   ];

//   const steps = [
//     {
//       title: "Sign Up",
//       desc: "Create your free ScrumX account in just a few clicks.",
//     },
//     {
//       title: "Create Project",
//       desc: "Set up your project space and invite team members instantly.",
//     },
//     {
//       title: "Plan Sprints",
//       desc: "Define sprint goals, tasks, and timelines with AI-powered planning.",
//     },
//     {
//       title: "Track Progress",
//       desc: "Monitor your sprint in real time and resolve blockers quickly.",
//     },
//   ];

//   const faqs = [
//     {
//       question: "What is ScrumX?",
//       answer:
//         "ScrumX is an AI-powered Scrum Master platform that automates standups, sprint planning, and collaboration.",
//     },
//     {
//       question: "Is there a free trial?",
//       answer:
//         "Yes! ScrumX offers a free plan so you can explore key features before upgrading.",
//     },
//     {
//       question: "Can ScrumX integrate with other tools?",
//       answer:
//         "Absolutely. ScrumX integrates seamlessly with tools like Jira, Slack, and Trello.",
//     },
//   ];

//   const [openFAQ, setOpenFAQ] = useState(null);
//   const toggleFAQ = (idx) => {
//     setOpenFAQ(openFAQ === idx ? null : idx);
//   };

//   return (
//     <div className="flex min-h-screen bg-[#121212] text-white font-sans">
//       <main className="flex-1 flex flex-col bg-[#121212] overflow-y-auto">
//         {/* Hero Section */}
//         <section
//           className="relative text-center min-h-[90vh] flex items-center justify-center bg-cover bg-center"
//           style={{ backgroundImage: `url(${HeroBg})` }}
//         >
//           <div className="absolute inset-0 bg-black bg-opacity-30"></div>
//           <motion.div
//             className="relative z-10 px-6 max-w-3xl"
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1 }}
//           >
//             <h1 className="text-6xl font-extrabold text-green-400 mb-8 leading-tight">
//               Welcome to ScrumX
//             </h1>
//             <p className="text-gray-300 text-xl mb-10">
//               ScrumX is your AI-powered Scrum Master that helps automate task
//               tracking, sprint planning, and team collaboration.
//             </p>
//             <button className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg">
//               Get Started
//             </button>
//           </motion.div>
//         </section>

//         {/* Features */}
//         <section className="py-20 px-10">
//           <h2 className="text-3xl font-bold text-center mb-12 text-green-400">
//             Key Features
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map(({ title, description, icon }) => (
//               <motion.div
//                 key={title}
//                 className="bg-[#1b1b1b] p-6 rounded-2xl shadow-md flex flex-col items-center text-center hover:bg-green-900 transition"
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//                 viewport={{ once: true }}
//               >
//                 <div className="mb-4 text-green-400">{icon}</div>
//                 <h3 className="text-xl font-semibold mb-2">{title}</h3>
//                 <p className="text-gray-400 text-sm">{description}</p>
//               </motion.div>
//             ))}
//           </div>
//         </section>

//         {/* Our Impact (no background image) */}
//       <section
//         className="relative py-28 text-center bg-fixed bg-cover bg-center"
//         style={{ backgroundImage: `url(${SprintBg})` }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//         <div className="relative z-10">
//           <h2 className="text-3xl font-bold mb-12 text-green-400">
//             Our Impact
//           </h2>
//           <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
//             <div>
//               <div className="text-5xl font-bold text-green-400">
//                 <CountUp key={key} end={5000} duration={3} />
//               </div>
//               <p className="text-gray-300">Tasks Automated</p>
//             </div>
//             <div>
//               <div className="text-5xl font-bold text-green-400">
//                 <CountUp key={key + 1} end={1200} duration={3} />
//               </div>
//               <p className="text-gray-300">Teams Onboarded</p>
//             </div>
//             <div>
//               <div className="text-5xl font-bold text-green-400">
//                 <CountUp key={key + 2} end={98} suffix="%" duration={3} />
//               </div>
//               <p className="text-gray-300">User Satisfaction</p>
//             </div>
//           </div>
//         </div>
//       </section>

//         {/* New Content (Why ScrumX?) */}
//         <section className="py-20 px-10">
//           <h2 className="text-3xl font-bold text-center mb-12 text-green-400">
//             Why ScrumX?
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {[
//               {
//                 title: "AI-Powered Insights",
//                 desc: "Get predictive analytics to identify risks before they become blockers.",
//               },
//               {
//                 title: "Seamless Integration",
//                 desc: "Connect effortlessly with Jira, Slack, Trello, and more.",
//               },
//               {
//                 title: "Scalable for Any Team",
//                 desc: "From startups to enterprises, ScrumX adapts to your needs.",
//               },
//             ].map((item, idx) => (
//               <motion.div
//                 key={idx}
//                 className="bg-[#1b1b1b] p-8 rounded-2xl shadow-md hover:bg-green-900 transition text-center"
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: idx * 0.2 }}
//                 viewport={{ once: true }}
//               >
//                 <h3 className="text-xl font-semibold mb-4 text-green-300">
//                   {item.title}
//                 </h3>
//                 <p className="text-gray-400 text-sm">{item.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </section>

//         {/* How It Works (with bg image) */}
//         <section
//           className="relative py-28 bg-fixed bg-cover bg-center rounded-2xl my-8"
//           style={{ backgroundImage: `url(${CollaborationBg})` }}
//         >
//           <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl"></div>
//           <div className="relative z-10 text-center px-10">
//             <h2 className="text-3xl font-bold mb-12 text-green-400">
//               How It Works
//             </h2>
//             <div className="grid md:grid-cols-4 gap-8">
//               {steps.map((step, idx) => (
//                 <motion.div
//                   key={idx}
//                   className="p-6 bg-[#121212] rounded-lg shadow-lg text-center hover:bg-green-800 transition"
//                   initial={{ opacity: 0, y: 30 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.8, delay: idx * 0.2 }}
//                   viewport={{ once: true }}
//                 >
//                   <div className="text-4xl font-bold text-green-400 mb-4">
//                     {idx + 1}
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
//                   <p className="text-gray-400 text-sm">{step.desc}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Testimonials */}
//         <section className="py-20 bg-[#1b1b1b] rounded-2xl my-8">
//           <h2 className="text-3xl font-bold text-center mb-12 text-green-400">
//             What Teams Say
//           </h2>
//           <div className="grid md:grid-cols-2 gap-8 px-10">
//             <motion.div
//               className="bg-[#121212] p-6 rounded-lg shadow-lg hover:bg-green-800 transition"
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//             >
//               <p className="italic text-gray-300">
//                 "ScrumX transformed our workflow. Daily standups are smoother,
//                 and sprint planning takes minutes!"
//               </p>
//               <h4 className="mt-4 font-semibold">
//                 — Priya Sharma, Project Manager
//               </h4>
//             </motion.div>
//             <motion.div
//               className="bg-[#121212] p-6 rounded-lg shadow-lg hover:bg-green-800 transition"
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               viewport={{ once: true }}
//             >
//               <p className="italic text-gray-300">
//                 "The AI task automation is a lifesaver. Our team productivity
//                 increased by 40%."
//               </p>
//               <h4 className="mt-4 font-semibold">— John Carter, Scrum Master</h4>
//             </motion.div>
//           </div>
//         </section>

//         {/* FAQ */}
//         <section className="py-20">
//           <h2 className="text-3xl font-bold text-center mb-12 text-green-400">
//             FAQs
//           </h2>
//           <div className="max-w-3xl mx-auto space-y-6">
//             {faqs.map((faq, idx) => (
//               <div
//                 key={idx}
//                 className="bg-[#1b1b1b] p-6 rounded-xl shadow-md cursor-pointer"
//                 onClick={() => toggleFAQ(idx)}
//               >
//                 <h3 className="text-xl font-semibold flex justify-between items-center">
//                   {faq.question}
//                   <span className="text-green-400">
//                     {openFAQ === idx ? "−" : "+"}
//                   </span>
//                 </h3>
//                 {openFAQ === idx && (
//                   <motion.p
//                     className="text-gray-400 mt-4"
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     transition={{ duration: 0.4 }}
//                   >
//                     {faq.answer}
//                   </motion.p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </section>

//         <Footer />
//       </main>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Users,
  Activity,
  Target,
  CheckCircle2,
  Rocket,
} from "lucide-react";

import HeroBg from "../asset/home1.jpeg";
import CollaborationBg from "../asset/home2.jpg";
import SprintBg from "../asset/home3.jpg";
import Footer from "../components/Footer";

const Home = () => {
  const [key, setKey] = useState(0);

  // 🔄 Restart CountUp every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Agile Task Automation",
      description:
        "Automate standups, sprint planning, and retrospectives with intelligent AI support.",
      icon: <ClipboardList size={40} />,
    },
    {
      title: "Team Collaboration",
      description:
        "Enhance communication, assign tasks, and track progress with real-time updates.",
      icon: <Users size={40} />,
    },
    {
      title: "Sprint Tracking",
      description:
        "Visualize goals, blockers, and achievements instantly with interactive dashboards.",
      icon: <Activity size={40} />,
    },
    {
      title: "Goal Alignment",
      description:
        "Ensure your team stays focused and aligned with project objectives.",
      icon: <Target size={40} />,
    },
    {
      title: "Retrospective Insights",
      description:
        "Get actionable insights from past sprints to continuously improve performance.",
      icon: <CheckCircle2 size={40} />,
    },
    {
      title: "Boost Productivity",
      description:
        "Empower your Scrum team with AI-driven tools designed for efficiency.",
      icon: <Rocket size={40} />,
    },
  ];

  const steps = [
    {
      title: "Sign Up",
      desc: "Create your free ScrumX account in just a few clicks.",
    },
    {
      title: "Create Project",
      desc: "Set up your project space and invite team members instantly.",
    },
    {
      title: "Plan Sprints",
      desc: "Define sprint goals, tasks, and timelines with AI-powered planning.",
    },
    {
      title: "Track Progress",
      desc: "Monitor your sprint in real time and resolve blockers quickly.",
    },
  ];

  const faqs = [
    {
      question: "What is ScrumX?",
      answer:
        "ScrumX is an AI-powered Scrum Master platform that automates standups, sprint planning, and collaboration.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes! ScrumX offers a free plan so you can explore key features before upgrading.",
    },
    {
      question: "Can ScrumX integrate with other tools?",
      answer:
        "Absolutely. ScrumX integrates seamlessly with tools like Jira, Slack, and Trello.",
    },
  ];

  const [openFAQ, setOpenFAQ] = useState(null);
  const toggleFAQ = (idx) => {
    setOpenFAQ(openFAQ === idx ? null : idx);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white font-sans">
      <main className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        {/* Hero Section */}
        <section
          className="relative text-center min-h-[100vh] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${HeroBg})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <motion.div
            className="relative z-10 px-6 max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl font-extrabold text-green-400 mb-8 leading-tight">
              Welcome to ScrumX
            </h1>
            <p className="text-gray-300 text-xl mb-10">
              ScrumX is your AI-powered Scrum Master that helps automate task
              tracking, sprint planning, and team collaboration.
            </p>
            <button className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg">
              Get Started
            </button>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-20 px-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-400">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ title, description, icon }) => (
              <motion.div
                key={title}
                className="bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col items-center text-center hover:bg-green-900 transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 text-green-400">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Impact */}
        <section
          className="relative py-28 text-center bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url(${SprintBg})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-12 text-green-400">
              Our Impact
            </h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div>
                <div className="text-5xl font-bold text-green-400">
                  <CountUp key={key} end={5000} duration={3} />
                </div>
                <p className="text-gray-300">Tasks Automated</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-green-400">
                  <CountUp key={key + 1} end={1200} duration={3} />
                </div>
                <p className="text-gray-300">Teams Onboarded</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-green-400">
                  <CountUp key={key + 2} end={98} suffix="%" duration={3} />
                </div>
                <p className="text-gray-300">User Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why ScrumX? */}
        <section className="py-20 px-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-400">
            Why ScrumX?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "AI-Powered Insights",
                desc: "Get predictive analytics to identify risks before they become blockers.",
              },
              {
                title: "Seamless Integration",
                desc: "Connect effortlessly with Jira, Slack, Trello, and more.",
              },
              {
                title: "Scalable for Any Team",
                desc: "From startups to enterprises, ScrumX adapts to your needs.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-gray-800 p-8 rounded-2xl shadow-md hover:bg-green-900 transition text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-4 text-green-300">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section
          className="relative py-28 bg-fixed bg-cover bg-center rounded-2xl my-8"
          style={{ backgroundImage: `url(${CollaborationBg})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl"></div>
          <div className="relative z-10 text-center px-10">
            <h2 className="text-3xl font-bold mb-12 text-green-400">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 bg-gray-900 rounded-lg shadow-lg text-center hover:bg-green-800 transition"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl font-bold text-green-400 mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-800 rounded-2xl my-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-400">
            What Teams Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 px-10">
            <motion.div
              className="bg-gray-900 p-6 rounded-lg shadow-lg hover:bg-green-800 transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="italic text-gray-300">
                "ScrumX transformed our workflow. Daily standups are smoother,
                and sprint planning takes minutes!"
              </p>
              <h4 className="mt-4 font-semibold">
                — Priya Sharma, Project Manager
              </h4>
            </motion.div>
            <motion.div
              className="bg-gray-900 p-6 rounded-lg shadow-lg hover:bg-green-800 transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="italic text-gray-300">
                "The AI task automation is a lifesaver. Our team productivity
                increased by 40%."
              </p>
              <h4 className="mt-4 font-semibold">— John Carter, Scrum Master</h4>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-400">
            FAQs
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-gray-800 p-6 rounded-xl shadow-md cursor-pointer"
                onClick={() => toggleFAQ(idx)}
              >
                <h3 className="text-xl font-semibold flex justify-between items-center">
                  {faq.question}
                  <span className="text-green-400">
                    {openFAQ === idx ? "−" : "+"}
                  </span>
                </h3>
                {openFAQ === idx && (
                  <motion.p
                    className="text-gray-400 mt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.4 }}
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Home;
