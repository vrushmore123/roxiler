import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const AddStoreForm = ({ onStoreAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });
  const { user } = useAuth();

  const handleGenerateId = () => {
    setFormData({ ...formData, owner_id: uuidv4() });
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.owner_id) {
      alert("Please generate an Owner ID.");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post("/api/stores", formData, config);
      console.log("Store added:", response.data);
      alert("Store created successfully!"); // Add success feedback
      if (onStoreAdded) {
        onStoreAdded();
      }
      // ✅ Optionally clear form after success
      setFormData({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        alert(`Error: ${error.response.data.message || "Server error"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Error: No response from server.");
      } else {
        console.error("Error setting up request:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg mb-8">
      <h3 className="text-2xl font-bold mb-4">Add New Store</h3>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 mb-1">Store Name</label>
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
            <label className="block text-gray-300 mb-1">Store Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full px-3 py-2 bg-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Owner ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="owner_id"
              value={formData.owner_id}
              readOnly
              disabled
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded"
              placeholder="Click button to generate ID"
            />
            <button
              type="button"
              onClick={handleGenerateId}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap"
            >
              Generate Owner ID
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            className="w-full px-3 py-2 bg-gray-600 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Store
        </button>
      </form>
    </div>
  );
};

export default AddStoreForm;
