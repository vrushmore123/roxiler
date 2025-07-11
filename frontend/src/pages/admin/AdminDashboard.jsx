import DashboardStats from "../../components/System Administrator/DashboardStats";
import AddUserForm from "../../components/System Administrator/AddUserForm";
import AddStoreForm from "../../components/System Administrator/AddStoreForm";
import UserList from "../../components/System Administrator/UserList";
import { useState } from "react";

const AdminDashboard = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {showAddUser ? "Cancel" : "Add User"}
          </button>
          <button
            onClick={() => setShowAddStore(!showAddStore)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {showAddStore ? "Cancel" : "Add Store"}
          </button>
        </div>
      </div>

      <DashboardStats />

      {showAddUser && <AddUserForm onUserAdded={() => setShowAddUser(false)} />}
      {showAddStore && (
        <AddStoreForm onStoreAdded={() => setShowAddStore(false)} />
      )}

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">User Management</h2>
        <UserList />
      </div>

      {/* <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Store Management</h2>
        <StoreList />
      </div> */}
    </div>
  );
};

export default AdminDashboard;
