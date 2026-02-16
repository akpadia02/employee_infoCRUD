/**
 * File: pages/Register.jsx
 *
 * Purpose:
 * - Displays user registration form
 * - Performs client-side validation
 * - Sends registration data to backend API
 * - Handles backend validation errors
 * - Redirects user after successful registration
 *
 * Responsibilities:
 * 1. Collect user details (name, email, password)
 * 2. Validate inputs before submission
 * 3. Communicate with authentication API
 * 4. Display validation and server errors
 * 5. Manage loading state
 * 6. Redirect user to login page
 *
 * Flow:
 * User Input → Validation → API Request → Success → Redirect
 */

import { useState } from "react"; // React hook for state management
import { useNavigate } from "react-router-dom"; // Used for navigation after registration

// Icons used for UI and validation indicators
import {
  FaUserPlus,
  FaExclamationCircle,
} from "react-icons/fa";

// Preconfigured Axios instance for API calls
import API from "../services/api";


function Register() {

  // React Router hook for redirecting user
  const navigate = useNavigate();


  // ---------------- STATE MANAGEMENT ----------------

  // Stores all registration form input values
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Stores field-level validation errors
  const [errors, setErrors] = useState({});

  // Stores server-side error message (duplicate email, etc.)
  const [serverError, setServerError] = useState("");

  // Controls loading state for submit button
  const [loading, setLoading] = useState(false);


  // =====================================================
  //                FORM VALIDATION
  // =====================================================
  const validate = () => {

    let temp = {}; // Temporary object to collect validation errors

    // -------- Name Validation --------
    // Ensure name is not empty
    if (!form.name)
      temp.name = "Name is required";

    // -------- Email Validation --------
    // Check if email exists and follows basic format
    if (!form.email)
      temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      temp.email = "Invalid email format";

    // -------- Password Validation --------
    // Ensure password exists and meets minimum length
    if (!form.password)
      temp.password = "Password required";
    else if (form.password.length < 6)
      temp.password = "Minimum 6 characters";

    // Store validation errors in state
    setErrors(temp);

    // Return true only if there are no validation errors
    return Object.keys(temp).length === 0;
  };


  // =====================================================
  //                REGISTER SUBMISSION
  // =====================================================
  const handleRegister = async (e) => {

    // Prevent browser from refreshing on submit
    e.preventDefault();

    // Clear previous backend error
    setServerError("");

    // Stop submission if validation fails
    if (!validate()) return;

    try {

      // Enable loading indicator
      setLoading(true);

      // Send registration data to backend
      await API.post("/auth/register", form);

      // Redirect user to login page on success
      navigate("/");

    } catch (error) {

      // Extract and display backend error safely
      setServerError(
        error.response?.data?.error ||
          "Registration Failed"
      );

    } finally {

      // Disable loading after request completes
      setLoading(false);
    }
  };


  // =====================================================
  //                HANDLE INPUT CHANGE
  // =====================================================
  const handleChange = (e) => {

    // Update form state dynamically
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clear specific field error while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };


  // =====================================================
  //                UI RENDER
  // =====================================================
  return (
    <div className="auth-container">

      {/* Registration Card */}
      <div className="card">

        {/* Page Title */}
        <h2>
          <FaUserPlus /> Create Account
        </h2>

        {/* Registration Form */}
        <form onSubmit={handleRegister}>


          {/* ================= NAME FIELD ================= */}
          <input
            className={`input ${
              errors.name ? "input-error" : ""
            }`}                // Highlight input on error
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          {/* Name Error Message */}
          {errors.name && (
            <p className="error-text">
              <FaExclamationCircle />
              {errors.name}
            </p>
          )}


          {/* ================= EMAIL FIELD ================= */}
          <input
            className={`input ${
              errors.email ? "input-error" : ""
            }`}                // Highlight input on error
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
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
            }`}                // Highlight input on error
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* Password Error Message */}
          {errors.password && (
            <p className="error-text">
              <FaExclamationCircle />
              {errors.password}
            </p>
          )}


          {/* ================= SERVER ERROR ================= */}
          {/* Display backend validation / duplicate email error */}
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
              ? "Registering..."
              : "Register"}
          </button>

        </form>


        {/* Login Redirect */}
        <div className="link-text">
          Already Registered?{" "}
          <a href="/">Login</a>
        </div>

      </div>
    </div>
  );
}

export default Register;
