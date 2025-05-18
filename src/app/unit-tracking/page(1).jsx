"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [units, setUnits] = useState([
    { id: "UNIT001", name: "Forklift A" },
    { id: "UNIT002", name: "Crane B" },
    { id: "UNIT003", name: "Loader C" },
  ]);

  const [usageHistory, setUsageHistory] = useState([
    {
      id: 1,
      unit: "Forklift A",
      user: "John Doe",
      startTime: "2025-01-15 09:00",
      endTime: "2025-01-15 17:00",
      status: "completed",
      notes: "Regular operation",
    },
    {
      id: 2,
      unit: "Crane B",
      user: "Jane Smith",
      startTime: "2025-01-16 08:00",
      status: "active",
      notes: "Construction project",
    },
  ]);

  const [selectedUnit, setSelectedUnit] = useState("");
  const [startTime, setStartTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUsage = {
      id: usageHistory.length + 1,
      unit: selectedUnit,
      user: user.email,
      startTime,
      status: "active",
      notes,
    };
    setUsageHistory([newUsage, ...usageHistory]);
    setSelectedUnit("");
    setStartTime("");
    setNotes("");
  };

  const handleReportIssue = (id) => {
    const updatedHistory = usageHistory.map((item) => {
      if (item.id === id) {
        return { ...item, status: "trouble" };
      }
      return item;
    });
    setUsageHistory(updatedHistory);
  };

  const handleExport = (format) => {
    console.error("Export functionality needs to be implemented");
    setError("Export feature coming soon");
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
          <div className="flex space-x-4">
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
            >
              <i className="fa-solid fa-file-pdf mr-2"></i>
              Export PDF
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
            >
              <i className="fa-solid fa-file-excel mr-2"></i>
              Export Excel
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Borrow Equipment
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                name="unit"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                required
              >
                <option value="">Select a unit</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                name="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                rows="3"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-white hover:bg-[#2E69DE]"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Usage History
          </h2>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Unit
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    User
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Start Time
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    End Time
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Notes
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.map((usage) => (
                  <tr key={usage.id} className="border-b last:border-0">
                    <td className="py-4">{usage.unit}</td>
                    <td className="py-4">{usage.user}</td>
                    <td className="py-4">{usage.startTime}</td>
                    <td className="py-4">{usage.endTime || "-"}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          usage.status === "active"
                            ? "bg-green-100 text-green-700"
                            : usage.status === "trouble"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {usage.status}
                      </span>
                    </td>
                    <td className="py-4">{usage.notes}</td>
                    <td className="py-4">
                      {usage.status === "active" && (
                        <button
                          onClick={() => handleReportIssue(usage.id)}
                          className="rounded-lg bg-red-50 px-3 py-1 text-sm text-red-600 hover:bg-red-100"
                        >
                          Report Issue
                        </button>
                      )}
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