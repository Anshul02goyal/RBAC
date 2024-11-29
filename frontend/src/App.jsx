import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/login";
import Register from "./Pages/register";
import HomePage from "./Pages/home";
import Profile from "./Pages/profile";
import ManageUsers from "./Pages/manage-user";
import PropTypes from 'prop-types'
import Logout from "./components/Logout";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-users"
        element={
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
}

export default App;
