import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post("http://localhost:5000/auth/logout", {}, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status === 200) {
                    localStorage.removeItem("token");
                    toast.success("Logged out successfully!"); // Show success toast
                    navigate("/"); // Redirect to login page after logout
                } else {
                    console.log("Logout failed: ", response.data);
                    toast.error("Logout failed. Please try again."); // Show error toast
                }
            } catch (error) {
                console.log(error);
                toast.error("An error occurred while logging out."); // Show error toast
            }
        };

        handleLogout(); // Call the logout function when the component mounts
    }, [navigate]);

    return null; // No UI to render
};

export default Logout;