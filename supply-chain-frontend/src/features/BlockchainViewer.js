import React, { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import './BlockchainViewer.css'; 

function BlockchainViewer() {
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState("");
  const [elements, setElements] = useState([]);

  // Fetch blockchain data
  useEffect(() => {
    fetch("http://localhost:5000/view")
      .then((res) => res.json())
      .then((data) => setBlocks(data))
      .catch((err) => {
        console.error("Error fetching blockchain:", err);
        setError("⚠️ Could not fetch blockchain data.");
      });
  }, []);

  // Convert blocks to React Flow elements
  useEffect(() => {
    if (blocks.length === 0) return;

    const nodes = blocks.map((block, idx) => ({
      id: block.hash,
      data: {
        label: (
          <div style={{ padding: 10, border: "1px solid #00ffff", borderRadius: 8, background: "#111", color: "#00ffff" }}>
            <strong>{block.description || "Transaction"}</strong><br />
            <p>Batch: {block.batch_id}</p>
            <p>Qty: {block.quantity}, Cost: ₹{block.cost}</p>
            <p>Sold To: {block.sold_to?.name}</p>
          </div>
        ),
      },
      position: { x: Math.random() * 600, y: idx * 100 }, // Simple layout; later can use layout libraries
    }));

    const edges = blocks
      .filter((block) => block.parent_hash)
      .map((block) => ({
        id: `e-${block.parent_hash}-${block.hash}`,
        source: block.parent_hash,
        target: block.hash,
        animated: true,
        style: { stroke: "#00ffff" },
      }));

    setElements([...nodes, ...edges]);
  }, [blocks]);

  return (
    <div className="viewer-container" style={{ height: "80vh" }}>
      <h2 className="viewer-title">🌾 Blockchain Produce Records</h2>
      {error && <p className="error-text">{error}</p>}
      {blocks.length === 0 && !error && <p className="loading-text">Loading...</p>}

      {elements.length > 0 && (
        <ReactFlow
          elements={elements}
          nodesDraggable={true}
          nodesConnectable={false}
          zoomOnScroll={true}
          panOnScroll={true}
          fitView
        >
          <MiniMap nodeColor={() => "#00ffff"} />
          <Controls />
          <Background color="#222" gap={16} />
        </ReactFlow>
      )}
    </div>
  );
}

export default BlockchainViewer;
