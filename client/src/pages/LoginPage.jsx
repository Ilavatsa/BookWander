import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access_token", data.access_token); // Store token securely
        alert("Login successful!");
        navigate("/homepage");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="form-container">
      <div className="img">
        <img src="	https://i.pinimg.com/564x/b3/25/f0/b325f024a566f668f2bb4903a2bd5d5c.jpg" alt="Description" className="form-image" />
        <div className="text">
          <h1 className="H1">LOGIN WITH US!</h1>
          <h2 className="H2">
            LOG IN TO ACCESS YOUR ACCOUNT AND ENJOY OUR SEAMLESS TRAVEL SERVICES
          </h2>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="Loginform">
        <h4 className="H4">YOUR ULTIMATE MATATU SOLUTION</h4>
        <h3 className="H3">Email address</h3>
        <input
          type="email"
          name="email"
          className="Input"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <h3 className="H3">Password</h3>
        <input
          type="password"
          name="password"
          className="Input"
          placeholder="at least 8 characters"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <p className="P1">
          Don't have an account?{" "}
          <Link to="/Signup" className="sign-up-button">
            Sign up
          </Link>
        </p>
        <button type="submit" disabled={loading} className="btn">
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
