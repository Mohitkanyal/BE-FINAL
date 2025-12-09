import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from "axios";

export default function Blog() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    content: "",
    creator: user?._id,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const transformFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Type check
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    // ✅ Size check (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Image size must be less than 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
      toast.success("Image uploaded successfully!");
    };
  };

  // Submit blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios({
        url: SummaryApi.createBlog.url,
        method: SummaryApi.createBlog.method,
        data: formData,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({ title: "", image: "", content: "", creator: user?._id });
        fetchBlogDetails();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Something went wrong while submitting the blog.");
    }
  };

  // Fetch blogs
  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(SummaryApi.blogDetails.url, {
        headers: { "Content-Type": "application/json" },
      });

      if (Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogDetails();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-grow px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16 mt-10">
          <h1 className="text-4xl font-bold text-green-400 mb-4">
            Latest Blogs on Salary Prediction
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            Explore insights, updates, and tips about salary predictions and
            project management from our community.
          </p>
        </header>

        {/* Blog List Section */}
        <section className="mb-20 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-green-400 mb-6">Blogs</h2>
          <div className="space-y-4">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((el, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-700 rounded-lg bg-gray-800/70 backdrop-blur-md shadow-lg hover:shadow-xl transition"
                >
                  <div
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  >
                    <img
                      src={el.image}
                      alt={el.title}
                      className="w-20 h-20 rounded-lg object-cover shadow-md border border-gray-600"
                    />
                    <h2 className="text-lg font-semibold text-green-300 flex-1">
                      {el.title}
                    </h2>
                    <span className="text-gray-400 text-xl">
                      {expandedIndex === index ? (
                        <IoIosArrowUp size={25} />
                      ) : (
                        <IoIosArrowDown size={25} />
                      )}
                    </span>
                  </div>
                  {expandedIndex === index && (
                    <p className="mt-3 text-gray-300">{el.content}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No blogs available...</p>
            )}
          </div>
        </section>

        {/* Blog Submission Form */}
        <section className="mb-10 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-green-400 mb-6 flex items-center">
            <FaRegEdit className="mr-2" /> Submit Your Blog
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-lg"
          >
            {/* Title */}
            <label className="block text-sm text-gray-300 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 bg-gray-900 rounded text-white focus:ring focus:ring-green-400"
              required
            />

            {/* Image */}
            <label className="block text-sm text-gray-300 mb-2 mt-4">
              Upload Image (Max 10MB) *
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={transformFile}
              className="w-full p-2 border border-gray-600 bg-gray-900 rounded text-white"
              required
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-4 w-48 h-48 rounded-lg object-cover shadow-lg border border-gray-600"
              />
            )}

            {/* Content */}
            <label className="block text-sm text-gray-300 mb-2 mt-4">
              Blog Content *
            </label>
            <textarea
              name="content"
              rows="4"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 bg-gray-900 rounded text-white focus:ring focus:ring-green-400"
              required
            />

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-medium p-2 rounded-lg hover:bg-green-600 mt-4 transition"
            >
              Submit Blog
            </button>
          </form>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
