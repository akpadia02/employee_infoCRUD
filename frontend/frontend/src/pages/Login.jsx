/**
 * File: pages/Login.jsx
 *
 * Purpose:
 * - Displays login form for existing users
 * - Performs client-side validation
 * - Sends login request to backend API
 * - Stores JWT token after successful login
 * - Redirects user to dashboard
 *
 * Responsibilities:
 * 1. Collect user credentials
 * 2. Validate inputs before submission
 * 3. Communicate with authentication API
 * 4. Handle backend error responses
 * 5. Manage loading state
 * 6. Control user navigation after login
 *
 * Flow:
 * User Input → Validation → API Request → Token Storage → Redirect
 */

import { useState } from "react";          // React hook for state management
import { useNavigate } from "react-router-dom"; // Used for programmatic navigation

// Icons used for UI and error indicators
import {
  FaUserLock,
  FaExclamationCircle,
} from "react-icons/fa";

// Preconfigured Axios instance (handles base URL & auth headers)
import API from "../services/api";


function Login() {

  // Hook used to redirect user after login
  const navigate = useNavigate();


  // ---------------- STATE MANAGEMENT ----------------

  // Stores entered email value
  const [email, setEmail] = useState("");

  // Stores entered password value
  const [password, setPassword] = useState("");

  // Stores field-level validation errors
  const [errors, setErrors] = useState({});

  // Stores backend/server-side error message
  const [serverError, setServerError] = useState("");

  // Tracks API request status (used to disable button)
  const [loading, setLoading] = useState(false);


  // =====================================================
  //                FORM VALIDATION
  // =====================================================
  const validate = () => {

    let temp = {}; // Temporary object to collect errors

    // -------- Email Validation --------
    if (!email)
      temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      temp.email = "Invalid email format";

    // -------- Password Validation --------
    if (!password)
      temp.password = "Password is required";

    // Store validation errors in state
    setErrors(temp);

    // Return true only if no errors exist
    return Object.keys(temp).length === 0;
  };


  // =====================================================
  //                LOGIN SUBMISSION
  // =====================================================
  const handleLogin = async (e) => {

    // Prevent browser page reload
    e.preventDefault();

    // Clear previous server error
    setServerError("");

    // Stop if validation fails
    if (!validate()) return;

    try {

      // Activate loading state
      setLoading(true);

      // Send login request to backend
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Store JWT token for future authenticated requests
      localStorage.setItem("token", res.data.token);

      // Redirect user to dashboard after successful login
      navigate("/dashboard");

    } catch (error) {

      // Extract backend error message safely
      setServerError(
        error.response?.data?.error ||
          "Login Failed"
      );

    } finally {

      // Disable loading state after request completes
      setLoading(false);
    }
  };


  // =====================================================
  //                UI RENDER
  // =====================================================
  return (
    <div className="auth-container">

      {/* Login Card */}
      <div className="card">

        {/* Page Title */}
        <h2>
          <FaUserLock /> Employee Login
        </h2>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* ================= EMAIL FIELD ================= */}
          <input
            className={`input ${
              errors.email ? "input-error" : ""
            }`}              // Add red border if error exists
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => {

              // Update email state while typing
              setEmail(e.target.value);

              // Clear email error dynamically
              setErrors({ ...errors, email: "" });
            }}
          />

          {/* Email Error Message */}
          {errors.email && (
            <p className="error-text">
              <FaExclamationCircle />
              {errors.email}
            </p>
          )}


          {/* ================= PASSWORD FIELD ================= */}
          <input
            className={`input ${
              errors.password ? "input-error" : ""
            }`}              // Highlight field if error exists
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {

              // Update password state
              setPassword(e.target.value);

              // Clear password error dynamically
              setErrors({
                ...errors,
                password: "",
              });
            }}
          />

          {/* Password Error Message */}
          {errors.password && (
            <p className="error-text">
              <FaExclamationCircle />
              {errors.password}
            </p>
          )}


          {/* ================= SERVER ERROR ================= */}
          {/* Display backend validation/authentication error */}
          {serverError && (
            <p className="error-text">
              <FaExclamationCircle />
              {serverError}
            </p>
          )}


          {/* ================= SUBMIT BUTTON ================= */}
          <button
            className="btn"
            disabled={loading} // Prevent multiple submissions
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* Registration Redirect */}
        <div className="link-text">
          New User?{" "}
          <a href="/register">Register</a>
        </div>

      </div>
    </div>
  );
}

export default Login;
