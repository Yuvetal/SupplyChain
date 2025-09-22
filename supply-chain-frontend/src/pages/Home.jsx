import "./Home.css";
import farmImage from "../assets/homepage.jpg";

// Import icons
import addIcon from "../assets/add.png";
import secureIcon from "../assets/secure.png";
import viewIcon from "../assets/view.png";
import qrIcon from "../assets/qr.png";

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <h2>🌾 Blockchain-Based Agriculture Supply Chain</h2>
      <p>
        Ensuring <strong>transparency</strong>, <strong>trust</strong>, and
        <strong> traceability</strong> — from farm to plate.
      </p>

      {/* Hero Image */}
      <div className="hero-image">
        <img src={farmImage} alt="Agriculture Blockchain" className="hero-img" />
      </div>

      <blockquote>
        "Every crop tells a story — we make it trustworthy."
      </blockquote>

      {/* Problem Section */}
      <section className="info-section">
        <h3>🌱 The Problem</h3>
        <p>
          Farmers often struggle with unfair pricing, lack of transparency, and
          trust issues in the supply chain. Buyers and consumers find it hard to
          verify where the produce really comes from. This leads to inefficiency
          and loss of trust for everyone involved.
        </p>
      </section>

      {/* How It Works */}
      <section className="info-section">
        <h3>⚙️ How It Works</h3>
        <ul className="steps-list">
          <li>
            <img src={addIcon} alt="Add Produce" className="step-icon" />
            <p>
              <strong>Add Produce:</strong> Farmers record Batch ID, Harvest
              Date, Quantity, Cost, and Buyer info.
            </p>
          </li>
          <li>
            <img src={secureIcon} alt="Secure Storage" className="step-icon" />
            <p>
              <strong>Stored Securely:</strong> Each record is stored on the
              blockchain and cannot be changed later.
            </p>
          </li>
          <li>
            <img src={viewIcon} alt="View Records" className="step-icon" />
            <p>
              <strong>View Records:</strong> Farmers and buyers can view the
              chain of records anytime.
            </p>
          </li>
          <li>
            <img src={qrIcon} alt="QR Verification" className="step-icon" />
            <p>
              <strong>Verify via QR:</strong> Anyone can scan a QR code to
              confirm the authenticity of a batch.
            </p>
          </li>
        </ul>
      </section>

      {/* Benefits */}
      <section className="info-section">
        <h3>🌟 Why Choose Our Solution?</h3>
        <ul>
          <li>✅ Transparent pricing for farmers</li>
          <li>✅ Proof of authenticity for buyers</li>
          <li>✅ Easy tracking of produce from farm to consumer</li>
          <li>✅ Strong trust between all supply chain members</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h3>🚀 Join the Future of Farming</h3>
        <p>
          Start recording your harvest today and bring transparency to every
          transaction. Together, we can make agriculture more <em>fair</em>,
          <em> honest</em>, and <em>profitable</em>.
        </p>
      </section>
    </div>
  );
}
