"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = use-User();
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    equipment_id: "",
    start_time: "",
    notes: "",
  });

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch("/api/equipment/list", { method: "POST" });
        if (!response.ok) {
          throw new Error("Failed to fetch units");
        }
        const data = await response.json();
        setUnits(data.equipment || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load units");
      }
    };

    if (user) {
      fetchUnits();
    }
  }, [user]);

  const handleStartTracking = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/equipment-tracking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start tracking");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setFormData({
        equipment_id: "",
        start_time: "",
        notes: "",
      });

      // Refresh units list after tracking
      const updatedUnitsResponse = await fetch("/api/equipment/list", {
        method: "POST",
      });
      const updatedUnitsData = await updatedUnitsResponse.json();
      setUnits(updatedUnitsData.equipment || []);
    } catch (err) {
      console.error(err);
      setError("Failed to start tracking unit");
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
          Please sign in to access unit tracking
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
          <h1 className="text-2xl font-bold text-gray-800">Unit Tracking</h1>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Available Units
            </h2>
            <div className="space-y-4">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <div className="font-medium text-gray-800">{unit.name}</div>
                    <div className="text-sm text-gray-600">{unit.type}</div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      unit.status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {unit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Record Unit Usage
            </h2>
            <form onSubmit={handleStartTracking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Unit
                </label>
                <select
                  name="equipment_id"
                  value={formData.equipment_id}
                  onChange={(e) =>
                    setFormData({ ...formData, equipment_id: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                  required
                >
                  <option value="">Choose a unit</option>
                  {units
                    .filter((unit) => unit.status === "available")
                    .map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} - {unit.type}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                  rows="3"
                  placeholder="Enter usage details or notes"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-white hover:bg-[#2E69DE]"
              >
                Start Tracking
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Usage History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Unit
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Start Time
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Notes
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {trackingHistory.map((record) => (
                  <tr key={record.id} className="border-b last:border-0">
                    <td className="py-4">{record.unit_name}</td>
                    <td className="py-4">{record.start_time}</td>
                    <td className="py-4">{record.user_name}</td>
                    <td className="py-4">{record.notes}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          record.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {record.status}
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