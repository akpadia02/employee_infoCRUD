# utils/validators.py
# Strong Validation Rules

import re
from email_validator import validate_email, EmailNotValidError


# ================= EMAIL =================
# ================= EMAIL =================
def validate_email_format(email):

    import re

    pattern = r"^(?!.*\.\.)[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{4,28})[a-zA-Z0-9]@gmail\.com$"

    return bool(re.fullmatch(pattern, email))



# ================= PASSWORD =================
def validate_password(password):
    # Minimum 6 characters
    return len(password) >= 6


# ================= NAME =================
def validate_name(name):
    # Only letters + spaces (2–50 chars)
    return bool(re.fullmatch(r"[A-Za-z ]{2,50}", name))


# ================= TEXT FIELD =================
def validate_text_field(value):
    # For department / role (letters only)
    return bool(re.fullmatch(r"[A-Za-z ]{2,50}", value))


# ================= SALARY =================
def validate_salary(salary):
    try:
        salary = int(salary)
        return salary > 0
    except:
        return False
