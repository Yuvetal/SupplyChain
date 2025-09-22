// src/pages/Dashboard.jsx
import React, { useState } from "react";
import AddTransaction from "../features/AddTransaction";
import BlockchainViewer from "../features/BlockchainViewer";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="dashboard-container">
      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          ➕ Add Transaction
        </button>
        <button
          className={`tab-button ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          📜 View Blockchain
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === "add" ? <AddTransaction /> : <BlockchainViewer />}
      </div>
    </div>
  );
}
