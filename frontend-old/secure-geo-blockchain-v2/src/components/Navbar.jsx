import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">Secure Geospatial Blockchain</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
        <Link to="/upload" className="text-gray-700 hover:text-blue-600 font-medium">Upload</Link>

      </div>
    </nav>
  );
}
