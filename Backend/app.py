# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
from passlib.context import CryptContext

app = Flask(__name__)
CORS(app)

# Set up the password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.route('/api/test_password', methods=['POST'])
def test_password():
    data = request.json
    password = data.get('password', '')

    if not password:
        return jsonify({"error": "Password is required"}), 400

    # Evaluate password strength
    strength, suggestions = evaluate_password_strength(password)
    return jsonify({"strength": strength, "suggestions": suggestions})

def evaluate_password_strength(password):
    length = len(password)
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~" for c in password)

    score = 0
    suggestions = []

    if length >= 8:
        score += 1
    else:
        suggestions.append("Make your password at least 8 characters long.")
    if has_upper:
        score += 1
    else:
        suggestions.append("Include at least one uppercase letter.")
    if has_lower:
        score += 1
    else:
        suggestions.append("Include at least one lowercase letter.")
    if has_digit:
        score += 1
    else:
        suggestions.append("Include at least one digit.")
    if has_special:
        score += 1
    else:
        suggestions.append("Include at least one special character.")

    if score == 5:
        return "Strong", suggestions
    elif 3 <= score < 5:
        return "Medium", suggestions
    else:
        return "Weak", suggestions

if __name__ == '__main__':
    app.run(debug=True)
