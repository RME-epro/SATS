"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "tekhnisi",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/list", { method: "POST" });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setUsers(data.users);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setUsers([...users, data.user]);
      setNewUser({ email: "", name: "", role: "tekhnisi" });
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || !users.find((u) => u.role === "superadmin")) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="mb-4 text-xl text-gray-600">
          Access denied. Superadmin privileges required.
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
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
          >
            <i className="fa-solid fa-user-plus mr-2"></i>
            Create User
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Create User
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                >
                  <option value="kepala departemen">Kepala Departemen</option>
                  <option value="tekhnisi">Tekhnisi</option>
                  <option value="mekanik">Mekanik</option>
                  <option value="ts admin">TS Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-white hover:bg-[#2E69DE]"
              >
                Create User
              </button>
            </form>
          </div>
        )}

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Role
                  </th>
                  <th className="pb-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-4">{user.name}</td>
                    <td className="py-4">{user.email}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="mr-2 rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200">
                        <i className="fa-solid fa-edit"></i>
                      </button>
                      <button className="rounded-lg bg-red-50 px-3 py-1 text-sm text-red-600 hover:bg-red-100">
                        <i className="fa-solid fa-trash"></i>
                      </button>
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