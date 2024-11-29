import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [editingContentId, setEditingContentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [approved, setApproved] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return navigate("/"); // Redirect to login if no token is found
        }

        const response = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUserRole(response.data.user.role);
        } else {
          console.log("User not found for header");
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user details. Please try again."); // Show error toast
        navigate("/"); // Redirect to login if there's any error (invalid token, etc.)
      }
    };

    getUser();
  }, [navigate]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/content/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContent(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch content.");
      }
    };
    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      setError("Text is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/content/create",
        { text: text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContent((prevContent) => [...prevContent, response.data.newContent]);
      setText("");
      toast.success("Content added successfully!");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to add content.");
    }
  };

  const handleContentDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/content/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status) {
        setContent((prevContent) =>
          prevContent.filter((item) => item._id !== id)
        );
        toast.success("Content deleted successfully!");
      } else {
        toast.error("Content not deleted.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete content.");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/content/update",
        {
          contentId: id,
          content: editingText,
          approved: approved,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setContent((prevContent) =>
          prevContent.map((item) =>
            item._id === id ? response.data.updatedContent : item
          )
        );
        setEditingContentId(null);
        setEditingText("");
        setApproved(false);
        toast.success("Content updated successfully!");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to update content.");
    }
  };

  return (
    <div className="container mx-auto">
      <Header />
      <div
        className="bg-gray-50 min-h-full mb-0 overflow-y-scroll"
        style={{
          scrollbarWidth: 'none', /* Hide scrollbar for Firefox */
          msOverflowStyle: 'none', /* Hide scrollbar for Internet Explorer and Edge */
        }}
      >
        {/* For WebKit browsers (Chrome, Safari, Opera) */}
        <style>
          {`
            .bg-gray-50.min-h-full.mb-0::-webkit-scrollbar {
              display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
            }
          `}
        </style>
        <div className="px-10 p-2 w-full mb-1">
          {error && (
            <div className="text-red-500 mb-4">{console.log(error)}</div>
          )}
          <form onSubmit={handleSubmit} className="w-3/4">
            <div className="flex items-center">
              <input
                type="text"
                className="w-full flex-grow px-4 text-white bg-gray-800 py-2 mt-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={text}
                placeholder="Type something here...."
                onChange={(e) => setText(e.target.value)}
              />
              <button
                type="submit"
                className="mt-2 ml-2 whitespace-nowrap bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
              >
                Add Text
              </button>
            </div>
          </form>
        </div>
        <div className="m-4 mb-0 mx-8 shadow-lg z-50 rounded-md p-6 grid grid-cols-1 md:grid-cols-3 bg-gray-200 gap-6 max-h-fit">
          {content && content.length ? (
            content.map((item) => (
              <div
                key={item._id}
                className="bg-gray-800 text-gray-100 hover:bg-gray-900 p-4 py-3 rounded-2xl shadow-md border-4 border-gray-900"
              >
                <h2 className="text-lg font-bold overflow-y-auto">
                  {item.content}
                </h2>
                <div className="justify-between">
                  <span className="font-semibold">Status: </span>
                  <span className="italic font-serif">{item.approved ? "Approved" : "Pending"}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  {
                  (userRole === 'Admin' || userRole === 'Moderator') ?
                  (editingContentId === item._id ? (
                    <>
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        placeholder="New content text"
                        className="w-full px-4 py-2 text-black border rounded-lg"
                      />
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={approved}
                          onChange={(e) => setApproved(e.target.checked)}
                        />
                        <span className="font-semibold">Approved</span>
                      </label>
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingContentId(null)}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <div className="w-1/2 flex justify-evenly">
                      <button
                        onClick={() => {
                          setEditingContentId(item._id);
                          setEditingText(item.content);
                          setApproved(item.approved);
                        }}
                        className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleContentDelete(item._id)}
                        className="bg-[#ef4444] text-white py-1 px-4 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                  : null
                  }
                </div>
              </div>
            ))
          ) : (
            <div>No content found</div>
          )}
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />{" "}
        {/* Add ToastContainer for the toasts */}
      </div>
    </div>
  );
};

export default HomePage;
