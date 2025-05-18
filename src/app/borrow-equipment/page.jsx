"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = use-User();
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [error, setError] = useState(null);
  const [borrowForm, setBorrowForm] = useState({
    equipmentId: "",
    startDate: "",
    endDate: "",
    purpose: "",
  });

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("/api/equipment/list", { method: "POST" });
        if (!response.ok) {
          throw new Error("Failed to fetch equipment");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setAvailableEquipment(
          data.equipment.filter((e) => e.status === "available")
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load available equipment");
      }
    };

    const fetchBorrowRequests = async () => {
      try {
        const response = await fetch("/api/equipment/borrow-requests", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch borrow requests");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setBorrowRequests(data.requests);
      } catch (err) {
        console.error(err);
        setError("Failed to load borrow requests");
      }
    };

    if (user) {
      fetchEquipment();
      fetchBorrowRequests();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/equipment/request-borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(borrowForm),
      });

      if (!response.ok) {
        throw new Error("Failed to submit borrow request");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setBorrowForm({
        equipmentId: "",
        startDate: "",
        endDate: "",
        purpose: "",
      });

      // Refresh borrow requests
      const requestsResponse = await fetch("/api/equipment/borrow-requests", {
        method: "POST",
      });
      const requestsData = await requestsResponse.json();
      setBorrowRequests(requestsData.requests);
    } catch (err) {
      console.error(err);
      setError("Failed to submit borrow request");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="mb-4 text-xl text-gray-600">
          Please sign in to borrow equipment
        </div>
        <a
          href="/account/signin"
          className="rounded-lg bg-[#357AFF] px-6 py-2 text-white hover:bg-[#2E69DE]"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Equipment Borrowing
          </h1>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Available Equipment
            </h2>
            <div className="space-y-4">
              {availableEquipment.map((equipment) => (
                <div
                  key={equipment.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {equipment.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {equipment.type}
                      </div>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                      Available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Borrow Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Equipment
                </label>
                <select
                  name="equipmentId"
                  value={borrowForm.equipmentId}
                  onChange={(e) =>
                    setBorrowForm({
                      ...borrowForm,
                      equipmentId: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                  required
                >
                  <option value="">Select Equipment</option>
                  {availableEquipment.map((equipment) => (
                    <option key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={borrowForm.startDate}
                  onChange={(e) =>
                    setBorrowForm({ ...borrowForm, startDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={borrowForm.endDate}
                  onChange={(e) =>
                    setBorrowForm({ ...borrowForm, endDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purpose
                </label>
                <textarea
                  name="purpose"
                  value={borrowForm.purpose}
                  onChange={(e) =>
                    setBorrowForm({ ...borrowForm, purpose: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                  rows="3"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-white hover:bg-[#2E69DE]"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            My Borrow Requests
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Equipment
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Start Date
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    End Date
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {borrowRequests.map((request) => (
                  <tr key={request.id} className="border-b last:border-0">
                    <td className="py-4">{request.equipment_name}</td>
                    <td className="py-4">
                      {new Date(request.start_date).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      {new Date(request.end_date).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          request.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : request.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;