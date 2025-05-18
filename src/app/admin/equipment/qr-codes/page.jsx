"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading } = use-User();
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("/api/equipment/list", { method: "POST" });
        if (!response.ok) {
          throw new Error("Failed to fetch equipment");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setEquipment(data.equipment);
      } catch (err) {
        console.error(err);
        setError("Failed to load equipment list");
      }
    };

    if (user) {
      fetchEquipment();
    }
  }, [user]);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!selectedEquipment) return;

      try {
        const equipmentUrl = `${window.location.origin}/equipment/${selectedEquipment.id}`;
        const response = await fetch(
          `/integrations/qr-code/generatebasicbase64?data=${encodeURIComponent(
            equipmentUrl
          )}&size=300`
        );

        if (!response.ok) {
          throw new Error("Failed to generate QR code");
        }

        const base64Data = await response.text();
        setQrCode(base64Data);
      } catch (err) {
        console.error(err);
        setError("Failed to generate QR code");
      }
    };

    generateQRCode();
  }, [selectedEquipment]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Equipment QR Code</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
            img { max-width: 300px; }
            .details { text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <img src="${qrCode}" alt="Equipment QR Code"/>
          <div class="details">
            <h2>${selectedEquipment?.name || ""}</h2>
            <p>${selectedEquipment?.type || ""}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [qrCode, selectedEquipment]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-code-${selectedEquipment?.id || "equipment"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrCode, selectedEquipment]);

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
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Equipment QR Code Management
          </h1>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Equipment List
            </h2>
            <div className="space-y-4">
              {equipment.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedEquipment(item)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-[#357AFF] ${
                    selectedEquipment?.id === item.id
                      ? "border-[#357AFF]"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-600">{item.type}</div>
                    </div>
                    <i className="fa-solid fa-qrcode text-gray-400"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              QR Code Preview
            </h2>
            {selectedEquipment ? (
              <div className="flex flex-col items-center">
                {qrCode && (
                  <div className="mb-6 rounded-lg border border-gray-200 p-4">
                    <img
                      src={qrCode}
                      alt={`QR Code for ${selectedEquipment.name}`}
                      className="h-[300px] w-[300px]"
                    />
                  </div>
                )}
                <div className="mb-4 text-center">
                  <div className="font-medium text-gray-800">
                    {selectedEquipment.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedEquipment.type}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handlePrint}
                    className="flex items-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                  >
                    <i className="fa-solid fa-print mr-2"></i>
                    Print
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                  >
                    <i className="fa-solid fa-download mr-2"></i>
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                Select equipment to generate QR code
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;