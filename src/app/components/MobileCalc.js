"use client";
import { useState } from "react";
import { FaCalculator } from "react-icons/fa";

export default function CalculatorPopup() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col items-center ml-2">
            {/* Button to open popup */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
                <FaCalculator className="text-white text-xl" />
            </button>

            {/* Calculator Popup */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <Calculator onClose={() => setIsOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}

function Calculator({ onClose }) {
    const [expression, setExpression] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const calculateResult = () => {
        setError(""); // Reset error

        try {
            if (!expression) {
                setError("Please enter a valid expression!");
                return;
            }

            // Prevent division by zero
            if (expression.includes("/0")) {
                setError("Cannot divide by zero!");
                return;
            }

            // Evaluate the expression safely
            const calculatedResult = eval(expression);
            setResult(calculatedResult);
        } catch (err) {
            setError("Invalid expression!");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            calculateResult();
        }
    };

    const clearInput = () => {
        setExpression("");
        setResult(null);
        setError("");
    };

    return (
        <div className="relative w-full z-60">
            {/* Close Button */}
            <button
    onClick={onClose}
    className="absolute -top-6 -right-6 bg-gray-300 h-8 w-8 rounded-md flex items-center justify-center text-red-600 font-bold text-2xl
        transition duration-300 ease-in-out transform hover:bg-red-600 hover:text-white hover:scale-110 hover:shadow-lg"
>
    ×
</button>

            <h2 className="text-2xl font-bold text-center mb-4 text-blue-800">🧮 Smart Calculator</h2>

            {/* Input Box */}
            <input
                type="text"
                placeholder="Enter expression (e.g., 12+0.9)"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-2 mb-3 border rounded text-black font-semibold text-lg text-center"
            />

            {/* Buttons */}
            <div className="flex justify-center gap-3 mb-3">
                <button
                    onClick={calculateResult}
                    className="px-4 py-2 bg-green-500 text-white rounded text-lg font-bold"
                >
                    =
                </button>
                <button
                    onClick={clearInput}
                    className="px-4 py-2 bg-gray-500 text-white rounded text-lg font-bold"
                >
                    C
                </button>
            </div>

            {/* Display Result */}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {result !== null && (
                <p className="text-lg font-bold text-center mt-3 text-blue-800">
                    Result: {(result).toFixed(2)}
                </p>
            )}
        </div>
    );
}
