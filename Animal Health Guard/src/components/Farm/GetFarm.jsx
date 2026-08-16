import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FarmContext } from "../../context/FarmContext";
import "./GetFarm.css";

const FARM_TYPE_CONFIG = {
  dairy: { label: "🐄 Dairy Farm", class: "dairy" },
  poultry: { label: "🐔 Poultry Farm", class: "poultry" },
  pig: { label: "🐖 Pig Farm", class: "pig" },
  goat: { label: "🐐 Goat Farm", class: "goat" },
  sheep: { label: "🐑 Sheep Farm", class: "sheep" },
};

const GetFarm = () => {
  const navigate = useNavigate();
  const { farms, getUserFarms } = useContext(FarmContext);

  const [loading, setLoading] = useState(true);
  const [filterFarmType, setFilterFarmType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      await getUserFarms();
    } catch (err) {
      console.error("Error loading farms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredFarms = (farms || []).filter((farm) => {
    const matchesFarmType =
      filterFarmType === "all" ||
      (farm.farmType && farm.farmType.toLowerCase() === filterFarmType.toLowerCase());

    const term = searchTerm.toLowerCase();
    const farmName = (farm.farmName || "").toLowerCase();
    const location = (farm.location || "").toLowerCase();
    const farmTypeStr = (farm.farmType || "").toLowerCase();
    const farmId = (farm._id || "").toLowerCase();

    const matchesSearch =
      !term ||
      farmName.includes(term) ||
      location.includes(term) ||
      farmTypeStr.includes(term) ||
      farmId.includes(term);

    return matchesFarmType && matchesSearch;
  });

  return (
    <div className="user-farm-page">
      <div className="user-farm-container">
        {/* Hero Section */}
        <div className="user-farm-hero">
          <div className="farm-hero-tag">🚜 Livestock & Agricultural Holdings</div>
          <div className="farm-hero-main-row">
            <div>
              <h1 className="user-farm-title">
                <span>🌾</span> My Registered Farms
              </h1>
              <p className="user-farm-subtitle">
                Manage and monitor your livestock farms, track animal population counts, and conduct biosecurity readiness audits.
              </p>
            </div>

            <Link to="/addfarm" className="btn-add-farm-hero">
              ➕ Add New Farm
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="user-farm-metrics">
            <div
              className={`farm-metric-pill total ${filterFarmType === "all" ? "active" : ""}`}
              onClick={() => setFilterFarmType("all")}
            >
              <span className="pill-num">{(farms || []).length}</span>
              <span className="pill-txt">Total Farms</span>
            </div>

            <div
              className={`farm-metric-pill dairy ${filterFarmType === "dairy" ? "active" : ""}`}
              onClick={() => setFilterFarmType(filterFarmType === "dairy" ? "all" : "dairy")}
            >
              <span className="pill-num">
                {(farms || []).filter((f) => f.farmType?.toLowerCase() === "dairy").length}
              </span>
              <span className="pill-txt">🐄 Dairy</span>
            </div>

            <div
              className={`farm-metric-pill poultry ${filterFarmType === "poultry" ? "active" : ""}`}
              onClick={() => setFilterFarmType(filterFarmType === "poultry" ? "all" : "poultry")}
            >
              <span className="pill-num">
                {(farms || []).filter((f) => f.farmType?.toLowerCase() === "poultry").length}
              </span>
              <span className="pill-txt">🐔 Poultry</span>
            </div>

            <div
              className={`farm-metric-pill goat ${filterFarmType === "goat" || filterFarmType === "sheep" ? "active" : ""}`}
              onClick={() => setFilterFarmType(filterFarmType === "goat" ? "all" : "goat")}
            >
              <span className="pill-num">
                {(farms || []).filter((f) => ["goat", "sheep", "pig"].includes(f.farmType?.toLowerCase())).length}
              </span>
              <span className="pill-txt">🐐 Small Stock & Pigs</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="user-farm-toolbar">
          <div className="farm-search-wrapper">
            <span className="search-ico">🔍</span>
            <input
              type="text"
              placeholder="Search by farm name, location, ID, or livestock type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="user-farm-search-input"
            />
            {searchTerm && (
              <button
                className="btn-clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="farm-filter-wrapper">
            <label className="filter-title">Farm Category:</label>
            <select
              value={filterFarmType}
              onChange={(e) => setFilterFarmType(e.target.value)}
              className="user-farm-select"
            >
              <option value="all">All Farm Types ({(farms || []).length})</option>
              <option value="dairy">🐄 Dairy Farm</option>
              <option value="poultry">🐔 Poultry Farm</option>
              <option value="pig">🐖 Pig Farm</option>
              <option value="goat">🐐 Goat Farm</option>
              <option value="sheep">🐑 Sheep Farm</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="user-farm-loading">
            <div className="farm-spinner"></div>
            <p>Loading your farm profiles...</p>
          </div>
        ) : filteredFarms.length === 0 ? (
          <div className="user-farm-empty">
            <div className="empty-ico">🌾</div>
            <h3>No Farms Found</h3>
            <p>
              {searchTerm || filterFarmType !== "all"
                ? "No farm records match your selected search or category filter."
                : "You have not registered any farm holdings yet."}
            </p>
            {searchTerm || filterFarmType !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setFilterFarmType("all");
                  setSearchTerm("");
                }}
                className="btn-reset-filters"
              >
                🔄 Reset Filters
              </button>
            ) : (
              <Link to="/addfarm" className="btn-add-first-farm">
                ➕ Add Your First Farm
              </Link>
            )}
          </div>
        ) : (
          <div className="user-farm-grid">
            {filteredFarms.map((farm) => {
              const fConfig = FARM_TYPE_CONFIG[farm.farmType?.toLowerCase()] || {
                label: `🐾 ${farm.farmType || "Livestock"} Farm`,
                class: "default",
              };

              return (
                <div key={farm._id} className="user-farm-card">
                  {/* Top Bar */}
                  <div className="user-farm-card-top">
                    <div className="farm-id-badge">
                      <span>🚜</span> ID: {farm._id.slice(-6).toUpperCase()}
                    </div>

                    <span className={`farm-badge-pill ${fConfig.class}`}>
                      {fConfig.label}
                    </span>
                  </div>

                  {/* Farm Title */}
                  <h3 className="user-farm-card-title">
                    {farm.farmName}
                  </h3>

                  {/* Info Meter / Stats Box */}
                  <div className="user-farm-stats-box">
                    <div className="stats-meter">
                      <span className="meter-val">{farm.numberOfAnimals || 0}</span>
                      <span className="meter-lbl">Animals</span>
                    </div>

                    <div className="stats-details-col">
                      <div className="stat-row">
                        <span className="stat-label">📍 Location:</span>
                        <span className="stat-val">{farm.location || "N/A"}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">📐 Farm Size:</span>
                        <span className="stat-val">{farm.size} Acres</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">🕒 Registered:</span>
                        <span className="stat-val">{formatDate(farm.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="user-farm-card-footer">
                    <button
                      type="button"
                      onClick={() => navigate(`/getsinglefarm/${farm._id}`)}
                      className="btn-farm-action view"
                    >
                      🚜 View Farm
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/getrecord/${farm._id}`)}
                      className="btn-farm-action records"
                    >
                      📋 Records
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/farmassignments/${farm._id}`)}
                      className="btn-farm-action audit"
                    >
                      🛡️ Audits
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetFarm;