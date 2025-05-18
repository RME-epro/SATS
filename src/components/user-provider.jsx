"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ children }) {
  const [state, setState] = useState({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/hooks/useUser", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setState({
          user: data.user,
          isLoading: false,
          error: data.error,
        });
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          error: error.message,
        });
      }
    }

    fetchUser();
  }, []);

  if (state.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="rounded-lg bg-red-50 p-4 text-red-500">
          <i className="fa-solid fa-circle-exclamation mr-2"></i>
          {state.error}
        </div>
      </div>
    );
  }

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

function StoryComponent() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-semibold">With Authenticated User</h2>
        <MainComponent>
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="text-gray-600">User is authenticated</div>
          </div>
        </MainComponent>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Loading State</h2>
        <MainComponent>
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="text-gray-600">Loading user data...</div>
          </div>
        </MainComponent>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Error State</h2>
        <MainComponent>
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="text-red-500">Error loading user data</div>
          </div>
        </MainComponent>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">No User</h2>
        <MainComponent>
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="text-gray-600">No user authenticated</div>
          </div>
        </MainComponent>
      </div>
    </div>
  );
});
}