"""
File: routes/employee.py

Purpose:
- Handles full CRUD (Create, Read, Update, Delete) operations
  for Employee records.
- Ensures strict validation before database operations.
- Protects all routes using JWT authentication.
- Restricts employees to their respective logged-in user.

Security:
- JWT required for all routes
- Employees are linked using "createdBy"
- Users cannot access or modify other users' employees

Validation:
- Name → Only letters allowed
- Email → Valid format required
- Department & Designation → Only text allowed
- Salary → Must be positive numeric
"""

# Import Flask utilities
# Blueprint → Organizes routes
# request → Access incoming JSON
# jsonify → Return JSON response
from flask import Blueprint, request, jsonify

# MongoDB connection instance
from models import mongo

# JWT protection utilities
# jwt_required → Protect route
# get_jwt_identity → Get logged-in user ID
from flask_jwt_extended import jwt_required, get_jwt_identity

# Import validation helper functions
from utils.validators import (
    validate_salary,
    validate_email_format,
    validate_name,
    validate_text_field,
)

# Required to convert string ID into MongoDB ObjectId
from bson import ObjectId


# Create Blueprint for employee routes
emp_bp = Blueprint("employee", __name__)


# =====================================================
#                    CREATE EMPLOYEE
# =====================================================
@emp_bp.route("", methods=["POST"])
@jwt_required()  # 🔐 Route protected with JWT
def create_employee():
    """
    Route: POST /employees

    Purpose:
    - Create a new employee record
    - Validate all fields
    - Ensure no duplicate email per user
    - Save employee under logged-in user
    """

    # Get request body JSON
    data = request.get_json()

    # Get logged-in user ID from JWT
    user_id = get_jwt_identity()

    # Extract fields safely with default empty string
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    department = data.get("department", "").strip()
    designation = data.get("designation", "").strip()
    salary = data.get("salary")

    # Debug log
    print("Add Employee:", data)

    # ---------------- VALIDATION ----------------

    # Validate name
    if not validate_name(name):
        return jsonify({"error": "Invalid Name"}), 400

    # Validate email format
    if not validate_email_format(email):
        return jsonify({"error": "Invalid Email"}), 400

    # Validate department text
    if not validate_text_field(department):
        return jsonify({"error": "Invalid Department"}), 400

    # Validate designation text
    if not validate_text_field(designation):
        return jsonify({"error": "Invalid Role"}), 400

    # Validate salary numeric & > 0
    if not validate_salary(salary):
        return jsonify({"error": "Invalid Salary"}), 400

    # ---------------- DUPLICATE CHECK ----------------
    # Prevent duplicate employee email for same user
    if mongo.db.employees.find_one({
        "email": email,
        "createdBy": user_id
    }):
        return jsonify({"error": "Email already exists"}), 400

    # ---------------- INSERT INTO DATABASE ----------------
    mongo.db.employees.insert_one({
        "name": name,
        "email": email,
        "department": department,
        "designation": designation,
        "salary": int(salary),
        "createdBy": user_id  # Link employee to user
    })

    return jsonify({"message": "Employee Added"}), 201


# =====================================================
#                    READ EMPLOYEES
# =====================================================
@emp_bp.route("", methods=["GET"])
@jwt_required()
def get_employees():
    """
    Route: GET /employees

    Purpose:
    - Fetch all employees created by logged-in user
    - Convert MongoDB ObjectId to string
    """

    # Get logged-in user ID
    user_id = get_jwt_identity()

    # Fetch employees belonging to this user only
    employees = list(
        mongo.db.employees.find({"createdBy": user_id})
    )

    # Convert ObjectId to string for JSON response
    for emp in employees:
        emp["_id"] = str(emp["_id"])

    return jsonify(employees)


# =====================================================
#                    UPDATE EMPLOYEE
# =====================================================
@emp_bp.route("/<id>", methods=["PUT"])
@jwt_required()
def update_employee(id):
    """
    Route: PUT /employees/<id>

    Purpose:
    - Update employee details
    - Validate all fields
    - Prevent duplicate email
    - Ensure user owns the employee
    """

    data = request.get_json()
    user_id = get_jwt_identity()

    # Extract and clean fields
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    department = data.get("department", "").strip()
    designation = data.get("designation", "").strip()
    salary = data.get("salary")

    print("Update:", data)

    # ---------------- VALIDATION ----------------

    if not validate_name(name):
        return jsonify({"error": "Invalid Name"}), 400

    if not validate_email_format(email):
        return jsonify({"error": "Invalid Email"}), 400

    if not validate_text_field(department):
        return jsonify({"error": "Invalid Department"}), 400

    if not validate_text_field(designation):
        return jsonify({"error": "Invalid Role"}), 400

    if not validate_salary(salary):
        return jsonify({"error": "Invalid Salary"}), 400

    # ---------------- DUPLICATE CHECK ----------------
    # Exclude current employee ID from duplicate check
    if mongo.db.employees.find_one({
        "email": email,
        "createdBy": user_id,
        "_id": {"$ne": ObjectId(id)}
    }):
        return jsonify({"error": "Email already exists"}), 400

    # ---------------- UPDATE DATABASE ----------------
    result = mongo.db.employees.update_one(
        {"_id": ObjectId(id), "createdBy": user_id},
        {
            "$set": {
                "name": name,
                "email": email,
                "department": department,
                "designation": designation,
                "salary": int(salary),
            }
        }
    )

    # If no document matched → user not authorized
    if result.matched_count == 0:
        return jsonify({"error": "Not authorized"}), 403

    return jsonify({"message": "Updated"})


# =====================================================
#                    DELETE EMPLOYEE
# =====================================================
@emp_bp.route("/<id>", methods=["DELETE"])
@jwt_required()
def delete_employee(id):
    """
    Route: DELETE /employees/<id>

    Purpose:
    - Delete employee record
    - Ensure user owns the employee
    """

    user_id = get_jwt_identity()

    # Delete only if employee belongs to logged-in user
    result = mongo.db.employees.delete_one({
        "_id": ObjectId(id),
        "createdBy": user_id
    })

    # If nothing deleted → not authorized
    if result.deleted_count == 0:
        return jsonify({"error": "Not authorized"}), 403

    return jsonify({"message": "Deleted"})
