"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [selectedTemplate, setSelectedTemplate] = useState("daily");
  const [error, setError] = useState(null);
  const [checklistItems, setChecklistItems] = useState({});

  const templates = {
    daily: {
      name: "Daily Equipment Check",
      items: [
        "Check oil levels",
        "Inspect tire pressure",
        "Test emergency brakes",
        "Check fuel levels",
        "Verify safety equipment",
      ],
    },
    weekly: {
      name: "Weekly Maintenance",
      items: [
        "Complete fluid inspection",
        "Test all lights and signals",
        "Check battery condition",
        "Inspect belts and hoses",
        "Review safety systems",
      ],
    },
  };

  const [history] = useState([
    {
      id: 1,
      template: "Daily Equipment Check",
      completedBy: "John Doe",
      date: "2025-01-15",
      status: "completed",
    },
    {
      id: 2,
      template: "Weekly Maintenance",
      completedBy: "Jane Smith",
      date: "2025-01-14",
      status: "incomplete",
    },
  ]);

  const handleChecklistSubmit = (e) => {
    e.preventDefault();
    console.error("Submit functionality needs to be implemented");
    setError("Submit feature coming soon");
  };

  const handleExport = () => {
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
          Please sign in to access checklists
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
            Equipment Checklist
          </h1>
          <button
            onClick={handleExport}
            className="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            <i className="fa-solid fa-file-export mr-2"></i>
            Export PDF
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              New Checklist
            </h2>
            <form onSubmit={handleChecklistSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Template
                </label>
                <select
                  name="template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                >
                  <option value="daily">Daily Equipment Check</option>
                  <option value="weekly">Weekly Maintenance</option>
                </select>
              </div>

              <div className="space-y-4">
                {templates[selectedTemplate].items.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`item-${index}`}
                      checked={
                        checklistItems[`${selectedTemplate}-${index}`] || false
                      }
                      onChange={(e) =>
                        setChecklistItems({
                          ...checklistItems,
                          [`${selectedTemplate}-${index}`]: e.target.checked,
                        })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-[#357AFF]"
                    />
                    <label className="ml-3 text-gray-700">{item}</label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-white hover:bg-[#2E69DE]"
                >
                  Submit Checklist
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Available Templates
            </h2>
            <div className="space-y-4">
              {Object.entries(templates).map(([key, template]) => (
                <div
                  key={key}
                  className="rounded-lg border border-gray-200 p-4 hover:border-[#357AFF]"
                >
                  <h3 className="mb-2 font-medium text-gray-800">
                    {template.name}
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                    {template.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-800">History</h2>
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
                    Template
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Completed By
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Date
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-b last:border-0">
                    <td className="py-4">{record.template}</td>
                    <td className="py-4">{record.completedBy}</td>
                    <td className="py-4">{record.date}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          record.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
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