import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl font-bold">
        Welcome to the Store Rating Platform
      </h1>
      <p className="mt-4 text-xl text-gray-300 mb-12">
        Please select your role to log in.
      </p>
      <div className="flex justify-center gap-8">
        <Link
          to="/admin/login"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
        >
          Admin Login
        </Link>
        <Link
          to="/owner/login"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
        >
          Store Owner Login
        </Link>
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl"
        >
          User Login
        </Link>
      </div>
      <p className="mt-8 text-gray-400">
        New user?{" "}
        <Link to="/register" className="text-blue-400 hover:underline">
          Register here
        </Link>
        .
      </p>
      <div className="mt-4 text-gray-400 space-x-6">
        <span>
          New Store Owner?{" "}
          <Link
            to="/owner/register"
            className="text-purple-400 hover:underline"
          >
            Register here
          </Link>
          .
        </span>
        <span>
          New Admin?{" "}
          <Link to="/admin/register" className="text-red-400 hover:underline">
            Register here
          </Link>
          .
        </span>
      </div>
    </div>
  );
};

export default HomePage;
