/**
 * File: services/api.js
 *
 * Purpose:
 * - Creates a centralized Axios instance
 * - Handles all backend API communication
 * - Automatically attaches JWT token to requests
 * - Keeps API configuration in one place
 *
 * Responsibilities:
 * 1. Configure backend base URL
 * 2. Manage authentication headers
 * 3. Intercept requests before sending
 * 4. Reduce code duplication across components
 *
 * Why this file exists:
 * Instead of configuring Axios in every page,
 * we use one reusable instance with common settings.
 *
 * This improves:
 * - Maintainability
 * - Security
 * - Code consistency
 */

import axios from "axios"; // HTTP client for making API requests
const BASE_URL = import.meta.env.VITE_API_URL;

// =====================================================
//                CREATE AXIOS INSTANCE
// =====================================================

// Create a pre-configured Axios object
// All requests will use this base URL
const API = axios.create({

  // Backend server base endpoint
  // All API calls will be appended to this URL
  // baseURL: "https://employee-infocrud-backend-flask.onrender.com/api",
  // baseURL: "http://127.0.0.1:5000/api",
  baseURL: BASE_URL + "/api",

});


// =====================================================
//           REQUEST INTERCEPTOR (JWT HANDLING)
// =====================================================

// Interceptor runs BEFORE every request is sent
API.interceptors.request.use((req) => {

  // Retrieve JWT token from browser storage
  const token = localStorage.getItem("token");

  // If token exists, attach it to Authorization header
  if (token) {

    // Standard Bearer token format
    req.headers.Authorization = `Bearer ${token}`;

  }

  // Return modified request
  return req;
});


// =====================================================
//                EXPORT INSTANCE
// =====================================================

// Export configured Axios instance
// Used in all pages: API.get(), API.post(), etc.
export default API;
