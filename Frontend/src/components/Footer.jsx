import React from "react";
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaTwitter, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-800 text-white py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold mb-3">ScrumX</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            ScrumX helps teams automate scrum tasks, track progress, and improve productivity. 
            Built with modern tech and designed for seamless collaboration.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-green-400">Home</a></li>
            <li><a href="/Aboutus" className="hover:text-green-400">About Us</a></li>
            <li><a href="/Features" className="hover:text-green-400">Features</a></li>
            <li><a href="/Contact" className="hover:text-green-400">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-xl font-bold mb-3">Resources</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/Blog" className="hover:text-green-400">Blog</a></li>
            <li><a href="/Home" className="hover:text-green-400">FAQ</a></li>
            <li><a href="/support" className="hover:text-green-400">Support</a></li>
            <li><a href="/privacy" className="hover:text-green-400">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-bold mb-3">Contact Us</h2>
          <p className="flex items-center text-gray-300">
            <FaEnvelope className="mr-2 text-green-400" /> scrumx.project@gmail.com
          </p>
          <p className="flex items-center mt-2 text-gray-300">
            <FaPhone className="mr-2 text-green-400" /> +91 98765 43210
          </p>

          {/* Social Links */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"><FaGithub size={20} /></a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"><FaLinkedin size={20} /></a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"><FaTwitter size={20} /></a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-green-500 transition"><FaFacebookF size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 text-center border-t border-green-700 pt-4 text-sm text-gray-400">
        © {new Date().getFullYear()} ScrumX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
