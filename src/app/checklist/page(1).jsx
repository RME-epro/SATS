"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = useUser();
  const [selectedTemplate, setSelectedTemplate] = useState("daily");
  const [checklistItems, setChecklistItems] = useState({});
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const response = await fetch("/api/checklist/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: currentPage,
            limit: 10,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch checklists");
        }

        const data = await response.json();
        setHistory(data.checklists || []);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat riwayat checklist");
      }
    };

    if (user) {
      fetchChecklists();
    }
  }, [user, currentPage]);

  const handleSubmitChecklist = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/checklist/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: 1, // This should be dynamic based on selected equipment
          templateId: 1, // This should be dynamic based on selected template
          items: Object.entries(checklistItems).map(([key, value]) => ({
            itemId: parseInt(key.split("-")[1]),
            status: value ? "completed" : "incomplete",
            notes: "",
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit checklist");
      }

      setChecklistItems({});
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan checklist");
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
        <div className="mb-4 text-xl text-gray-600">
          Silakan masuk untuk mengakses checklist
        </div>
        <a
          href="/account/signin"
          className="rounded-lg bg-[#357AFF] px-6 py-2 text-white hover:bg-[#2E69DE]"
        >
          Masuk
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Checklist Peralatan
          </h1>
          <div className="text-gray-600">
            Teknisi: {user.name || user.email}
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
              Form Checklist
            </h2>
            <form onSubmit={handleSubmitChecklist}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Jenis Checklist
                </label>
                <select
                  name="template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 p-3 focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
                >
                  <option value="daily">Pemeriksaan Harian</option>
                  <option value="weekly">Pemeriksaan Mingguan</option>
                  <option value="monthly">Pemeriksaan Bulanan</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-3 font-medium text-gray-800">
                    Kondisi Mesin
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="item-1"
                        checked={checklistItems["mesin-1"] || false}
                        onChange={(e) =>
                          setChecklistItems({
                            ...checklistItems,
                            "mesin-1": e.target.checked,
                          })
                        }
                        className="h-5 w-5 rounded border-gray-300 text-[#357AFF]"
                      />
                      <label className="ml-3 text-gray-700">
                        Periksa level oli
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="item-2"
                        checked={checklistItems["mesin-2"] || false}
                        onChange={(e) =>
                          setChecklistItems({
                            ...checklistItems,
                            "mesin-2": e.target.checked,
                          })
                        }
                        className="h-5 w-5 rounded border-gray-300 text-[#357AFF]"
                      />
                      <label className="ml-3 text-gray-700">
                        Periksa kebersihan filter
                      </label>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-3 font-medium text-gray-800">Keamanan</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="item-3"
                        checked={checklistItems["keamanan-1"] || false}
                        onChange={(e) =>
                          setChecklistItems({
                            ...checklistItems,
                            "keamanan-1": e.target.checked,
                          })
                        }
                        className="h-5 w-5 rounded border-gray-300 text-[#357AFF]"
                      />
                      <label className="ml-3 text-gray-700">
                        Periksa alat pengaman
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="item-4"
                        checked={checklistItems["keamanan-2"] || false}
                        onChange={(e) =>
                          setChecklistItems({
                            ...checklistItems,
                            "keamanan-2": e.target.checked,
                          })
                        }
                        className="h-5 w-5 rounded border-gray-300 text-[#357AFF]"
                      />
                      <label className="ml-3 text-gray-700">
                        Periksa sistem darurat
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-[#357AFF] px-4 py-3 text-white hover:bg-[#2E69DE]"
              >
                Simpan Checklist
              </button>
            </form>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Riwayat Checklist
            </h2>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {item.template_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(item.completion_date).toLocaleDateString(
                          "id-ID"
                        )}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status === "completed"
                        ? "Selesai"
                        : "Belum Selesai"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;