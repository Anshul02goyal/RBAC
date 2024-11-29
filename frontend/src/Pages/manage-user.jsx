import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://rbac-backend-zg63.onrender.com/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("Error fetching users");
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleUpdateRole = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://rbac-backend-zg63.onrender.com/auth/role",
        { userId, role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? response.data.user : user
          )
        );
        setNewRole(""); // Clear the role input
        toast.success("User role updated successfully");
      }
    } catch (err) {
      setError("Error updating user role");
      console.error(err);
      toast.error("Error updating user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://rbac-backend-zg63.onrender.com/auth/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
        toast.success("User deleted successfully");
      }
    } catch (err) {
      setError("Error deleting user");
      console.error(err);
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="bg-gradient-to-tr from-gray-900 to-gray-200 min-h-screen w-full">
      <nav className=" border-gray-200 dark:bg-gray-900 sticky top-0 shadow-lg z-50">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Manage Users
            </span>
          </a>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/profile"
                  className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent dark:text-white dark:hover:bg-gray-700"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="/home"
                  className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent dark:text-white dark:hover:bg-gray-700"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/logout"
                  className="block py-2 px-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent dark:text-white dark:hover:bg-gray-700"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4">
        {error && <div className="text-red-500">{error}</div>}
        <div className="relative overflow-x-auto mt-4">
          <table className="w-full text-sm text-left border-separate table-auto rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-900 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3">
                  View
                </th>
                <th scope="col" className="px-6 py-3">
                  Update
                </th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900"
                  }
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.username}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      className="bg-gray-200 px-3 w-2/3 py-1 rounded dark:bg-gray-700"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Moderator">Moderator</option>
                      <option value="User">User</option>
                    </select>
                    <button
                      className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleUpdateRole(user._id)}
                    >
                      Update Role
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedUser && (
          <div className="p-4 w-full flex justify-center">
            <div className="bg-white overflow-hidden shadow rounded-lg border">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Profile
                </h3>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 px-4">
                This is some information about the user.
              </p>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedUser.username}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedUser.email}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedUser.role}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Account Created At
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Last Updated At
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(selectedUser.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
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
    </div>
  );
};

export default ManageUsers;
