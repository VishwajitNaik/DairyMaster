"use client";
import { useEffect, useState } from "react";

export default function CheckRedis() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Connecting to Redis...");

  useEffect(() => {
    const testRedis = async () => {
      try {
        // Step 1: Set a value in Redis
        setStatus("Setting value in Redis...");
        const setResponse = await fetch("/api/redis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "hello", value: "world" }),
        });

        if (!setResponse.ok) throw new Error("Failed to set value in Redis");

        // Step 2: Get the value from Redis
        setStatus("Fetching value from Redis...");
        const response = await fetch("/api/redis?key=hello");
        const data = await response.json();

        if (response.ok && data.value) {
          setResult(data.value);
          setStatus("✅ Redis interaction successful!");
        } else {
          setResult("");
          setStatus(`❌ Redis GET failed: ${data.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Redis Error:", error);
        setStatus(`❌ Redis Error: ${error.message}`);
      }
    };
    testRedis();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">🔍 Redis Check</h2>
      <p className="mb-3 text-blue-700">{status}</p>
      <p className="text-green-600">Redis Value: {result || "N/A"}</p>
    </div>
  );
}
