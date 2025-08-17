import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import DailyPower from "./pages/DailyPower";
import './App.css'
import Navbar from "./components/Navbar";
import AutoReserveRunner from "./components/AutoReserveRunner";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AutoReserveRunner />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/power/daily" element={<DailyPower />} />
        <Route path="*" element={<div className="p-6">Page not found. <Link className="underline" to="/">Go Home</Link></div>} />
      </Routes>
    </div>
  );
}
