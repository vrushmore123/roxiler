import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import StoreList from "../../components/User/StoreList";
import UpdatePasswordForm from "../../components/User/UpdatePasswordForm";

const UserDashboard = () => {
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const { user } = useAuth();

  const fetchStores = useCallback(async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: filters,
      };
      const { data } = await axios.get("/api/stores/", config);
      console.log("Data fetched from backend:", data); // This will print the fetched data
      setStores(data);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    }
  }, [user, filters]);

  useEffect(() => {
    if (user?.token) {
      fetchStores();
    }
  }, [user, fetchStores]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Stores</h1>
        <button
          onClick={() => setShowUpdatePassword(!showUpdatePassword)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showUpdatePassword ? "Cancel" : "Update Password"}
        </button>
      </div>

      {showUpdatePassword && <UpdatePasswordForm />}

      <StoreList stores={stores} onRatingSubmitted={fetchStores} />
    </div>
  );
};

export default UserDashboard;
