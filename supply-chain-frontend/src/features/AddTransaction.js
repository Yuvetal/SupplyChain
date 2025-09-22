import "./AddTransaction.css";
import React, { useState, useEffect } from "react";
import "../App.css";

const AddTransaction = () => {
  const [parentBlocks, setParentBlocks] = useState([]);
  const [selectedParentHash, setSelectedParentHash] = useState("");

  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const [soldToName, setSoldToName] = useState("");
  const [soldToPhone, setSoldToPhone] = useState("");
  const [harvestDate, setHarvestDate] = useState("");

  const [description, setDescription] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [message, setMessage] = useState("");

  // Fetch parent blocks on mount
  useEffect(() => {
    fetch("http://localhost:5000/get_parents")
      .then((res) => res.json())
      .then((data) => setParentBlocks(data))
      .catch((err) => console.error("Error fetching parents:", err));
  }, []);

  // Auto-generate transaction summary
  useEffect(() => {
    if (quantity && soldToName && harvestDate) {
      const formattedDate = new Date(harvestDate).toLocaleDateString("en-GB");
      setDescription(`Sold ${quantity} rice to ${soldToName} on ${formattedDate}`);
    } else {
      setDescription("");
    }
  }, [quantity, soldToName, harvestDate]);

  const isValidPhoneNumber = (number) => /^[6-9]\d{9}$/.test(number);

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!selectedParentHash || !quantity || !cost || !soldToName || !soldToPhone || !harvestDate) {
      setMessage("⚠️ Please fill all fields before sending OTP.");
      return;
    }

    if (!isValidPhoneNumber(soldToPhone)) {
      setMessage("⚠️ Invalid phone number. Must be 10 digits, start with 6/7/8/9.");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setMessage(`[MOCK] OTP sent to ${soldToPhone}: ${otp}`);
  };

  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();

    if (userOtp !== generatedOtp) {
      setMessage("❌ Incorrect OTP.");
      return;
    }

    setMessage("⏳ Adding produce to blockchain...");

    try {
      const response = await fetch("http://localhost:5000/add_block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parent_hash: selectedParentHash,
          quantity,
          cost,
          sold_to: { name: soldToName, phone: soldToPhone },
          harvest_date: harvestDate,
          description, // send readable summary to backend
        }),
      });

      const data = await response.json();

      if (response.ok && data.message) {
        setMessage("✅ Produce record added to blockchain!");

        // Reset fields
        setSelectedParentHash("");
        setQuantity("");
        setCost("");
        setSoldToName("");
        setSoldToPhone("");
        setHarvestDate("");
        setUserOtp("");
        setOtpSent(false);
        setDescription("");
      } else {
        setMessage("❌ Failed to add produce.");
      }
    } catch (err) {
      console.error("Error adding produce:", err);
      setMessage("❌ Error connecting to backend.");
    }
  };

  return (
    <div className="transaction-container">
      <h2>🌾 Add Produce Record</h2>

      <form className="transaction-form" onSubmit={handleVerifyAndSubmit}>
        {/* Parent block dropdown */}
        <select
          value={selectedParentHash}
          onChange={(e) => setSelectedParentHash(e.target.value)}
        >
          <option value="">-- Select Parent Block --</option>
          {parentBlocks.map((block) => (
            <option key={block.hash} value={block.hash}>
              {block.desc} {/* Friendly transaction summary */}
            </option>
          ))}
        </select>

        {/* Other inputs */}
        <input
          type="date"
          placeholder="Harvest Date"
          value={harvestDate}
          onChange={(e) => setHarvestDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Quantity (e.g., 10kg)"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cost (₹)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sold To (Name)"
          value={soldToName}
          onChange={(e) => setSoldToName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sold To (Phone Number)"
          value={soldToPhone}
          onChange={(e) => setSoldToPhone(e.target.value)}
        />

        {/* Read-only transaction summary */}
        <input
          type="text"
          placeholder="Transaction Summary"
          value={description}
          readOnly
        />

        <button onClick={handleSendOtp}>Send OTP</button>

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
            />
            <button className="glow-button" type="submit">
              Verify & Add
            </button>
          </>
        )}
      </form>

      <p>{message}</p>
    </div>
  );
};

export default AddTransaction;
