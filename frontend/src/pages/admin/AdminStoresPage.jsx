import { useState } from "react";
import AddStoreForm from "../../components/System Administrator/AddStoreForm";
import AdminStoreList from "../../components/System Administrator/AdminStoreList";

const AdminStoresPage = () => {
  const [showAddStore, setShowAddStore] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStoreAdded = () => {
    setShowAddStore(false);
    // Increment the key to force the AdminStoreList component to re-fetch data
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Store Management</h1>
        <button
          onClick={() => setShowAddStore(!showAddStore)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {showAddStore ? "Cancel" : "Add New Store"}
        </button>
      </div>

      {showAddStore && <AddStoreForm onStoreAdded={handleStoreAdded} />}

      <div className="mt-8">
        <AdminStoreList key={refreshKey} />
      </div>
    </div>
  );
};

export default AdminStoresPage;
