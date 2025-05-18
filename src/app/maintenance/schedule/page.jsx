"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = use-User();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceSchedule = async () => {
      try {
        const response = await fetch("/api/maintenance/schedule", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch maintenance schedule");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setEvents(data.events);
      } catch (err) {
        console.error(err);
        setError("Failed to load maintenance schedule");
      }
    };

    if (user) {
      fetchMaintenanceSchedule();
    }
  }, [user]);

  const handleScheduleMaintenance = async (formData) => {
    try {
      const response = await fetch("/api/maintenance/schedule/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule maintenance");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setEvents([...events, data.event]);
      setShowScheduleForm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to schedule maintenance");
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    try {
      const response = await fetch("/api/maintenance/schedule/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          start,
          end,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update schedule");
      }

      const updatedEvents = events.map((ev) =>
        ev.id === event.id ? { ...ev, start, end } : ev
      );
      setEvents(updatedEvents);
    } catch (err) {
      console.error(err);
      setError("Failed to update schedule");
    }
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
        <div className="mb-4 text-xl text-gray-600">Please sign in first</div>
        <a
          href="/account/signin?callbackUrl=/maintenance/schedule"
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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Maintenance Schedule
          </h1>
          <button
            onClick={() => setShowScheduleForm(true)}
            className="flex items-center justify-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            Schedule Maintenance
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 rounded-xl bg-white p-6 shadow-lg">
            <div className="h-[600px] w-full">
              <div className="flex h-full items-center justify-center text-gray-500">
                [Calendar View Placeholder - Will integrate with a calendar
                library]
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Upcoming Maintenance
            </h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:border-[#357AFF]"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {event.equipment_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(event.start).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        event.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : event.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showScheduleForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Schedule Maintenance
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleScheduleMaintenance({
                    equipment_id: formData.get("equipment"),
                    start_date: formData.get("start_date"),
                    end_date: formData.get("end_date"),
                    technician_id: formData.get("technician"),
                    notes: formData.get("notes"),
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Equipment
                  </label>
                  <select
                    name="equipment"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2"
                  >
                    <option value="">Select Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assign Technician
                  </label>
                  <select
                    name="technician"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2"
                  >
                    <option value="">Select Technician</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Maintenance Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Equipment
                  </label>
                  <div className="mt-1 text-gray-800">
                    {selectedEvent.equipment_name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Schedule
                  </label>
                  <div className="mt-1 text-gray-800">
                    {new Date(selectedEvent.start).toLocaleString()} -{" "}
                    {new Date(selectedEvent.end).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Technician
                  </label>
                  <div className="mt-1 text-gray-800">
                    {selectedEvent.technician_name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1 text-gray-800">
                    {selectedEvent.status}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <div className="mt-1 text-gray-800">
                    {selectedEvent.notes}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;