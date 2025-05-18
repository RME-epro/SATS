"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  const useUser = () => {
    const context = React.useContext(UserContext);
    
    if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
    }
    
    const { user, loading, error, refetch, setError } = context;
    
    return {
      data: user,
      loading,
      error,
      refetch,
      setError
    };
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">useUser Hook</h2>
        <pre className="rounded bg-gray-100 p-4">
          <code>{`
const { data, loading, error } = useUser();

// Access user data
console.log(data?.email);

// Check loading state
if (loading) return 'Loading...';

// Handle errors
if (error) return error.message;
          `}</code>
        </pre>
      </div>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Inside UserProvider (Valid Usage)
        </h2>
        <UserProvider>
          <MainComponent />
        </UserProvider>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Loading State
        </h2>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-center">
            <div className="text-gray-600">Loading user data...</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Error State
        </h2>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="text-red-500">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            Error: useUser must be used within a UserProvider
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          With User Data
        </h2>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="space-y-2">
            <div className="text-gray-800">
              <span className="font-medium">Email:</span> user@example.com
            </div>
            <div className="text-gray-800">
              <span className="font-medium">Role:</span> admin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
}