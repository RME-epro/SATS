"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [dateRange, setDateRange] = useState("month");
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch("/api/reports/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timeframe: dateRange }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch report data");
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setReportData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load report data");
      }
    };

    if (user) {
      fetchReportData();
    }
  }, [user, dateRange]);

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const response = await fetch("/api/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeframe: dateRange }),
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${dateRange}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      setError("Failed to export data");
    }
    setExportLoading(false);
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
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Advanced Analytics Report
          </h1>
          <div className="flex flex-col gap-4 sm:flex-row">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button
              onClick={handleExportData}
              disabled={exportLoading}
              className="flex items-center justify-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE] disabled:bg-gray-400"
            >
              {exportLoading ? (
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fa-solid fa-download mr-2"></i>
              )}
              Export Report
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Equipment Usage
            </h2>
            <div className="h-[300px] w-full">
              {reportData?.equipmentUsage && (
                <div className="flex h-full items-center justify-center text-gray-500">
                  [Equipment Usage Chart Placeholder]
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Borrowing Trends
            </h2>
            <div className="h-[300px] w-full">
              {reportData?.borrowingTrends && (
                <div className="flex h-full items-center justify-center text-gray-500">
                  [Borrowing Trends Chart Placeholder]
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Checklist Completion
            </h2>
            <div className="h-[300px] w-full">
              {reportData?.checklistStats && (
                <div className="flex h-full items-center justify-center text-gray-500">
                  [Checklist Stats Chart Placeholder]
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Performance Metrics
            </h2>
            <div className="space-y-4">
              {reportData?.performanceMetrics && (
                <>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Average Response Time</span>
                    <span className="font-medium text-gray-800">
                      {reportData.performanceMetrics.avgResponseTime} hours
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Equipment Utilization</span>
                    <span className="font-medium text-gray-800">
                      {reportData.performanceMetrics.utilization}%
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">
                      Maintenance Compliance
                    </span>
                    <span className="font-medium text-gray-800">
                      {reportData.performanceMetrics.maintenanceCompliance}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User Satisfaction</span>
                    <span className="font-medium text-gray-800">
                      {reportData.performanceMetrics.userSatisfaction}/5
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;