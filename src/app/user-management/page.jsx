"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [error, setError] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search: searchTerm, role: roleFilter }),
        });
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
  }, [user, searchTerm, roleFilter]);

  const handleUserAction = async (action, userData) => {
    try {
      const response = await fetch(`/api/users/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setUsers(
        users.map((u) => (u.id === userData.id ? { ...u, ...data.user } : u))
      );
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} user`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "superadmin") {
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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <button
            onClick={() => {
              setModalMode("add");
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="flex items-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Add New User
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:border-[#357AFF] focus:outline-none"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 focus:border-[#357AFF] focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div className="rounded-xl bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap px-6 py-4">{user.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModalMode("edit");
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModalMode("reset");
                            setIsModalOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          <i className="fa-solid fa-key"></i>
                        </button>
                        <button
                          onClick={() =>
                            handleUserAction("toggle-status", {
                              id: user.id,
                              active: !user.active,
                            })
                          }
                          className={`${
                            user.active
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          <i
                            className={`fa-solid ${
                              user.active ? "fa-ban" : "fa-check"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {modalMode === "add"
                    ? "Add New User"
                    : modalMode === "edit"
                    ? "Edit User"
                    : "Reset Password"}
                </h3>
              </div>
              {modalMode !== "reset" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    handleUserAction(
                      modalMode === "add" ? "create" : "update",
                      {
                        id: selectedUser?.id,
                        name: formData.get("name"),
                        email: formData.get("email"),
                        role: formData.get("role"),
                        password: formData.get("password"),
                      }
                    );
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedUser?.name}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={selectedUser?.email}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      name="role"
                      defaultValue={selectedUser?.role || "user"}
                      className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>
                  {modalMode === "add" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2"
                        required
                      />
                    </div>
                  )}
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                    >
                      {modalMode === "add" ? "Create User" : "Update User"}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <p className="mb-4 text-sm text-gray-500">
                    Are you sure you want to reset the password for{" "}
                    {selectedUser?.email}?
                  </p>
                  <div className="mt-5 sm:mt-6">
                    <button
                      onClick={() =>
                        handleUserAction("reset-password", {
                          id: selectedUser?.id,
                        })
                      }
                      className="w-full rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;