import { useState } from "react";
import UserList from "../../components/System Administrator/UserList";
import AddUserForm from "../../components/System Administrator/AddUserForm";

const AdminUsersPage = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger list refresh

  const handleUserAdded = () => {
    setShowAddUser(false);
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to re-render UserList
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">User Management</h1>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showAddUser ? "Cancel" : "Add New User"}
        </button>
      </div>

      {showAddUser && <AddUserForm onUserAdded={handleUserAdded} />}

      <div className="mt-8">
        <UserList key={refreshKey} />
      </div>
    </div>
  );
};

export default AdminUsersPage;
