"use client";
import React from "react";

function MainComponent() {
  const [selectedSection, setSelectedSection] = useState("overview");
  const { data: user, loading } = use-User();
  const [error, setError] = useState(null);

  const metrics = [
    { title: "Total Units", value: "157", icon: "fa-boxes" },
    { title: "Tasks Complete", value: "24", icon: "fa-check-circle" },
    { title: "Storage Used", value: "75%", icon: "fa-database" },
    { title: "Active Projects", value: "12", icon: "fa-project-diagram" },
  ];

  const recentActivity = [
    {
      action: "Unit ABC123 tracked",
      time: "2 hours ago",
      icon: "fa-location-dot",
    },
    { action: "Checklist updated", time: "3 hours ago", icon: "fa-list-check" },
    { action: "Storage space added", time: "5 hours ago", icon: "fa-plus" },
    { action: "New unit registered", time: "1 day ago", icon: "fa-box" },
  ];

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
          Please sign in to access the dashboard
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col md:flex-row">
        <nav className="bg-white p-6 md:h-screen md:w-64 md:shadow-lg">
          <div className="mb-8 text-2xl font-bold text-gray-800">Dashboard</div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setSelectedSection("overview")}
              className={`flex items-center rounded-lg px-4 py-2 text-left ${
                selectedSection === "overview"
                  ? "bg-[#357AFF] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <i className="fa-solid fa-chart-line mr-3"></i>
              Overview
            </button>
            <button
              onClick={() => setSelectedSection("units")}
              className={`flex items-center rounded-lg px-4 py-2 text-left ${
                selectedSection === "units"
                  ? "bg-[#357AFF] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <i className="fa-solid fa-box mr-3"></i>
              Unit Tracking
            </button>
            <button
              onClick={() => setSelectedSection("checklist")}
              className={`flex items-center rounded-lg px-4 py-2 text-left ${
                selectedSection === "checklist"
                  ? "bg-[#357AFF] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <i className="fa-solid fa-list-check mr-3"></i>
              Checklist
            </button>
            <button
              onClick={() => setSelectedSection("storage")}
              className={`flex items-center rounded-lg px-4 py-2 text-left ${
                selectedSection === "storage"
                  ? "bg-[#357AFF] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <i className="fa-solid fa-warehouse mr-3"></i>
              Storage
            </button>
          </div>
        </nav>

        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user.email}
            </h1>
            <a
              href="/account/logout"
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
            >
              Sign Out
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <div key={index} className="rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 text-[#357AFF]">
                  <i className={`fa-solid ${metric.icon} text-2xl`}></i>
                </div>
                <div className="text-sm text-gray-600">{metric.title}</div>
                <div className="text-2xl font-bold text-gray-800">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="mr-4 rounded-full bg-[#357AFF] bg-opacity-10 p-3 text-[#357AFF]">
                    <i className={`fa-solid ${activity.icon}`}></i>
                  </div>
                  <div>
                    <div className="text-gray-800">{activity.action}</div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainComponent;