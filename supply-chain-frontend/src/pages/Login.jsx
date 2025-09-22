import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just simulate login/register and redirect
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          )}
          <input
            type="text"
            placeholder="Email / Phone"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <p className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New here? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
