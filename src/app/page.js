"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import jwt_decode from "jwt-decode";

export default function Home() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [uhid, setUhid] = useState(null);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Decode JWT to get uhid (sub)
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        console.log("Decoded Token:", decoded);
        setUhid(decoded.sub); // sub contains the uhid
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const res = await fetch(`http://127.0.0.1:8000/reset_password?token=${token}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uhid: uhid,
    new_password: password,
  }),
});


    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      alert(`Error: ${data.detail}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        {submitted ? (
          <p className="text-green-600 text-center">
            Your password has been reset successfully!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
