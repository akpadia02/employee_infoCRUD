"""
File: models.py

Purpose:
- Initializes and manages MongoDB connection
- Provides a reusable 'mongo' instance across the application
- Connects Flask app with MongoDB using Flask-PyMongo

Why This File Exists:
- Keeps database setup separate from app.py
- Improves modular structure
- Allows database access from any route file
- Follows clean architecture principles

Flow:
Flask App → init_db(app) → mongo.init_app(app) → MongoDB Connected
"""

# Import Flask-PyMongo extension
# PyMongo simplifies MongoDB integration in Flask
from flask_pymongo import PyMongo


# Create a global PyMongo instance
# This object will be initialized later with the Flask app
# and then reused throughout the project
mongo = PyMongo()


def init_db(app):
    """
    Initializes MongoDB with the Flask application.

    Parameters:
    - app: Flask application instance

    Purpose:
    - Binds MongoDB connection to Flask app
    - Uses MONGO_URI from app.config (loaded in config.py)
    - Enables use of mongo.db inside route files

    Example Usage in Routes:
        mongo.db.users.find_one({...})
        mongo.db.employees.insert_one({...})
    """

    # Attach the Flask app to the PyMongo instance
    # This reads MONGO_URI from app configuration
    mongo.init_app(app)

    # Print confirmation message in console
    print("MongoDB Connected ✅")
