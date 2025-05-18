function MainComponent() {
  const { data: user, loading } = useUser();
  const [error, setError] = useState(null);
  const [equipmentStats, setEquipmentStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0,
    borrowed: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setEquipmentStats(data.equipmentStats);
        setRecentTasks(data.recentTasks);
        setBorrowRequests(data.borrowRequests || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-600">Role: {user.role}</p>
          </div>
          <div className="flex gap-4">
            {user.role === "tekhnisi" && (
              <a
                href="/checklist"
                className="flex items-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
              >
                <i className="fa-solid fa-clipboard-check mr-2"></i>
                New Checklist
              </a>
            )}
            {user.role === "sellee" && (
              <a
                href="/borrow-equipment"
                className="flex items-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
              >
                <i className="fa-solid fa-hand-holding mr-2"></i>
                Borrow Equipment
              </a>
            )}
            {["superadmin", "kepala departemen"].includes(user.role) && (
              <>
                <a
                  href="/admin/users"
                  className="flex items-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                >
                  <i className="fa-solid fa-users-gear mr-2"></i>
                  Manage Users
                </a>
                <a
                  href="/admin/borrow-approval"
                  className="flex items-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                >
                  <i className="fa-solid fa-check-to-slot mr-2"></i>
                  Borrow Approvals
                </a>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-500">
            {error}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 text-[#357AFF]">
              <i className="fa-solid fa-boxes text-2xl"></i>
            </div>
            <div className="text-sm text-gray-600">Total Equipment</div>
            <div className="text-2xl font-bold text-gray-800">
              {equipmentStats.total}
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 text-green-500">
              <i className="fa-solid fa-check-circle text-2xl"></i>
            </div>
            <div className="text-sm text-gray-600">Available</div>
            <div className="text-2xl font-bold text-gray-800">
              {equipmentStats.available}
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 text-blue-500">
              <i className="fa-solid fa-rotate text-2xl"></i>
            </div>
            <div className="text-sm text-gray-600">In Use</div>
            <div className="text-2xl font-bold text-gray-800">
              {equipmentStats.inUse}
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 text-yellow-500">
              <i className="fa-solid fa-wrench text-2xl"></i>
            </div>
            <div className="text-sm text-gray-600">Under Maintenance</div>
            <div className="text-2xl font-bold text-gray-800">
              {equipmentStats.maintenance}
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 text-purple-500">
              <i className="fa-solid fa-hand-holding text-2xl"></i>
            </div>
            <div className="text-sm text-gray-600">Borrowed</div>
            <div className="text-2xl font-bold text-gray-800">
              {equipmentStats.borrowed}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Recent Tasks
            </h2>
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="mr-4 rounded-full bg-[#357AFF] bg-opacity-10 p-3 text-[#357AFF]">
                    <i
                      className={`fa-solid ${
                        task.type === "checklist"
                          ? "fa-clipboard-check"
                          : "fa-wrench"
                      }`}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800">{task.description}</div>
                    <div className="text-sm text-gray-500">{task.date}</div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-sm ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {task.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              {user.role === "sellee"
                ? "My Borrow Requests"
                : "Recent Borrow Requests"}
            </h2>
            <div className="space-y-4">
              {borrowRequests.map((request, index) => (
                <div
                  key={index}
                  className="flex items-center border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="mr-4 rounded-full bg-purple-100 p-3 text-purple-500">
                    <i className="fa-solid fa-hand-holding"></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800">
                      {request.equipment_name}
                      {user.role !== "sellee" && (
                        <span className="ml-2 text-sm text-gray-500">
                          by {request.user_name}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(request.request_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-sm ${
                      request.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : request.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {request.status}
                  </div>
                </div>
              ))}
              {borrowRequests.length === 0 && (
                <div className="text-center text-gray-600">
                  No borrow requests
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {user.role === "tekhnisi" && (
            <a
              href="/checklist"
              className="flex items-center rounded-lg border border-gray-200 p-4 hover:border-[#357AFF]"
            >
              <i className="fa-solid fa-clipboard-check mr-3 text-[#357AFF]"></i>
              <div>
                <div className="font-medium text-gray-800">
                  Equipment Checklist
                </div>
                <div className="text-sm text-gray-600">
                  Perform equipment checks
                </div>
              </div>
            </a>
          )}
          {user.role === "sellee" && (
            <a
              href="/borrow-equipment"
              className="flex items-center rounded-lg border border-gray-200 p-4 hover:border-[#357AFF]"
            >
              <i className="fa-solid fa-hand-holding mr-3 text-[#357AFF]"></i>
              <div>
                <div className="font-medium text-gray-800">
                  Borrow Equipment
                </div>
                <div className="text-sm text-gray-600">
                  Request to borrow equipment
                </div>
              </div>
            </a>
          )}
          <a
            href="/equipment"
            className="flex items-center rounded-lg border border-gray-200 p-4 hover:border-[#357AFF]"
          >
            <i className="fa-solid fa-boxes mr-3 text-[#357AFF]"></i>
            <div>
              <div className="font-medium text-gray-800">Equipment Status</div>
              <div className="text-sm text-gray-600">
                View equipment details
              </div>
            </div>
          </a>
          {["kepala departemen", "superadmin"].includes(user.role) && (
            <>
              <a
                href="/reports"
                className="flex items-center rounded-lg border border-gray-200 p-4 hover:border-[#357AFF]"
              >
                <i className="fa-solid fa-chart-line mr-3 text-[#357AFF]"></i>
                <div>
                  <div className="font-medium text-gray-800">Reports</div>
                  <div className="text-sm text-gray-600">View analytics</div>
                </div>
              </a>
              <a
                href="/maintenance"
                className="flex items-center rounded-lg border border-gray-200 p-4 hover:border-[#357AFF]"
              >
                <i className="fa-solid fa-wrench mr-3 text-[#357AFF]"></i>
                <div>
                  <div className="font-medium text-gray-800">Maintenance</div>
                  <div className="text-sm text-gray-600">
                    Schedule maintenance
                  </div>
                </div>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}