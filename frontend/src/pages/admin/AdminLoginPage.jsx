import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/login/admin", formData);
      login(res.data);
      navigate("/admin/dashboard");
      console.log("data", res.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-800 p-8 rounded-lg border border-red-500">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Login</h1>
      <form onSubmit={onSubmit}>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
