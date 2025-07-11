import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AddUserForm = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const { user } = useAuth();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.post("/api/admin/users", formData, config);
      console.log("User added:", res.data);
      alert("User created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      }); // Reset form
      if (onUserAdded) onUserAdded();
    } catch (err) {
      console.error("Failed to add user:", err.response?.data?.message);
      alert(`Error: ${err.response?.data?.message || "Could not add user."}`);
    }
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">Add New User</h3>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              className="w-full px-3 py-2 bg-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              className="w-full px-3 py-2 bg-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
              className="w-full px-3 py-2 bg-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={onChange}
              className="w-full px-3 py-2 bg-gray-600 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="user">Normal User</option>
              <option value="Store Owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={onChange}
              className="w-full px-3 py-2 bg-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
