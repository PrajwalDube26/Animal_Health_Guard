import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FarmContext } from "../../context/FarmContext";
import "./Updatefarm.css";

const Updatefarm = ({ show = true, onClose, farmId }) => {
  const { id: paramId } = useParams();
  const currentId = farmId || paramId;

  const { getFarmById, updateFarm, farms } = useContext(FarmContext);
  const navigate = useNavigate();

  const [farmData, setFarmData] = useState({
    farmName: "",
    farmType: "",
    location: "",
    size: "",
    numberOfAnimals: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Load existing farm details
  useEffect(() => {
    const fetchFarmDetails = async () => {
      if (!currentId) return;

      setFetching(true);
      try {
        const farm = await getFarmById(currentId);
        if (farm) {
          setFarmData({
            farmName: farm.farmName || "",
            farmType: farm.farmType || "",
            location: farm.location || "",
            size: farm.size || "",
            numberOfAnimals: farm.numberOfAnimals || "",
          });
        } else if (farms && farms.length > 0) {
          const matched = farms.find((f) => f._id === currentId);
          if (matched) {
            setFarmData({
              farmName: matched.farmName || "",
              farmType: matched.farmType || "",
              location: matched.location || "",
              size: matched.size || "",
              numberOfAnimals: matched.numberOfAnimals || "",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching farm:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchFarmDetails();
  }, [currentId]);

  const handleChange = (e) => {
    setFarmData({
      ...farmData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else if (currentId) {
      navigate(`/getsinglefarm/${currentId}`);
    } else {
      navigate("/getfarm");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!farmData.farmName.trim()) {
      setErrorMsg("Farm name is required.");
      return;
    }

    if (!farmData.farmType) {
      setErrorMsg("Please select a farm type.");
      return;
    }

    if (!farmData.location.trim()) {
      setErrorMsg("Location is required.");
      return;
    }

    if (!farmData.size) {
      setErrorMsg("Farm size is required.");
      return;
    }

    if (!farmData.numberOfAnimals || Number(farmData.numberOfAnimals) <= 0) {
      setErrorMsg("Number of animals must be at least 1.");
      return;
    }

    setLoading(true);

    try {
      const updated = await updateFarm(
        currentId,
        farmData.farmName,
        farmData.farmType,
        farmData.location,
        farmData.size,
        Number(farmData.numberOfAnimals)
      );

      if (updated) {
        setSuccessMsg("Farm updated successfully!");
        setTimeout(() => {
          if (onClose) {
            onClose();
          } else {
            navigate(`/getsinglefarm/${currentId}`);
          }
        }, 1200);
      } else {
        setErrorMsg("Failed to update farm. Please try again.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setErrorMsg("An unexpected error occurred while updating the farm.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="updatefarm-container">
      <div className="update-farm-card">
        <div className="update-farm-header">
          <div className="header-text-wrapper">
            <h2 className="update-farm-title">Update Farm Details</h2>
            <p className="update-farm-subtitle">Modify your farm information below</p>
          </div>
          <button
            type="button"
            className="btn-close-farm"
            aria-label="Cancel"
            onClick={handleCancel}
            title="Cancel & Go Back"
          >
            ✕
          </button>
        </div>

        {fetching ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading farm details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="update-farm-form">
            <div className="update-farm-body">
              {errorMsg && (
                <div className="custom-alert alert-danger" role="alert">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="custom-alert alert-success" role="alert">
                  {successMsg}
                </div>
              )}

              {/* Farm Name */}
              <div className="form-group-farm">
                <label htmlFor="farmName" className="form-label-farm">
                  Farm Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="farmName"
                  name="farmName"
                  className="form-control-farm"
                  placeholder="e.g. Green Valley Farm"
                  value={farmData.farmName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Farm Type */}
              <div className="form-group-farm">
                <label htmlFor="farmType" className="form-label-farm">
                  Farm Type <span className="required-star">*</span>
                </label>
                <select
                  id="farmType"
                  name="farmType"
                  className="form-control-farm select-farm"
                  value={farmData.farmType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Farm Type</option>
                  <option value="dairy">Dairy</option>
                  <option value="poultry">Poultry</option>
                  <option value="goat">Goat</option>
                  <option value="sheep">Sheep</option>
                  <option value="pig">Pig</option>
                </select>
              </div>

              {/* Location */}
              <div className="form-group-farm">
                <label htmlFor="location" className="form-label-farm">
                  Location / Village <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control-farm"
                  placeholder="e.g. Pune District"
                  value={farmData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Farm Size */}
              <div className="form-group-farm">
                <label htmlFor="size" className="form-label-farm">
                  Farm Size (Acres / Area) <span className="required-star">*</span>
                </label>
                <input
                  type="number"
                  id="size"
                  name="size"
                  className="form-control-farm"
                  placeholder="e.g. 5"
                  value={farmData.size}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Number of Animals */}
              <div className="form-group-farm">
                <label htmlFor="numberOfAnimals" className="form-label-farm">
                  Number of Animals <span className="required-star">*</span>
                </label>
                <input
                  type="number"
                  id="numberOfAnimals"
                  name="numberOfAnimals"
                  className="form-control-farm"
                  placeholder="e.g. 25"
                  value={farmData.numberOfAnimals}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="update-farm-footer">
              <button
                type="button"
                className="farm-btn farm-btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="farm-btn farm-btn-save"
                disabled={loading}
              >
                {loading ? "Saving Changes..." : "Save Farm Details"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Updatefarm;
