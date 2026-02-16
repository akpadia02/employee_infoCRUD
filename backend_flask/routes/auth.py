"""
File: auth.py
Purpose:
- Handles authentication-related API routes (Register & Login)
- Validates user credentials
- Stores new users in MongoDB
- Verifies login credentials
- Generates JWT tokens for authenticated sessions

Flow:
Frontend → Flask API → Validation → MongoDB → JWT → Response

Responsibilities:
1. Register new users securely
2. Prevent duplicate accounts
3. Encrypt passwords using bcrypt
4. Authenticate users during login
5. Issue JWT tokens for session management
"""

# Import Blueprint to organize routes
# request → get incoming JSON data
# jsonify → send JSON responses
from flask import Blueprint, request, jsonify

# Import MongoDB connection instance
from models import mongo

# Import validation helper functions
# These functions check email format and password strength
from utils.validators import (
    validate_email_format,
    validate_password
)

# bcrypt is used for secure password hashing
import bcrypt

# Used to generate JWT tokens after successful login
from flask_jwt_extended import create_access_token


# Create Blueprint for authentication routes
# All auth-related endpoints will be grouped here
auth_bp = Blueprint("auth", __name__)


# =====================================================
#                    REGISTER ROUTE
# =====================================================
@auth_bp.route("register", methods=["POST"])
def register():
    """
    Route: POST /register

    Purpose:
    - Registers a new user
    - Validates input fields
    - Encrypts password
    - Stores user in database

    Expected JSON Input:
    {
        "name": "User Name",
        "email": "user@gmail.com",
        "password": "password123"
    }

    Response:
    - 201 → Success
    - 400 → Validation / Duplicate Error
    """

    # Get JSON data sent from frontend
    data = request.get_json()

    # Extract individual fields safely
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # Debug log (helps during development)
    print("Register:", email)

    # -------------------------------------------------
    # Basic Empty Field Validation
    # -------------------------------------------------
    # Check if any required field is missing
    if not name or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    # -------------------------------------------------
    # Email Format Validation
    # -------------------------------------------------
    # Calls helper function to check email pattern
    if not validate_email_format(email):
        return jsonify({"error": "Invalid email format"}), 400

    # -------------------------------------------------
    # Password Strength Validation
    # -------------------------------------------------
    # Ensures password meets minimum requirements
    if not validate_password(password):
        return jsonify({"error": "Password must be 6+ chars"}), 400

    # -------------------------------------------------
    # Duplicate Email Check
    # -------------------------------------------------
    # Prevent creating multiple accounts with same email
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    # -------------------------------------------------
    # Password Hashing
    # -------------------------------------------------
    # Convert password to bytes and hash using bcrypt
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    # -------------------------------------------------
    # Store User in Database
    # -------------------------------------------------
    # Insert new user document into MongoDB
    mongo.db.users.insert_one({
        "name": name,
        "email": email,
        "password": hashed  # Store hashed password only
    })

    # Return success response
    return jsonify({"message": "Registered Successfully"}), 201


# =====================================================
#                     LOGIN ROUTE
# =====================================================
@auth_bp.route("login", methods=["POST"])
def login():
    """
    Route: POST /login

    Purpose:
    - Authenticates existing user
    - Verifies password
    - Generates JWT token

    Expected JSON Input:
    {
        "email": "user@gmail.com",
        "password": "password123"
    }

    Response:
    - 200 → Login Success (JWT Token)
    - 400 → Invalid Credentials
    """

    # Get JSON data from frontend
    data = request.get_json()

    # Extract email and password
    email = data.get("email")
    password = data.get("password")

    # Debug log
    print("Login:", email)

    # -------------------------------------------------
    # Empty Field Validation
    # -------------------------------------------------
    # Ensure both fields are provided
    if not email or not password:
        return jsonify({"error": "All fields required"}), 400

    # -------------------------------------------------
    # Fetch User from Database
    # -------------------------------------------------
    # Find user document using email
    user = mongo.db.users.find_one({"email": email})

    # If user does not exist
    if not user:
        return jsonify({"error": "Invalid credentials"}), 400

    # -------------------------------------------------
    # Password Verification
    # -------------------------------------------------
    # Compare entered password with stored hash
    if not bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 400

    # -------------------------------------------------
    # Generate JWT Token
    # -------------------------------------------------
    # Create access token using user's MongoDB ID
    token = create_access_token(identity=str(user["_id"]))

    # -------------------------------------------------
    # Send Response to Frontend
    # -------------------------------------------------
    # Return token and user name
    return jsonify({
        "token": token,
        "name": user["name"]
    })
