"""
File: config.py

Purpose:
- Centralized configuration file for the Flask application
- Loads environment variables securely
- Stores sensitive credentials (DB URI, JWT secret)
- Prevents hardcoding secrets in source code


"""

# Import OS module to access environment variables
import os

# Import dotenv utility to load .env file into environment
from dotenv import load_dotenv


# Load variables from .env file into system environment
# This allows access using os.getenv()
load_dotenv()


class Config:
    """
    Configuration class for Flask application.

    This class holds all important environment-based settings.
    It is loaded into Flask using:

        app.config.from_object(Config)

    so that these variables become available throughout the app.
    """

    # -------------------------------------------------
    # MongoDB Connection URI
    # -------------------------------------------------
    # Loaded from .env file
    # Example:
    # MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
    MONGO_URI = os.getenv("MONGO_URI")

    # -------------------------------------------------
    # JWT Secret Key
    # -------------------------------------------------
    # Used to sign and verify JWT tokens
    # Must be kept secret for security
    # Example:
    # JWT_SECRET=supersecretkey123
    JWT_SECRET_KEY = os.getenv("JWT_SECRET")
