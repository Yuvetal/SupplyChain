import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import ViewBlockchain from "./pages/ViewBlockchain";
import AddTransaction from "./features/AddTransaction";
import Dashboard from "./pages/Dashboard";  // 👈 New dashboard page

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/view-blockchain" element={<ViewBlockchain />} />
            <Route path="/add-produce" element={<AddTransaction />} />

            {/* 👇 New Route for Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
