import React, { useState } from "react";
import { mockAssets } from "./data/assets";
import StatsCard from "./components/StatsCard";
import AssetTable from "./components/AssetTable";
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [assets, setAssets] = useState(
    JSON.parse(localStorage.getItem("myAssets")) || mockAssets,
  );
  React.useEffect(() => {
    localStorage.setItem("myAssets", JSON.stringify(assets));
  }, [assets]);
  // Filtered data based on search
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serial.toLowerCase().includes(searchTerm.toLowerCase()),
  );
 
  const totalAssets = assets.length;
  const nonCompliant = assets.filter(
    (a) => a.status === "Non-Compliant",
  ).length;
  const complianceRate = (
    ((totalAssets - nonCompliant) / totalAssets) *
    100
  ).toFixed(0);
  const handleExport = () => {
    
    const header = "Asset Name,Type,Status,Assigned To,Serial\n";
    const rows = filteredAssets
      .map((a) => `${a.name},${a.type},${a.status},${a.user},${a.serial}`)
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + header + rows;

   
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Asset_Report_${new Date().toLocaleDateString()}.csv`,
    );
    document.body.appendChild(link);

    link.click(); 
    document.body.removeChild(link);
  };
  const handleAddAsset = () => {
    const newAsset = {
      id: assets.length + 1,
      name: "New Dell Latitude",
      type: "Hardware",
      serial: `DELL-${Math.floor(Math.random() * 1000)}`,
      status: "Compliant",
      user: "New User",
      lastAudit: new Date().toISOString().split("T")[0],
    };

    setAssets([newAsset, ...assets]); 
  };
  const handleDeleteAsset = (id) => {
    if (window.confirm("Are you sure you want to remove this asset?")) {
      const updatedAssets = assets.filter((asset) => asset.id !== id);
      setAssets(updatedAssets);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Asset Auditor Pro
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Enterprise Compliance & Discovery Dashboard
          </p>
        </div>
        <div className="text-sm text-slate-500 font-mono">
          System Status: <span className="text-emerald-500">Live</span>
        </div>
      </header>

      <main>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            title="Total Assets"
            value={totalAssets}
            color="text-white"
          />
          <StatsCard
            title="Compliance Rate"
            value={`${complianceRate}%`}
            color="text-emerald-400"
          />
          <StatsCard
            title="Non-Compliant"
            value={nonCompliant}
            color="text-rose-400"
          />
        </div>

        {/* Asset Table Section */}
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-xl font-semibold text-slate-200">
            Inventory Details
          </h2>

          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <button
              onClick={handleExport}
              className="text-slate-400 hover:text-white text-sm font-semibold transition-colors border-b border-transparent hover:border-white pb-0.5"
            >
              Export Report
            </button>

            <input
              type="text"
              placeholder="Search by name, user or serial..."
              className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm w-full md:w-80 focus:outline-none focus:border-blue-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              onClick={handleAddAsset}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-lg transition-colors font-bold w-full md:w-auto shadow-lg shadow-blue-900/20"
            >
              + Add Asset
            </button>
          </div>
        </div>

        <AssetTable assets={filteredAssets} onDelete={handleDeleteAsset} />
      </main>
    </div>
  );
}

export default App;
