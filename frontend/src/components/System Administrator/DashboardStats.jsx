const DashboardStats = () => {
  const stats = {
    totalUsers: 150,
    totalStores: 42,
    totalRatings: 897,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <h3 className="text-xl text-gray-400">Total Users</h3>
        <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <h3 className="text-xl text-gray-400">Total Stores</h3>
        <p className="text-4xl font-bold mt-2">{stats.totalStores}</p>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <h3 className="text-xl text-gray-400">Total Ratings</h3>
        <p className="text-4xl font-bold mt-2">{stats.totalRatings}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
