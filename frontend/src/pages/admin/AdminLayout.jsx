import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const activeLinkStyle = {
    backgroundColor: "#4A5568", // bg-gray-700
    color: "white",
  };

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 p-4 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-white">Admin Menu</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/admin/dashboard"
            end
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded hover:bg-gray-700"
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded hover:bg-gray-700"
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/admin/stores"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="p-3 rounded hover:bg-gray-700"
          >
            Manage Stores
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet /> {/* This will render the nested route component */}
      </main>
    </div>
  );
};

export default AdminLayout;
