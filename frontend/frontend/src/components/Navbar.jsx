/**
 * File: components/Navbar.jsx
 *
 * Purpose:
 * - Displays the top navigation bar on the dashboard
 * - Shows application title
 * - Provides logout functionality
 * - Handles user session termination
 *
 * Responsibilities:
 * 1. Display app branding (Employee Manager)
 * 2. Provide logout button
 * 3. Clear authentication token
 * 4. Redirect user to login page
 *
 * Flow:
 * User clicks Logout → Token removed → Redirect → Session ends
 */

import { useNavigate } from "react-router-dom"; // Used for programmatic navigation
import { FaSignOutAlt } from "react-icons/fa";   // Logout icon from FontAwesome


function Navbar() {

  // React Router hook for navigation
  const navigate = useNavigate();


  /**
   * Handles user logout process.
   *
   * Steps:
   * 1. Remove JWT token from localStorage
   * 2. Redirect user to login page
   * 3. End authenticated session
   */
  const logout = () => {

    // Remove stored authentication token
    localStorage.removeItem("token");

    // Redirect user to login page
    navigate("/");
  };


  return (
    <div
      /* Top navigation container */
      style={{
        background: "#1e88e5",            // Primary theme color
        color: "white",                   // White text for contrast
        padding: "15px 30px",             // Vertical and horizontal spacing
        display: "flex",                  // Enable flexbox layout
        justifyContent: "space-between",  // Separate title and button
        alignItems: "center",             // Vertically center content
      }}
    >
      {/* Application title / branding */}
      <h2>Employee Manager</h2>

      {/* Logout button */}
      <button
        onClick={logout} // Trigger logout handler on click
        style={{
          background: "transparent", // Remove default button background
          border: "none",            // Remove border
          color: "white",            // Match navbar text color
          fontSize: "15px",          // Readable font size
          cursor: "pointer",         // Show pointer cursor on hover
        }}
      >
        {/* Logout icon and label */}
        <FaSignOutAlt /> Logout
      </button>

    </div>
  );
}

export default Navbar;
