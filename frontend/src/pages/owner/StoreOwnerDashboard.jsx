import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import UpdatePasswordForm from "../../components/Store Owner/UpdatePasswordForm";

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        // ✅ IMPORTANT: must have token
        if (!user?.token) {
          setError("Authentication token missing. Please log in again.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get("/api/stores/mystore", config);
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);

        if (err.response && err.response.status === 404) {
          setError(
            "You have not been assigned to a store. Please contact an administrator."
          );
        } else if (err.response && err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-xl text-yellow-400">{error}</div>
    );
  }

  if (!dashboardData) {
    return <div className="text-center mt-10">No data available.</div>;
  }

  const { store, averageRating, raters } = dashboardData;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{store.name} - Dashboard</h1>
        <button
          onClick={() => setShowUpdatePassword(!showUpdatePassword)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showUpdatePassword ? "Cancel" : "Update Password"}
        </button>
      </div>

      {showUpdatePassword && <UpdatePasswordForm />}

      <div className="bg-gray-800 p-6 rounded-lg text-center my-8">
        <h3 className="text-xl text-gray-400">Average Store Rating</h3>
        <p className="text-5xl font-bold mt-2">
          {averageRating ? parseFloat(averageRating).toFixed(2) : "N/A"}
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Users Who Rated Your Store</h2>
        <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-3">User Name</th>
                <th className="p-3">User Email</th>
                <th className="p-3">Rating Given</th>
              </tr>
            </thead>
            <tbody>
              {raters.length > 0 ? (
                raters.map((rater, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="p-3">{rater.name}</td>
                    <td className="p-3">{rater.email}</td>
                    <td className="p-3">{rater.rating} ★</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-3 text-center">
                    No ratings submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
