import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const AdminStoreList = ({ refreshKey }) => {
  const [stores, setStores] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // Using the public GET /api/stores route
        const { data } = await axios.get("/api/stores", config);
        setStores(data);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      }
    };

    if (user?.token) {
      fetchStores();
    }
  }, [user, refreshKey]); // Re-fetches when refreshKey changes

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Registered Stores</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Address</th>
            <th className="p-3">Owner ID</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map((store) => (
              <tr
                key={store.id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="p-3">{store.name}</td>
                <td className="p-3">{store.email}</td>
                <td className="p-3">{store.address}</td>
                <td className="p-3 truncate" title={store.owner_id}>
                  {store.owner_id.substring(0, 8)}...
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center">
                No stores found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStoreList;
