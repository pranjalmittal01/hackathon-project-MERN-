// frontend/src/pages/Confirmation.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-2xl font-bold text-green-700">Registration Successful!</h2>
        <p className="text-gray-700 mt-2">You will receive confirmation by email.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
