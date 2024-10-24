// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaSmile, FaMeh, FaFrown } from "react-icons/fa";

const App = () => {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const testPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/test_password",
        { password }
      );
      setStrength(response.data.strength);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error testing password strength:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getStrengthIcon = (strength) => {
    if (strength === "Strong")
      return <FaSmile className="text-green-500 text-2xl" />;
    if (strength === "Medium")
      return <FaMeh className="text-yellow-500 text-2xl" />;
    if (strength === "Weak")
      return <FaFrown className="text-red-500 text-2xl" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Password Strength Tester
        </h1>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border border-gray-300 rounded pr-10"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          onClick={testPassword}
        >
          Test Strength
        </button>
        {strength && (
          <div className="mt-4 text-center">
            <div className="font-bold text-2xl mb-2">
              {getStrengthIcon(strength)}
            </div>
            <div
              className={`font-bold ${
                strength === "Strong"
                  ? "text-green-500"
                  : strength === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {strength}
            </div>
            {strength !== "Strong" && (
              <ul className="mt-2 text-left list-disc list-inside text-sm text-gray-700">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
