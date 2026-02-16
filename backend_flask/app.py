"""
File: app.py

Purpose:
- Entry point of the Flask backend application
- Initializes Flask server
- Configures CORS for frontend communication
- Enables JWT authentication
- Connects MongoDB database
- Registers all API routes

Flow:
Server Start → Load Config → Setup CORS → Setup JWT → Connect DB → Register Routes → Run App

Responsibilities:
1. Initialize Flask application
2. Load environment configuration
3. Enable secure cross-origin requests
4. Enable JWT authentication
5. Connect MongoDB
6. Register route blueprints
7. Handle preflight OPTIONS requests
"""

# Import Flask core utilities
# Flask → main application object
# jsonify → send JSON responses
# request → read incoming HTTP requests
from flask import Flask, jsonify, request

# Enable Cross-Origin Resource Sharing (CORS)
# Required to allow frontend (Vite/React) to call backend
from flask_cors import CORS

# JWT Manager for handling authentication tokens
from flask_jwt_extended import JWTManager

# Import application configuration (secret keys, DB URL, etc.)
from config import Config

# Import database initialization function
from models import init_db

# Import authentication and employee route blueprints
from routes.auth import auth_bp
from routes.employee import emp_bp

import os

# Create Flask application instance
app = Flask(__name__)


# -------------------------------------------------
# Disable Strict Slashes (Fixes 308 Redirect Issue)
# -------------------------------------------------
# Allows both /api/auth/login and /api/auth/login/
# Prevents automatic redirect responses
app.url_map.strict_slashes = False


# -------------------------------------------------
# Load Configuration
# -------------------------------------------------
# Loads settings from config.py (JWT secret, DB URI, etc.)
app.config.from_object(Config)


# -------------------------------------------------
# Enable CORS
# -------------------------------------------------
# Allows frontend at localhost:5173 to access backend APIs
# Supports Authorization header for JWT
# Allows cookies/credentials if needed
# Enable CORS (Local + Production)
# CORS(
#     app,
#     resources={r"/api/*": {
#         "origins": [
#             "http://localhost:5173",
#             "https://employee-info-crud-frontend.vercel.app",
#             "http://localhost:3000",
#         ]
#     }},
#     supports_credentials=True,
#     allow_headers=["Content-Type", "Authorization"]
# )

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
)



# -------------------------------------------------
# Initialize JWT Authentication
# -------------------------------------------------
# Enables JWT-based login system
# Handles token creation and validation
jwt = JWTManager(app)


# -------------------------------------------------
# Initialize MongoDB Connection
# -------------------------------------------------
# Connects Flask app to MongoDB using configuration
init_db(app)


# -------------------------------------------------
# Handle Preflight (OPTIONS) Requests
# -------------------------------------------------
# Browsers send OPTIONS request before actual API call
# This function prevents CORS-related blocking
@app.before_request
def handle_options():
    # If request is preflight OPTIONS
    if request.method == "OPTIONS":
        return jsonify({}), 200


# -------------------------------------------------
# Register API Routes
# -------------------------------------------------
# Attach authentication routes under /api/auth
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# Attach employee CRUD routes under /api/employees
app.register_blueprint(emp_bp, url_prefix="/api/employees")


# -------------------------------------------------
# Root Test Route
# -------------------------------------------------
# Used to verify backend is running
@app.route("/")
def home():
    return "Flask Backend Running ✅"


# -------------------------------------------------
# Application Entry Point
# -------------------------------------------------
# Runs server when file is executed directly
if __name__ == "__main__":

    # Print startup message
    print("Starting Flask Server...")

    # Start Flask development server
    # debug=True enables auto reload & error debugger
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
