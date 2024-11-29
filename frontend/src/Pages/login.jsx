import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://rbac-backend-zg63.onrender.com/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-400 to-slate-50">
      <h2 className="text-6xl font-bold text-black mt-4 mb-8 pb-10">Role Secure</h2>
      <div className="bg-gray-800 p-9 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl italic font-bold text-center mb-4 text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-600 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-600 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center gap-x-3 items-center w-full mt-4 pb-2">
            <span className="text-white">Don&apos;t have an account?</span>
            <button onClick={() => navigate("/register")} className="text-blue-400 font-bold">Register</button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 font-serif font-bold text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
        </form>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
};

export default Login;
