import React, { useEffect, useState } from "react";
import api from "../utils/api";

const Profile: React.FC = () => {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => setUser(res.data))
      .catch(() => setError("Not authenticated"));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {user ? (
          <>
            <div className="mb-2">
              User ID: <span className="font-semibold">{user.id}</span>
            </div>
            <div>
              Email: <span className="font-semibold">{user.email}</span>
            </div>
          </>
        ) : (
          <div className="text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
