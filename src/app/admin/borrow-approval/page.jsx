"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = use-User();
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchBorrowRequests = async () => {
      try {
        const response = await fetch("/api/equipment/pending-requests", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch pending requests");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setBorrowRequests(data.requests);
      } catch (err) {
        console.error(err);
        setError("Failed to load pending requests");
      }
    };

    if (user) {
      fetchBorrowRequests();
    }
  }, [user]);

  const handleApproval = async (requestId, status) => {
    try {
      const response = await fetch("/api/equipment/update-request-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setBorrowRequests(borrowRequests.filter((req) => req.id !== requestId));
      setSelectedRequest(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update request status");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || !["superadmin", "kepala departemen"].includes(user.role)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="mb-4 text-xl text-gray-600">
          Access denied. Admin privileges required.
        </div>
        <a
          href="/"
          className="rounded-lg bg-[#357AFF] px-6 py-2 text-white hover:bg-[#2E69DE]"
        >
          Return Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Equipment Borrow Approval
          </h1>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Pending Requests
            </h2>
            <div className="space-y-4">
              {borrowRequests.map((request) => (
                <div
                  key={request.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-[#357AFF] ${
                    selectedRequest?.id === request.id
                      ? "border-[#357AFF]"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {request.equipment_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Requested by: {request.user_name}
                      </div>
                    </div>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
              {borrowRequests.length === 0 && (
                <div className="text-center text-gray-600">
                  No pending requests
                </div>
              )}
            </div>
          </div>

          {selectedRequest && (
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Request Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Equipment
                  </label>
                  <div className="mt-1 text-gray-800">
                    {selectedRequest.equipment_name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Requested By
                  </label>
                  <div className="mt-1 text-gray-800">
                    {selectedRequest.user_name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <div className="mt-1 text-gray-800">
                    {selectedRequest.department}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Borrow Period
                  </label>
                  <div className="mt-1 text-gray-800">
                    {new Date(selectedRequest.start_date).toLocaleDateString()}{" "}
                    - {new Date(selectedRequest.end_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Purpose
                  </label>
                  <div className="mt-1 text-gray-800">
                    {selectedRequest.purpose}
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() =>
                      handleApproval(selectedRequest.id, "approved")
                    }
                    className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                  >
                    <i className="fa-solid fa-check mr-2"></i>
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleApproval(selectedRequest.id, "rejected")
                    }
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    <i className="fa-solid fa-times mr-2"></i>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;