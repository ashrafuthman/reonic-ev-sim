// src/components/layout/Navbar.tsx
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.svg";

const base = "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
const active = "bg-gray-900 text-white";

function Navbar() {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* sLogo + title -> Home */}
          <Link to="/" className="flex items-center space-x-3" aria-label="Go Home">
            <img src={logo} alt="Reonic logo" className="w-10 h-10" />
            <h1 className="text-white text-2xl">Reonic EV Simulator</h1>
          </Link>

          {/* Nav links */}
          <div className="flex items-center space-x-1">
            <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
              Home
            </NavLink>
            <NavLink to="/power/daily" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
              Daily Power
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
