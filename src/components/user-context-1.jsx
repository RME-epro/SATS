"use client";
import React from "react";



export default function Index() {
  return (const UserContext = React.createContext({
  user: null,
  loading: false,
  error: null,
  refetch: () => {},
  setError: () => {}
});

function MainComponent() {
  const contextValue = {
    user: {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'superadmin'
    },
    loading: false,
    error: null,
    refetch: () => {},
    setError: () => {}
  };

  return (
    <></>
  );
}

function StoryComponent() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          With User Data
        </h2>
        <MainComponent />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Loading State
        </h2>
        <></>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Error State
        </h2>
        <></>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          No User
        </h2>
        <></>
      </div>
    </div>
  );
});
}