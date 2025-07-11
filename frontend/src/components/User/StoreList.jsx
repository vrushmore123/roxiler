import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import StoreCard from "./StoreCard";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
  });
  const { user } = useAuth();

  // This function makes the GET request to the backend
  const fetchStores = useCallback(async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: filters, // Pass filters as query params
      };
      const { data } = await axios.get("/api/stores/", config);
      setStores(data);
      console.log("data", data);
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
      <div className="bg-gray-800 p-4 rounded-lg mb-6 flex gap-4">
        <input
          type="text"
          name="name"
          placeholder="Search by store name..."
          value={filters.name}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none"
        />
        <input
          type="text"
          name="address"
          placeholder="Search by address..."
          value={filters.address}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.length > 0 ? (
          stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onRatingSubmitted={fetchStores}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No stores found.
          </p>
        )}
      </div>
    </div>
  );
};

export default StoreList;
